import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { iotAPI } from '../services/api';
import { 
  CpuChipIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const IoTDashboard = () => {
  const [selectedBatch, setSelectedBatch] = useState('');
  const [timeRange, setTimeRange] = useState('24h');

  const { data: devices, isLoading: devicesLoading } = useQuery(
    'iot-devices',
    iotAPI.getDevices
  );

  const { data: sensorData, isLoading: dataLoading } = useQuery(
    ['iot-sensor-data', selectedBatch, timeRange],
    () => iotAPI.getSensorData({ batchId: selectedBatch, timeRange }),
    {
      enabled: !!selectedBatch
    }
  );

  const { data: alerts, isLoading: alertsLoading } = useQuery(
    'iot-alerts',
    iotAPI.getAlerts
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatValue = (value, unit) => {
    if (typeof value === 'number') {
      return `${value.toFixed(2)} ${unit}`;
    }
    return `${value} ${unit}`;
  };

  const isValueInRange = (value, min, max) => {
    return value >= min && value <= max;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">IoT Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor sensor data and device status across the supply chain.
        </p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="input"
            >
              <option value="">All Batches</option>
              <option value="BATCH001">BATCH001 - Tomatoes</option>
              <option value="BATCH002">BATCH002 - Wheat</option>
              <option value="BATCH003">BATCH003 - Corn</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Device Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CpuChipIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Devices</p>
              <p className="text-2xl font-semibold text-gray-900">
                {devicesLoading ? '...' : devices?.data?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Online Devices</p>
              <p className="text-2xl font-semibold text-gray-900">
                {devicesLoading ? '...' : 
                  devices?.data?.filter(d => d.status === 'online').length || 0
                }
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {alertsLoading ? '...' : alerts?.data?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Device List */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Devices</h3>
        {devicesLoading ? (
          <LoadingSpinner size="lg" className="py-8" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Reading
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices?.data?.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CpuChipIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {device.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {device.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(device.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.lastReading 
                        ? new Date(device.lastReading).toLocaleString()
                        : 'Never'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sensor Data Charts */}
      {selectedBatch && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature Chart */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Temperature</h3>
            {dataLoading ? (
              <LoadingSpinner size="lg" className="py-8" />
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {sensorData?.data?.temperature?.current 
                      ? formatValue(sensorData.data.temperature.current, '°C')
                      : 'N/A'
                    }
                  </div>
                  <div className="text-sm text-gray-500">Current Temperature</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Min: {sensorData?.data?.temperature?.min ? formatValue(sensorData.data.temperature.min, '°C') : 'N/A'}</span>
                    <span>Max: {sensorData?.data?.temperature?.max ? formatValue(sensorData.data.temperature.max, '°C') : 'N/A'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, Math.max(0, 
                          ((sensorData?.data?.temperature?.current || 0) - 0) / (40 - 0) * 100
                        ))}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Range: 0°C - 40°C
                    {sensorData?.data?.temperature?.current && 
                      !isValueInRange(sensorData.data.temperature.current, 0, 40) && (
                        <span className="text-red-500 ml-2">⚠️ Out of range</span>
                      )
                    }
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Humidity Chart */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Humidity</h3>
            {dataLoading ? (
              <LoadingSpinner size="lg" className="py-8" />
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {sensorData?.data?.humidity?.current 
                      ? formatValue(sensorData.data.humidity.current, '%')
                      : 'N/A'
                    }
                  </div>
                  <div className="text-sm text-gray-500">Current Humidity</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Min: {sensorData?.data?.humidity?.min ? formatValue(sensorData.data.humidity.min, '%') : 'N/A'}</span>
                    <span>Max: {sensorData?.data?.humidity?.max ? formatValue(sensorData.data.humidity.max, '%') : 'N/A'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, Math.max(0, 
                          (sensorData?.data?.humidity?.current || 0)
                        ))}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Range: 0% - 100%
                    {sensorData?.data?.humidity?.current && 
                      !isValueInRange(sensorData.data.humidity.current, 0, 100) && (
                        <span className="text-red-500 ml-2">⚠️ Out of range</span>
                      )
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Alerts */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Alerts</h3>
        {alertsLoading ? (
          <LoadingSpinner size="lg" className="py-8" />
        ) : alerts?.data?.length > 0 ? (
          <div className="space-y-3">
            {alerts.data.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-yellow-800">
                    {alert.title}
                  </div>
                  <div className="text-sm text-yellow-700">
                    {alert.message}
                  </div>
                  <div className="text-xs text-yellow-600 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Alerts</h3>
            <p className="text-gray-500">All systems are operating normally.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IoTDashboard;
