import axios from 'axios';
import {
  mockUsers,
  mockBatches,
  mockBatchHistory,
  mockIoTDevices,
  mockSensorData,
  mockAlerts,
  mockRegulatorStats,
  mockAudits,
  mockRecalls,
  mockComplianceReport
} from '../data/mockData';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock API responses for development
const mockApi = {
  // Auth API
  login: async (credentials) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    const user = mockUsers.find(u => 
      u.username === credentials.username || u.email === credentials.username
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const token = `mock_token_${user.id}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { data: { user, token } };
  },

  register: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: String(mockUsers.length + 1),
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    mockUsers.push(newUser);
    const token = `mock_token_${newUser.id}`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return { data: { user: newUser, token } };
  },

  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return { data: { user } };
  },

  updateProfile: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return { data: { user: updatedUser } };
  },

  // Batches API
  getBatches: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredBatches = [...mockBatches];
    
    if (params.status) {
      filteredBatches = filteredBatches.filter(batch => batch.status === params.status);
    }
    
    if (params.crop) {
      filteredBatches = filteredBatches.filter(batch => 
        batch.crop.toLowerCase().includes(params.crop.toLowerCase())
      );
    }
    
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBatches = filteredBatches.slice(startIndex, endIndex);
    
    return {
      data: {
        batches: paginatedBatches,
        pagination: {
          page,
          limit,
          total: filteredBatches.length,
          pages: Math.ceil(filteredBatches.length / limit)
        }
      }
    };
  },

  getBatch: async (batchId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const batch = mockBatches.find(b => b.batchId === batchId);
    if (!batch) {
      throw new Error('Batch not found');
    }
    return { data: { batch } };
  },

  createBatch: async (batchData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBatch = {
      _id: String(mockBatches.length + 1),
      batchId: `BATCH${String(mockBatches.length + 1).padStart(3, '0')}`,
      ...batchData,
      status: 'CREATED',
      currentOwner: 'Current User',
      lastUpdated: new Date().toISOString(),
      recall: { isRecalled: false }
    };
    
    mockBatches.unshift(newBatch);
    return { data: { batch: newBatch } };
  },

  updateBatch: async (batchId, updateData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const batchIndex = mockBatches.findIndex(b => b.batchId === batchId);
    if (batchIndex === -1) {
      throw new Error('Batch not found');
    }
    
    mockBatches[batchIndex] = {
      ...mockBatches[batchIndex],
      ...updateData,
      lastUpdated: new Date().toISOString()
    };
    
    return { data: { batch: mockBatches[batchIndex] } };
  },

  transferBatch: async (transferData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const batchIndex = mockBatches.findIndex(b => b.batchId === transferData.batchId);
    if (batchIndex === -1) {
      throw new Error('Batch not found');
    }
    
    mockBatches[batchIndex] = {
      ...mockBatches[batchIndex],
      currentOwner: transferData.newOwner,
      lastUpdated: new Date().toISOString()
    };
    
    return { data: { batch: mockBatches[batchIndex] } };
  },

  getBatchHistory: async (batchId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const history = mockBatchHistory[batchId];
    return { data: { timeline: history?.timeline || [] } };
  },

  // QR API
  scanQR: async (qrData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const batch = mockBatches.find(b => b.batchId === qrData);
    
    if (!batch) {
      throw new Error('Product not found');
    }
    
    return { data: { success: true, data: batch } };
  },

  getTrace: async (qrData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const history = mockBatchHistory[qrData];
    return { data: { timeline: history?.timeline || [] } };
  },

  // IoT API
  getDevices: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { data: mockIoTDevices };
  },

  getSensorData: async (params) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = mockSensorData[params.batchId] || {
      temperature: { current: 0, min: 0, max: 0, unit: '°C' },
      humidity: { current: 0, min: 0, max: 0, unit: '%' }
    };
    return { data };
  },

  getAlerts: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { data: mockAlerts };
  },

  // Regulator API
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockRegulatorStats };
  },

  getAudits: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    let filteredAudits = [...mockAudits];
    
    if (params.status) {
      filteredAudits = filteredAudits.filter(audit => audit.status === params.status);
    }
    
    return { data: filteredAudits };
  },

  getRecalls: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { data: mockRecalls };
  },

  getComplianceReport: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: mockComplianceReport };
  }
};

// API endpoints - using mock data for development
export const authAPI = {
  login: (credentials) => mockApi.login(credentials),
  register: (userData) => mockApi.register(userData),
  getProfile: () => mockApi.getProfile(),
  updateProfile: (profileData) => mockApi.updateProfile(profileData),
};

export const batchesAPI = {
  getBatches: (params) => mockApi.getBatches(params),
  getBatch: (id) => mockApi.getBatch(id),
  createBatch: (batchData) => mockApi.createBatch(batchData),
  updateBatch: (id, updateData) => mockApi.updateBatch(id, updateData),
  transferBatch: (transferData) => mockApi.transferBatch(transferData),
  getBatchHistory: (id) => mockApi.getBatchHistory(id),
};

export const iotAPI = {
  addSensorData: (sensorData) => api.post('/iot/sensor-data', sensorData),
  getSensorData: (params) => mockApi.getSensorData(params),
  getDevices: () => mockApi.getDevices(),
  getAlerts: () => mockApi.getAlerts(),
  getRealtimeData: (batchId, params) => api.get(`/iot/realtime/${batchId}`, { params }),
  getAnalytics: (batchId, params) => api.get(`/iot/analytics/${batchId}`, { params }),
};

export const qrAPI = {
  generateQR: (qrData) => api.post('/qr/generate', qrData),
  scanQR: (batchId) => mockApi.scanQR(batchId),
  getDetails: (batchId) => api.get(`/qr/details/${batchId}`),
  getTrace: (batchId) => mockApi.getTrace(batchId),
  validateQR: (qrData) => api.post('/qr/validate', { qrData }),
};

export const regulatorAPI = {
  getAllBatches: (params) => api.get('/regulator/batches', { params }),
  getBatchDetails: (id) => api.get(`/regulator/batches/${id}`),
  getAuditTrail: (batchId) => api.get(`/regulator/audit/${batchId}`),
  initiateRecall: (recallData) => api.post('/regulator/recall', recallData),
  getRecallStats: (params) => api.get('/regulator/recalls/stats', { params }),
  getComplianceReport: (organization, params) => mockApi.getComplianceReport(),
  getAnalytics: (params) => api.get('/regulator/analytics', { params }),
  getStats: () => mockApi.getStats(),
  getAudits: (params) => mockApi.getAudits(params),
  getRecalls: () => mockApi.getRecalls(),
};