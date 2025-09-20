import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { qrAPI } from '../services/api';
import { QrCodeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const QRScanner = () => {
  const { batchId } = useParams();
  const [qrData, setQrData] = useState(batchId || '');

  const { data: scanResult, isLoading, error, refetch } = useQuery(
    ['qr-scan', qrData],
    () => qrAPI.scanQR(qrData),
    {
      enabled: !!qrData && qrData !== batchId,
      retry: false
    }
  );

  const { data: traceResult } = useQuery(
    ['qr-trace', qrData],
    () => qrAPI.getTrace(qrData),
    {
      enabled: !!qrData && scanResult?.success
    }
  );

  useEffect(() => {
    if (batchId) {
      setQrData(batchId);
    }
  }, [batchId]);

  const handleQRInput = (e) => {
    setQrData(e.target.value);
  };

  const handleScan = () => {
    if (qrData.trim()) {
      refetch();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleScan();
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      CREATED: { color: 'info', text: 'Created' },
      PROCESSING: { color: 'warning', text: 'Processing' },
      PACKAGED: { color: 'info', text: 'Packaged' },
      IN_TRANSIT: { color: 'warning', text: 'In Transit' },
      IN_STORE: { color: 'success', text: 'In Store' },
      SOLD: { color: 'success', text: 'Sold' },
      RECALLED: { color: 'danger', text: 'Recalled' }
    };
    
    const config = statusConfig[status] || { color: 'info', text: status };
    return <span className={`badge badge-${config.color}`}>{config.text}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QR Code Scanner</h1>
        <p className="mt-1 text-sm text-gray-500">
          Scan or enter a QR code to trace the product's journey through the supply chain.
        </p>
      </div>

      {/* QR Input */}
      <div className="card">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              QR Code or Batch ID
            </label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <QrCodeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={qrData}
                  onChange={handleQRInput}
                  onKeyPress={handleKeyPress}
                  className="input pl-10"
                  placeholder="Enter QR code data or batch ID"
                />
              </div>
              <button
                onClick={handleScan}
                disabled={!qrData.trim() || isLoading}
                className="btn btn-primary flex items-center space-x-2"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                <span>Scan</span>
              </button>
            </div>
          </div>

          {/* Camera placeholder for future implementation */}
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">Camera QR Scanner</p>
            <p className="text-sm text-gray-400">
              Camera scanning will be available in the mobile app
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500">Scanning QR code...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="card">
          <div className="text-center py-8">
            <div className="text-red-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-500 mb-4">
              The QR code you scanned doesn't match any product in our system.
            </p>
            <button
              onClick={() => setQrData('')}
              className="btn btn-secondary"
            >
              Try Another Code
            </button>
          </div>
        </div>
      )}

      {/* Scan Results */}
      {scanResult?.success && (
        <div className="space-y-6">
          {/* Product Information */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Batch ID</dt>
                    <dd className="text-sm text-gray-900">{scanResult.data.batchId}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Crop</dt>
                    <dd className="text-sm text-gray-900">{scanResult.data.crop}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Variety</dt>
                    <dd className="text-sm text-gray-900">{scanResult.data.variety || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Harvest Date</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(scanResult.data.harvestDate).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm">{getStatusBadge(scanResult.data.status)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Current Owner</dt>
                    <dd className="text-sm text-gray-900">{scanResult.data.currentOwner}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Farm</dt>
                    <dd className="text-sm text-gray-900">{scanResult.data.farmLocation?.farmName || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(scanResult.data.lastUpdated).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Quality Information */}
          {scanResult.data.quality && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Grade</dt>
                  <dd className="text-sm text-gray-900">{scanResult.data.quality.grade || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Certifications</dt>
                  <dd className="text-sm text-gray-900">
                    {scanResult.data.quality.certifications?.join(', ') || 'None'}
                  </dd>
                </div>
              </div>
            </div>
          )}

          {/* Recall Information */}
          {scanResult.data.recall?.isRecalled && (
            <div className="card border-red-200 bg-red-50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Product Recall Alert</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p><strong>Reason:</strong> {scanResult.data.recall.reason}</p>
                    <p><strong>Date:</strong> {new Date(scanResult.data.recall.recallDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Supply Chain Timeline */}
          {traceResult?.data?.timeline && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Supply Chain Timeline</h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {traceResult.data.timeline.map((event, eventIdx) => (
                    <li key={eventIdx}>
                      <div className="relative pb-8">
                        {eventIdx !== traceResult.data.timeline.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium text-gray-900">{event.action}</span>
                                {' '}by {event.actor}
                              </p>
                              {event.previousOwner && event.newOwner && (
                                <p className="text-sm text-gray-500">
                                  Transferred from {event.previousOwner} to {event.newOwner}
                                </p>
                              )}
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              {new Date(event.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
