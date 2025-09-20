const express = require('express');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');
const Batch = require('../models/Batch');
const { authenticateToken, requireRole, requireOwnership } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const createBatchSchema = Joi.object({
  crop: Joi.string().required(),
  variety: Joi.string(),
  harvestDate: Joi.date().required(),
  farmLocation: Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    address: Joi.string().required(),
    farmName: Joi.string().required()
  }).required(),
  quantity: Joi.object({
    amount: Joi.number().required(),
    unit: Joi.string().valid('kg', 'tons', 'boxes', 'crates', 'units').default('kg')
  }).required(),
  quality: Joi.object({
    grade: Joi.string(),
    certifications: Joi.array().items(Joi.string()),
    testResults: Joi.object()
  })
});

const updateBatchSchema = Joi.object({
  status: Joi.string().valid('CREATED', 'PROCESSING', 'PACKAGED', 'IN_TRANSIT', 'IN_STORE', 'SOLD', 'RECALLED'),
  processing: Joi.object({
    processor: Joi.string(),
    processingDate: Joi.date(),
    methods: Joi.array().items(Joi.string()),
    packaging: Joi.object({
      type: Joi.string(),
      material: Joi.string(),
      weight: Joi.number()
    })
  }),
  logistics: Joi.object({
    distributor: Joi.string(),
    shippingDate: Joi.date(),
    trackingNumber: Joi.string(),
    estimatedArrival: Joi.date(),
    actualArrival: Joi.date()
  }),
  retail: Joi.object({
    retailer: Joi.string(),
    storeLocation: Joi.string(),
    shelfLocation: Joi.string(),
    price: Joi.number(),
    currency: Joi.string()
  })
});

// Create new batch (Farmers only)
router.post('/', authenticateToken, requireRole(['farmer']), async (req, res) => {
  try {
    const { error, value } = createBatchSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const batchId = `BATCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const qrCode = await QRCode.toDataURL(`${process.env.QR_CODE_BASE_URL || 'http://localhost:3000/scan'}/${batchId}`);

    const batch = new Batch({
      batchId,
      qrCode,
      ...value,
      currentOwner: req.user.organization,
      currentOwnerRole: req.user.role,
      history: [{
        action: 'CREATE',
        actor: req.user.username,
        details: { createdBy: req.user.organization }
      }]
    });

    await batch.save();

    res.status(201).json({
      message: 'Batch created successfully',
      batch
    });
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({ error: 'Failed to create batch' });
  }
});

// Get all batches for current user's organization
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, crop } = req.query;
    const filter = { currentOwner: req.user.organization };
    
    if (status) filter.status = status;
    if (crop) filter.crop = new RegExp(crop, 'i');

    const batches = await Batch.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Batch.countDocuments(filter);

    res.json({
      batches,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ error: 'Failed to get batches' });
  }
});

// Get batch by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const batch = await Batch.findOne({ 
      $or: [
        { batchId: req.params.id },
        { _id: req.params.id }
      ]
    });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Check ownership or if user is regulator
    if (batch.currentOwner !== req.user.organization && req.user.role !== 'regulator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ batch });
  } catch (error) {
    console.error('Get batch error:', error);
    res.status(500).json({ error: 'Failed to get batch' });
  }
});

// Update batch
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { error, value } = updateBatchSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const batch = await Batch.findOne({ 
      $or: [
        { batchId: req.params.id },
        { _id: req.params.id }
      ]
    });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Check ownership
    if (batch.currentOwner !== req.user.organization && req.user.role !== 'regulator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Add history entry
    const historyEntry = {
      action: 'UPDATE',
      actor: req.user.username,
      details: value,
      timestamp: new Date()
    };

    const updatedBatch = await Batch.findByIdAndUpdate(
      batch._id,
      { 
        ...value, 
        $push: { history: historyEntry },
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Batch updated successfully',
      batch: updatedBatch
    });
  } catch (error) {
    console.error('Update batch error:', error);
    res.status(500).json({ error: 'Failed to update batch' });
  }
});

// Transfer batch ownership
router.post('/:id/transfer', authenticateToken, async (req, res) => {
  try {
    const { newOwner, newOwnerRole } = req.body;

    if (!newOwner || !newOwnerRole) {
      return res.status(400).json({ error: 'New owner and role required' });
    }

    const batch = await Batch.findOne({ 
      $or: [
        { batchId: req.params.id },
        { _id: req.params.id }
      ]
    });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Check current ownership
    if (batch.currentOwner !== req.user.organization && req.user.role !== 'regulator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const previousOwner = batch.currentOwner;
    
    const updatedBatch = await Batch.findByIdAndUpdate(
      batch._id,
      {
        currentOwner: newOwner,
        currentOwnerRole: newOwnerRole,
        $push: {
          history: {
            action: 'TRANSFER',
            actor: req.user.username,
            previousOwner,
            newOwner,
            timestamp: new Date()
          }
        },
        lastUpdated: new Date()
      },
      { new: true }
    );

    res.json({
      message: 'Batch transferred successfully',
      batch: updatedBatch
    });
  } catch (error) {
    console.error('Transfer batch error:', error);
    res.status(500).json({ error: 'Failed to transfer batch' });
  }
});

// Get batch history
router.get('/:id/history', authenticateToken, async (req, res) => {
  try {
    const batch = await Batch.findOne({ 
      $or: [
        { batchId: req.params.id },
        { _id: req.params.id }
      ]
    }).select('history batchId');

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Check access
    if (batch.currentOwner !== req.user.organization && req.user.role !== 'regulator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      batchId: batch.batchId,
      history: batch.history
    });
  } catch (error) {
    console.error('Get batch history error:', error);
    res.status(500).json({ error: 'Failed to get batch history' });
  }
});

module.exports = router;
