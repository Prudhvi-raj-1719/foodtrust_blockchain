import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { batchesAPI } from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateBatch = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBatchMutation = useMutation(batchesAPI.createBatch, {
    onSuccess: (response) => {
      toast.success('Batch created successfully!');
      navigate(`/batches/${response.data.batch.batchId}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create batch');
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await createBatchMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Batch</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record a new harvest batch to start tracking through the supply chain.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crop Type *
              </label>
              <input
                type="text"
                {...register('crop', { required: 'Crop type is required' })}
                className={`input ${errors.crop ? 'border-red-500' : ''}`}
                placeholder="e.g., Tomatoes, Wheat, Corn"
              />
              {errors.crop && (
                <p className="mt-1 text-sm text-red-600">{errors.crop.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variety
              </label>
              <input
                type="text"
                {...register('variety')}
                className="input"
                placeholder="e.g., Roma, Hard Red Winter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harvest Date *
              </label>
              <input
                type="date"
                {...register('harvestDate', { required: 'Harvest date is required' })}
                className={`input ${errors.harvestDate ? 'border-red-500' : ''}`}
              />
              {errors.harvestDate && (
                <p className="mt-1 text-sm text-red-600">{errors.harvestDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  {...register('quantity.amount', { 
                    required: 'Quantity is required',
                    min: { value: 0.01, message: 'Quantity must be greater than 0' }
                  })}
                  className={`input flex-1 ${errors.quantity?.amount ? 'border-red-500' : ''}`}
                  placeholder="100"
                />
                <select
                  {...register('quantity.unit', { required: 'Unit is required' })}
                  className={`input w-24 ${errors.quantity?.unit ? 'border-red-500' : ''}`}
                >
                  <option value="kg">kg</option>
                  <option value="tons">tons</option>
                  <option value="boxes">boxes</option>
                  <option value="crates">crates</option>
                  <option value="units">units</option>
                </select>
              </div>
              {errors.quantity?.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.quantity.amount.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Farm Location</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Farm Name *
              </label>
              <input
                type="text"
                {...register('farmLocation.farmName', { required: 'Farm name is required' })}
                className={`input ${errors.farmLocation?.farmName ? 'border-red-500' : ''}`}
                placeholder="e.g., Green Valley Farm"
              />
              {errors.farmLocation?.farmName && (
                <p className="mt-1 text-sm text-red-600">{errors.farmLocation.farmName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                {...register('farmLocation.address', { required: 'Address is required' })}
                className={`input ${errors.farmLocation?.address ? 'border-red-500' : ''}`}
                rows={3}
                placeholder="Full farm address"
              />
              {errors.farmLocation?.address && (
                <p className="mt-1 text-sm text-red-600">{errors.farmLocation.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('farmLocation.latitude', { 
                    required: 'Latitude is required',
                    min: { value: -90, message: 'Latitude must be between -90 and 90' },
                    max: { value: 90, message: 'Latitude must be between -90 and 90' }
                  })}
                  className={`input ${errors.farmLocation?.latitude ? 'border-red-500' : ''}`}
                  placeholder="40.7128"
                />
                {errors.farmLocation?.latitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.farmLocation.latitude.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  {...register('farmLocation.longitude', { 
                    required: 'Longitude is required',
                    min: { value: -180, message: 'Longitude must be between -180 and 180' },
                    max: { value: 180, message: 'Longitude must be between -180 and 180' }
                  })}
                  className={`input ${errors.farmLocation?.longitude ? 'border-red-500' : ''}`}
                  placeholder="-74.0060"
                />
                {errors.farmLocation?.longitude && (
                  <p className="mt-1 text-sm text-red-600">{errors.farmLocation.longitude.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quality Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <select {...register('quality.grade')} className="input">
                <option value="">Select grade</option>
                <option value="Premium">Premium</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Grade C">Grade C</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certifications
              </label>
              <input
                type="text"
                {...register('quality.certifications')}
                className="input"
                placeholder="e.g., Organic, Fair Trade (comma separated)"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/batches')}
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
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Batch</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBatch;
