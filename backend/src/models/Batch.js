const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  deviceId: String
});

const historyEntrySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'TRANSFER', 'PROCESS', 'PACKAGE', 'SHIP', 'RECEIVE', 'RECALL']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  actor: {
    type: String,
    required: true
  },
  details: mongoose.Schema.Types.Mixed,
  previousOwner: String,
  newOwner: String
});

const batchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  qrCode: {
    type: String,
    unique: true,
    index: true
  },
  crop: {
    type: String,
    required: true
  },
  variety: String,
  harvestDate: {
    type: Date,
    required: true
  },
  farmLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    farmName: String
  },
  currentOwner: {
    type: String,
    required: true
  },
  currentOwnerRole: {
    type: String,
    enum: ['farmer', 'processor', 'distributor', 'retailer'],
    required: true
  },
  status: {
    type: String,
    enum: ['CREATED', 'PROCESSING', 'PACKAGED', 'IN_TRANSIT', 'IN_STORE', 'SOLD', 'RECALLED'],
    default: 'CREATED'
  },
  quantity: {
    amount: Number,
    unit: {
      type: String,
      enum: ['kg', 'tons', 'boxes', 'crates', 'units'],
      default: 'kg'
    }
  },
  quality: {
    grade: String,
    certifications: [String],
    testResults: mongoose.Schema.Types.Mixed
  },
  processing: {
    processor: String,
    processingDate: Date,
    methods: [String],
    packaging: {
      type: String,
      material: String,
      weight: Number
    }
  },
  logistics: {
    distributor: String,
    shippingDate: Date,
    trackingNumber: String,
    estimatedArrival: Date,
    actualArrival: Date
  },
  retail: {
    retailer: String,
    storeLocation: String,
    shelfLocation: String,
    price: Number,
    currency: String
  },
  sensorLog: [sensorDataSchema],
  history: [historyEntrySchema],
  recall: {
    isRecalled: {
      type: Boolean,
      default: false
    },
    reason: String,
    recallDate: Date,
    affectedBatches: [String]
  },
  blockchainTxId: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
batchSchema.index({ currentOwner: 1, status: 1 });
batchSchema.index({ harvestDate: 1 });
batchSchema.index({ 'recall.isRecalled': 1 });

module.exports = mongoose.model('Batch', batchSchema);
