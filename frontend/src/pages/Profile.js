import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, EnvelopeIcon, BuildingOfficeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      organization: user?.organization || ''
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateProfile(data);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      farmer: 'Farmer',
      processor: 'Processor',
      distributor: 'Distributor',
      retailer: 'Retailer',
      consumer: 'Consumer',
      regulator: 'Regulator'
    };
    return roleNames[role] || role;
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      farmer: 'Manages crop production and harvest records',
      processor: 'Handles food processing and packaging',
      distributor: 'Manages logistics and transportation',
      retailer: 'Sells products to consumers',
      consumer: 'Purchases and consumes food products',
      regulator: 'Oversees compliance and safety standards'
    };
    return descriptions[role] || '';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and preferences.
        </p>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
            <p className="text-sm text-gray-500">{getRoleDisplayName(user?.role)}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                {...register('username', { 
                  required: 'Username is required',
                  minLength: { value: 3, message: 'Username must be at least 3 characters' }
                })}
                className={`input ${errors.username ? 'border-red-500' : ''}`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`input ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization
              </label>
              <input
                type="text"
                {...register('organization', { required: 'Organization is required' })}
                className={`input ${errors.organization ? 'border-red-500' : ''}`}
              />
              {errors.organization && (
                <p className="mt-1 text-sm text-red-600">{errors.organization.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="text-sm text-gray-900">{user?.username}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Organization</p>
                  <p className="text-sm text-gray-900">{user?.organization}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-sm text-gray-900">{getRoleDisplayName(user?.role)}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                <strong>Role Description:</strong> {getRoleDescription(user?.role)}
              </p>
              <p className="text-sm text-gray-500">
                <strong>MSP ID:</strong> {user?.mspId}
              </p>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Account Status</span>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Last Login</span>
            <span className="text-sm text-gray-900">
              {user?.lastLogin 
                ? new Date(user.lastLogin).toLocaleDateString()
                : 'Never'
              }
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Member Since</span>
            <span className="text-sm text-gray-900">
              {user?.createdAt 
                ? new Date(user.createdAt).toLocaleDateString()
                : 'Unknown'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Password</span>
            <button className="text-sm text-primary-600 hover:text-primary-500">
              Change Password
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Two-Factor Authentication</span>
            <span className="text-sm text-gray-500">Not enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
