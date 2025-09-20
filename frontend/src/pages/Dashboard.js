import React from 'react';
import { useQuery } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { batchesAPI } from '../services/api';
import {
  CubeIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  
  const { data: batchesData, isLoading } = useQuery(
    'dashboard-batches',
    () => batchesAPI.getBatches({ limit: 10 }),
    {
      enabled: user?.role !== 'consumer'
    }
  );

  const batches = batchesData?.data?.batches || [];
  
  const stats = {
    totalBatches: batches.length,
    activeBatches: batches.filter(b => !['SOLD', 'RECALLED'].includes(b.status)).length,
    recalledBatches: batches.filter(b => b.recall?.isRecalled).length,
    recentBatches: batches.slice(0, 5)
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="py-12" />;
  }

  const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-md bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.username}! Here's what's happening with your supply chain.
        </p>
      </div>

      {user?.role !== 'consumer' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Batches"
              value={stats.totalBatches}
              icon={CubeIcon}
              color="primary"
            />
            <StatCard
              title="Active Batches"
              value={stats.activeBatches}
              icon={CheckCircleIcon}
              color="success"
            />
            <StatCard
              title="Recalled Batches"
              value={stats.recalledBatches}
              icon={ExclamationTriangleIcon}
              color="danger"
            />
            <StatCard
              title="Recent Activity"
              value={stats.recentBatches.length}
              icon={ChartBarIcon}
              color="warning"
            />
          </div>

          {/* Recent Batches */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Batches</h3>
            {stats.recentBatches.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Batch ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crop
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Harvest Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentBatches.map((batch) => (
                      <tr key={batch._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {batch.batchId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {batch.crop}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(batch.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(batch.harvestDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {batch.currentOwner}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No batches</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new batch.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Consumer Dashboard */}
      {user?.role === 'consumer' && (
        <div className="card">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to Food Trust
            </h3>
            <p className="text-gray-500 mb-6">
              Scan QR codes on your food products to trace their journey from farm to table.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <CheckCircleIcon className="h-5 w-5 text-success-500" />
                <span>Verify product authenticity</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <CheckCircleIcon className="h-5 w-5 text-success-500" />
                <span>View complete supply chain history</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <CheckCircleIcon className="h-5 w-5 text-success-500" />
                <span>Check for recalls and safety alerts</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
