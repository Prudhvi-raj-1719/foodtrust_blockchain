import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { regulatorAPI } from '../services/api';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon, 
  DocumentMagnifyingGlassIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const RegulatorDashboard = () => {
  const [auditStatus, setAuditStatus] = useState('');

  const { data: stats, isLoading: statsLoading } = useQuery(
    'regulator-stats',
    regulatorAPI.getStats
  );

  const { data: audits, isLoading: auditsLoading } = useQuery(
    ['regulator-audits', auditStatus],
    () => regulatorAPI.getAudits({ status: auditStatus })
  );

  const { data: recalls, isLoading: recallsLoading } = useQuery(
    'regulator-recalls',
    regulatorAPI.getRecalls
  );

  const { data: compliance, isLoading: complianceLoading } = useQuery(
    'regulator-compliance',
    regulatorAPI.getComplianceReport
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: 'warning', text: 'Pending' },
      IN_PROGRESS: { color: 'info', text: 'In Progress' },
      COMPLETED: { color: 'success', text: 'Completed' },
      FAILED: { color: 'danger', text: 'Failed' },
      ACTIVE: { color: 'success', text: 'Active' },
      RESOLVED: { color: 'info', text: 'Resolved' }
    };
    
    const config = statusConfig[status] || { color: 'info', text: status };
    return <span className={`badge badge-${config.color}`}>{config.text}</span>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      LOW: { color: 'info', text: 'Low' },
      MEDIUM: { color: 'warning', text: 'Medium' },
      HIGH: { color: 'danger', text: 'High' },
      CRITICAL: { color: 'danger', text: 'Critical' }
    };
    
    const config = priorityConfig[priority] || { color: 'info', text: priority };
    return <span className={`badge badge-${config.color}`}>{config.text}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Regulator Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Monitor compliance, conduct audits, and manage recalls across the supply chain.
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentMagnifyingGlassIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Audits</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : stats?.data?.totalAudits || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Compliant Batches</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : stats?.data?.compliantBatches || 0}
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
              <p className="text-sm font-medium text-gray-500">Active Recalls</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : stats?.data?.activeRecalls || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Compliance Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {statsLoading ? '...' : `${stats?.data?.complianceRate || 0}%`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Audits */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Audits</h3>
          <div className="flex space-x-2">
            <select
              value={auditStatus}
              onChange={(e) => setAuditStatus(e.target.value)}
              className="input text-sm"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>
            <button className="btn btn-primary text-sm">
              New Audit
            </button>
          </div>
        </div>

        {auditsLoading ? (
          <LoadingSpinner size="lg" className="py-8" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Audit ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {audits?.data?.map((audit) => (
                  <tr key={audit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {audit.auditId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {audit.batchId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {audit.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(audit.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(audit.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(audit.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Recalls */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Active Recalls</h3>
          <button className="btn btn-primary text-sm">
            Issue Recall
          </button>
        </div>

        {recallsLoading ? (
          <LoadingSpinner size="lg" className="py-8" />
        ) : recalls?.data?.length > 0 ? (
          <div className="space-y-4">
            {recalls.data.map((recall) => (
              <div key={recall.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                      <h4 className="text-sm font-medium text-red-800">
                        Recall #{recall.recallId}
                      </h4>
                      {getStatusBadge(recall.status)}
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      <strong>Reason:</strong> {recall.reason}
                    </p>
                    <p className="text-sm text-red-700 mb-2">
                      <strong>Affected Batches:</strong> {recall.affectedBatches.join(', ')}
                    </p>
                    <p className="text-sm text-red-700">
                      <strong>Issued:</strong> {new Date(recall.recallDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-sm text-red-600 hover:text-red-500">
                      View Details
                    </button>
                    <button className="text-sm text-red-600 hover:text-red-500">
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Recalls</h3>
            <p className="text-gray-500">All products are currently safe for consumption.</p>
          </div>
        )}
      </div>

      {/* Compliance Report */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Overview</h3>
        {complianceLoading ? (
          <LoadingSpinner size="lg" className="py-8" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Compliance by Organization</h4>
              <div className="space-y-3">
                {compliance?.data?.byOrganization?.map((org) => (
                  <div key={org.name} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{org.name}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${org.complianceRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {org.complianceRate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Common Violations</h4>
              <div className="space-y-2">
                {compliance?.data?.commonViolations?.map((violation, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{violation.type}</span>
                    <span className="font-medium text-gray-900">{violation.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn btn-primary">
            <DocumentMagnifyingGlassIcon className="h-4 w-4 mr-2" />
            Schedule Audit
          </button>
          <button className="btn btn-secondary">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Generate Report
          </button>
          <button className="btn btn-secondary">
            <ClockIcon className="h-4 w-4 mr-2" />
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegulatorDashboard;
