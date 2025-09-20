import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    username: '',
    email: '',
    password: '',
    role: 'farmer',
    organization: '',
    mspId: ''
  });

  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.usernameOrEmail, formData.password);
      } else {
        // For registration, use the usernameOrEmail as email
        const registrationData = {
          ...formData,
          email: formData.usernameOrEmail
        };
        await register(registrationData);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="font-medium text-primary-600 hover:text-primary-500"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required={!isLogin}
                    value={formData.username}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input mt-1"
                  >
                    <option value="farmer">Farmer</option>
                    <option value="processor">Processor</option>
                    <option value="distributor">Distributor</option>
                    <option value="retailer">Retailer</option>
                    <option value="consumer">Consumer</option>
                    <option value="regulator">Regulator</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                    Organization
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required={!isLogin}
                    value={formData.organization}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="Enter organization name"
                  />
                </div>
                <div>
                  <label htmlFor="mspId" className="block text-sm font-medium text-gray-700">
                    MSP ID
                  </label>
                  <input
                    id="mspId"
                    name="mspId"
                    type="text"
                    required={!isLogin}
                    value={formData.mspId}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="Enter MSP ID"
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700">
                {isLogin ? 'Username or Email' : 'Email address'}
              </label>
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type={isLogin ? 'text' : 'email'}
                autoComplete={isLogin ? 'username' : 'email'}
                required
                value={formData.usernameOrEmail}
                onChange={handleChange}
                className="input mt-1"
                placeholder={isLogin ? 'Enter username or email' : 'Enter email address'}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign in' : 'Create account'
              )}
            </button>
          </div>

          {isLogin && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <div><strong>Farmer:</strong> john_farmer / password</div>
                <div><strong>Processor:</strong> sarah_processor / password</div>
                <div><strong>Distributor:</strong> mike_distributor / password</div>
                <div><strong>Retailer:</strong> lisa_retailer / password</div>
                <div><strong>Regulator:</strong> david_regulator / password</div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
