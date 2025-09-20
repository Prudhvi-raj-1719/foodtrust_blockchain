// Mock data for development and demonstration
export const mockUsers = [
  {
    id: '1',
    username: 'john_farmer',
    email: 'john@greenvalleyfarm.com',
    role: 'farmer',
    organization: 'Green Valley Farm',
    mspId: 'FarmerOrgMSP',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: '2024-01-20T08:30:00Z'
  },
  {
    id: '2',
    username: 'sarah_processor',
    email: 'sarah@freshfoods.com',
    role: 'processor',
    organization: 'Fresh Foods Processing',
    mspId: 'ProcessorOrgMSP',
    createdAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-20T09:15:00Z'
  },
  {
    id: '3',
    username: 'mike_distributor',
    email: 'mike@logisticsplus.com',
    role: 'distributor',
    organization: 'Logistics Plus',
    mspId: 'DistributorOrgMSP',
    createdAt: '2024-01-08T00:00:00Z',
    lastLogin: '2024-01-20T07:45:00Z'
  },
  {
    id: '4',
    username: 'lisa_retailer',
    email: 'lisa@supermarket.com',
    role: 'retailer',
    organization: 'SuperMarket Chain',
    mspId: 'RetailerOrgMSP',
    createdAt: '2024-01-12T00:00:00Z',
    lastLogin: '2024-01-20T10:20:00Z'
  },
  {
    id: '5',
    username: 'david_regulator',
    email: 'david@foodsafety.gov',
    role: 'regulator',
    organization: 'Food Safety Authority',
    mspId: 'RegulatorOrgMSP',
    createdAt: '2024-01-05T00:00:00Z',
    lastLogin: '2024-01-20T11:00:00Z'
  }
];

export const mockBatches = [
  {
    _id: '1',
    batchId: 'BATCH001',
    crop: 'Tomatoes',
    variety: 'Roma',
    harvestDate: '2024-01-15T00:00:00Z',
    quantity: { amount: 500, unit: 'kg' },
    status: 'IN_STORE',
    currentOwner: 'SuperMarket Chain',
    farmLocation: {
      farmName: 'Green Valley Farm',
      address: '123 Farm Road, Agricultural District, CA 90210',
      latitude: 34.0522,
      longitude: -118.2437
    },
    quality: {
      grade: 'Grade A',
      certifications: ['Organic', 'Fair Trade'],
      score: 95
    },
    lastUpdated: '2024-01-20T10:20:00Z',
    recall: {
      isRecalled: false
    }
  },
  {
    _id: '2',
    batchId: 'BATCH002',
    crop: 'Wheat',
    variety: 'Hard Red Winter',
    harvestDate: '2024-01-10T00:00:00Z',
    quantity: { amount: 2000, unit: 'kg' },
    status: 'PROCESSING',
    currentOwner: 'Fresh Foods Processing',
    farmLocation: {
      farmName: 'Golden Fields Farm',
      address: '456 Wheat Lane, Grain County, KS 67001',
      latitude: 39.0119,
      longitude: -98.4842
    },
    quality: {
      grade: 'Premium',
      certifications: ['Non-GMO', 'Organic'],
      score: 98
    },
    lastUpdated: '2024-01-20T09:15:00Z',
    recall: {
      isRecalled: false
    }
  },
  {
    _id: '3',
    batchId: 'BATCH003',
    crop: 'Corn',
    variety: 'Sweet Corn',
    harvestDate: '2024-01-12T00:00:00Z',
    quantity: { amount: 800, unit: 'kg' },
    status: 'IN_TRANSIT',
    currentOwner: 'Logistics Plus',
    farmLocation: {
      farmName: 'Sunshine Farm',
      address: '789 Corn Street, Cornfield, IA 50001',
      latitude: 41.5868,
      longitude: -93.6250
    },
    quality: {
      grade: 'Grade A',
      certifications: ['Organic'],
      score: 92
    },
    lastUpdated: '2024-01-20T07:45:00Z',
    recall: {
      isRecalled: false
    }
  },
  {
    _id: '4',
    batchId: 'BATCH004',
    crop: 'Lettuce',
    variety: 'Romaine',
    harvestDate: '2024-01-18T00:00:00Z',
    quantity: { amount: 300, unit: 'kg' },
    status: 'SOLD',
    currentOwner: 'Consumer',
    farmLocation: {
      farmName: 'Crisp Greens Farm',
      address: '321 Leaf Lane, Salad Valley, CA 90211',
      latitude: 34.0736,
      longitude: -118.4004
    },
    quality: {
      grade: 'Grade A',
      certifications: ['Organic', 'Local'],
      score: 88
    },
    lastUpdated: '2024-01-20T12:00:00Z',
    recall: {
      isRecalled: false
    }
  },
  {
    _id: '5',
    batchId: 'BATCH005',
    crop: 'Apples',
    variety: 'Gala',
    harvestDate: '2024-01-05T00:00:00Z',
    quantity: { amount: 1200, unit: 'kg' },
    status: 'RECALLED',
    currentOwner: 'Fresh Foods Processing',
    farmLocation: {
      farmName: 'Orchard Heights',
      address: '555 Apple Avenue, Fruit Valley, WA 98001',
      latitude: 47.6062,
      longitude: -122.3321
    },
    quality: {
      grade: 'Grade B',
      certifications: ['Organic'],
      score: 75
    },
    lastUpdated: '2024-01-20T14:30:00Z',
    recall: {
      isRecalled: true,
      reason: 'Potential contamination detected during quality testing',
      recallDate: '2024-01-20T14:30:00Z'
    }
  }
];

export const mockBatchHistory = {
  BATCH001: {
    timeline: [
      {
        action: 'Batch Created',
        actor: 'John Farmer',
        stage: 'FARM',
        timestamp: '2024-01-15T08:00:00Z',
        notes: 'Harvest completed and batch recorded'
      },
      {
        action: 'Quality Tested',
        actor: 'John Farmer',
        stage: 'FARM',
        timestamp: '2024-01-15T10:30:00Z',
        notes: 'Passed all quality checks'
      },
      {
        action: 'Transferred to Processor',
        actor: 'John Farmer',
        stage: 'PROCESSING',
        timestamp: '2024-01-16T09:00:00Z',
        previousOwner: 'Green Valley Farm',
        newOwner: 'Fresh Foods Processing',
        notes: 'Batch sent for processing'
      },
      {
        action: 'Processing Started',
        actor: 'Sarah Processor',
        stage: 'PROCESSING',
        timestamp: '2024-01-16T14:00:00Z',
        notes: 'Washing and packaging initiated'
      },
      {
        action: 'Processing Completed',
        actor: 'Sarah Processor',
        stage: 'PROCESSING',
        timestamp: '2024-01-17T16:00:00Z',
        notes: 'Packaged and ready for distribution'
      },
      {
        action: 'Transferred to Distributor',
        actor: 'Sarah Processor',
        stage: 'DISTRIBUTION',
        timestamp: '2024-01-18T08:00:00Z',
        previousOwner: 'Fresh Foods Processing',
        newOwner: 'Logistics Plus',
        notes: 'Batch loaded for transportation'
      },
      {
        action: 'In Transit',
        actor: 'Mike Distributor',
        stage: 'DISTRIBUTION',
        timestamp: '2024-01-18T10:00:00Z',
        notes: 'En route to retail location'
      },
      {
        action: 'Delivered to Retailer',
        actor: 'Mike Distributor',
        stage: 'RETAIL',
        timestamp: '2024-01-19T15:00:00Z',
        previousOwner: 'Logistics Plus',
        newOwner: 'SuperMarket Chain',
        notes: 'Batch delivered to store'
      },
      {
        action: 'Placed in Store',
        actor: 'Lisa Retailer',
        stage: 'RETAIL',
        timestamp: '2024-01-20T08:00:00Z',
        notes: 'Batch available for sale'
      }
    ]
  }
};

export const mockIoTDevices = [
  {
    id: 'device_001',
    name: 'Temperature Sensor 1',
    type: 'Temperature',
    location: 'Cold Storage Room A',
    status: 'online',
    lastReading: '2024-01-20T11:30:00Z',
    batchId: 'BATCH001'
  },
  {
    id: 'device_002',
    name: 'Humidity Sensor 1',
    type: 'Humidity',
    location: 'Cold Storage Room A',
    status: 'online',
    lastReading: '2024-01-20T11:30:00Z',
    batchId: 'BATCH001'
  },
  {
    id: 'device_003',
    name: 'Temperature Sensor 2',
    type: 'Temperature',
    location: 'Processing Line B',
    status: 'warning',
    lastReading: '2024-01-20T10:45:00Z',
    batchId: 'BATCH002'
  },
  {
    id: 'device_004',
    name: 'Humidity Sensor 2',
    type: 'Humidity',
    location: 'Processing Line B',
    status: 'online',
    lastReading: '2024-01-20T11:00:00Z',
    batchId: 'BATCH002'
  },
  {
    id: 'device_005',
    name: 'GPS Tracker 1',
    type: 'Location',
    location: 'Truck 123',
    status: 'online',
    lastReading: '2024-01-20T11:15:00Z',
    batchId: 'BATCH003'
  },
  {
    id: 'device_006',
    name: 'Temperature Sensor 3',
    type: 'Temperature',
    location: 'Truck 123',
    status: 'offline',
    lastReading: '2024-01-20T09:30:00Z',
    batchId: 'BATCH003'
  }
];

export const mockSensorData = {
  BATCH001: {
    temperature: {
      current: 4.2,
      min: 3.8,
      max: 4.5,
      unit: '°C'
    },
    humidity: {
      current: 65,
      min: 60,
      max: 70,
      unit: '%'
    }
  },
  BATCH002: {
    temperature: {
      current: 22.1,
      min: 20.0,
      max: 25.0,
      unit: '°C'
    },
    humidity: {
      current: 45,
      min: 40,
      max: 50,
      unit: '%'
    }
  },
  BATCH003: {
    temperature: {
      current: 2.8,
      min: 2.0,
      max: 4.0,
      unit: '°C'
    },
    humidity: {
      current: 55,
      min: 50,
      max: 60,
      unit: '%'
    }
  }
};

export const mockAlerts = [
  {
    id: 'alert_001',
    title: 'Temperature Alert',
    message: 'Temperature in Cold Storage Room A exceeded safe range',
    timestamp: '2024-01-20T10:30:00Z',
    severity: 'warning',
    deviceId: 'device_001',
    batchId: 'BATCH001'
  },
  {
    id: 'alert_002',
    title: 'Device Offline',
    message: 'Temperature Sensor 3 in Truck 123 is not responding',
    timestamp: '2024-01-20T09:45:00Z',
    severity: 'error',
    deviceId: 'device_006',
    batchId: 'BATCH003'
  }
];

export const mockRegulatorStats = {
  totalAudits: 24,
  compliantBatches: 18,
  activeRecalls: 1,
  complianceRate: 85
};

export const mockAudits = [
  {
    id: 'audit_001',
    auditId: 'AUDIT-2024-001',
    batchId: 'BATCH001',
    type: 'Quality Inspection',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    createdAt: '2024-01-18T00:00:00Z',
    completedAt: '2024-01-19T00:00:00Z',
    findings: 'All quality standards met',
    score: 95
  },
  {
    id: 'audit_002',
    auditId: 'AUDIT-2024-002',
    batchId: 'BATCH005',
    type: 'Safety Inspection',
    status: 'FAILED',
    priority: 'HIGH',
    createdAt: '2024-01-20T00:00:00Z',
    findings: 'Contamination detected, recall initiated',
    score: 45
  },
  {
    id: 'audit_003',
    auditId: 'AUDIT-2024-003',
    batchId: 'BATCH002',
    type: 'Process Audit',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    createdAt: '2024-01-20T00:00:00Z'
  }
];

export const mockRecalls = [
  {
    id: 'recall_001',
    recallId: 'RECALL-2024-001',
    status: 'ACTIVE',
    reason: 'Potential contamination detected during quality testing',
    affectedBatches: ['BATCH005'],
    recallDate: '2024-01-20T14:30:00Z',
    severity: 'HIGH'
  }
];

export const mockComplianceReport = {
  byOrganization: [
    { name: 'Green Valley Farm', complianceRate: 95 },
    { name: 'Fresh Foods Processing', complianceRate: 88 },
    { name: 'Logistics Plus', complianceRate: 92 },
    { name: 'SuperMarket Chain', complianceRate: 90 }
  ],
  commonViolations: [
    { type: 'Temperature Control', count: 3 },
    { type: 'Documentation', count: 2 },
    { type: 'Hygiene Standards', count: 1 }
  ]
};
