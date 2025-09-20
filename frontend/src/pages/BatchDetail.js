import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { batchesAPI } from '../services/api';
import { 
  ArrowLeftIcon,
  QrCodeIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const BatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: batch, isLoading, error } = useQuery(
    ['batch', id],
    () => batchesAPI.getBatch(id),
    {
      enabled: !!id
    }
  );

  const { data: history } = useQuery(
    ['batch-history', id],
    () => batchesAPI.getBatchHistory(id),
    {
      enabled: !!id
    }
  );

  const transferMutation = useMutation(batchesAPI.transferBatch, {
    onSuccess: () => {
      toast.success('Batch transferred successfully!');
      // Refetch batch data
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to transfer batch');
    }
  });

  const handleTransfer = async (newOwner) => {
    if (!batch?.data) return;
    
    await transferMutation.mutateAsync({
      batchId: batch.data.batchId,
      newOwner,
      transferReason: 'Supply chain transfer'
    });
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

  const getStageIcon = (stage) => {
    switch (stage) {
      case 'FARM':
        return <MapPinIcon className="h-5 w-5" />;
      case 'PROCESSING':
        return <BuildingStorefrontIcon className="h-5 w-5" />;
      case 'DISTRIBUTION':
        return <TruckIcon className="h-5 w-5" />;
      case 'RETAIL':
        return <BuildingStorefrontIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-12" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading batch: {error.message}</p>
        <button 
          onClick={() => navigate('/batches')}
          className="btn btn-primary mt-4"
        >
          Back to Batches
        </button>
      </div>
    );
  }

  if (!batch?.data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Batch not found</p>
        <button 
          onClick={() => navigate('/batches')}
          className="btn btn-primary mt-4"
        >
          Back to Batches
        </button>
      </div>
    );
  }

  const batchData = batch.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/batches')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{batchData.batchId}</h1>
            <p className="text-sm text-gray-500">{batchData.crop} - {batchData.variety || 'Standard'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(batchData.status)}
          <button
            onClick={() => navigate(`/scan/${batchData.batchId}`)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <QrCodeIcon className="h-4 w-4" />
            <span>View QR</span>
          </button>
        </div>
      </div>

      {/* Recall Alert */}
      {batchData.recall?.isRecalled && (
        <div className="card border-red-200 bg-red-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Product Recall Alert</h3>
              <div className="mt-2 text-sm text-red-700">
                <p><strong>Reason:</strong> {batchData.recall.reason}</p>
                <p><strong>Date:</strong> {new Date(batchData.recall.recallDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'timeline', name: 'Timeline' },
            { id: 'quality', name: 'Quality' },
            { id: 'sensors', name: 'Sensor Data' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Batch ID</dt>
                <dd className="text-sm text-gray-900">{batchData.batchId}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Crop</dt>
                <dd className="text-sm text-gray-900">{batchData.crop}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Variety</dt>
                <dd className="text-sm text-gray-900">{batchData.variety || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Harvest Date</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(batchData.harvestDate).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                <dd className="text-sm text-gray-900">
                  {batchData.quantity?.amount} {batchData.quantity?.unit}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Owner</dt>
                <dd className="text-sm text-gray-900">{batchData.currentOwner}</dd>
              </div>
            </dl>
          </div>

          {/* Farm Location */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Farm Location</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Farm Name</dt>
                <dd className="text-sm text-gray-900">{batchData.farmLocation?.farmName || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="text-sm text-gray-900">{batchData.farmLocation?.address || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Coordinates</dt>
                <dd className="text-sm text-gray-900">
                  {batchData.farmLocation?.latitude && batchData.farmLocation?.longitude
                    ? `${batchData.farmLocation.latitude}, ${batchData.farmLocation.longitude}`
                    : 'N/A'
                  }
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Supply Chain Timeline</h3>
          {history?.data?.timeline ? (
            <div className="flow-root">
              <ul className="-mb-8">
                {history.data.timeline.map((event, eventIdx) => (
                  <li key={eventIdx}>
                    <div className="relative pb-8">
                      {eventIdx !== history.data.timeline.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                            {getStageIcon(event.stage)}
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
                            {event.notes && (
                              <p className="text-sm text-gray-500 mt-1">{event.notes}</p>
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
          ) : (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Timeline Data</h3>
              <p className="text-gray-500">Timeline information is not available for this batch.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'quality' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Grade</dt>
                <dd className="text-sm text-gray-900">{batchData.quality?.grade || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Certifications</dt>
                <dd className="text-sm text-gray-900">
                  {batchData.quality?.certifications?.join(', ') || 'None'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Quality Score</dt>
                <dd className="text-sm text-gray-900">
                  {batchData.quality?.score ? `${batchData.quality.score}/100` : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Results</h3>
            <div className="space-y-3">
              {batchData.quality?.testResults?.map((test, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{test.name}</span>
                  <span className={`text-sm font-medium ${
                    test.passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {test.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              )) || (
                <p className="text-sm text-gray-500">No test results available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sensors' && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sensor Data</h3>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sensor Data Not Available</h3>
            <p className="text-gray-500 mb-4">
              IoT sensor data will be available when devices are connected to this batch.
            </p>
            <button
              onClick={() => navigate('/iot')}
              className="btn btn-primary"
            >
              View IoT Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/scan/${batchData.batchId}`)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <QrCodeIcon className="h-4 w-4" />
            <span>View QR Code</span>
          </button>
          
          {batchData.status !== 'SOLD' && batchData.status !== 'RECALLED' && (
            <button
              onClick={() => handleTransfer('Next Owner')}
              disabled={transferMutation.isLoading}
              className="btn btn-primary flex items-center space-x-2"
            >
              <UserIcon className="h-4 w-4" />
              <span>Transfer Ownership</span>
            </button>
          )}
          
          <button
            onClick={() => navigate('/iot')}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>View Sensor Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchDetail;
