const express = require('express');
const Joi = require('joi');
const Batch = require('../models/Batch');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All routes require regulator role
router.use(authenticateToken, requireRole(['regulator']));

// Validation schemas
const recallSchema = Joi.object({
  reason: Joi.string().required(),
  affectedBatches: Joi.array().items(Joi.string()).min(1).required(),
  recallDate: Joi.date().default(() => new Date())
});

// Get all batches (regulator view)
router.get('/batches', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      crop, 
      organization,
      recalled,
      fromDate,
      toDate
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (crop) filter.crop = new RegExp(crop, 'i');
    if (organization) filter.currentOwner = organization;
    if (recalled === 'true') filter['recall.isRecalled'] = true;
    if (recalled === 'false') filter['recall.isRecalled'] = { $ne: true };
    
    if (fromDate || toDate) {
      filter.harvestDate = {};
      if (fromDate) filter.harvestDate.$gte = new Date(fromDate);
      if (toDate) filter.harvestDate.$lte = new Date(toDate);
    }

    const batches = await Batch.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('currentOwner', 'organization role')
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
    console.error('Get all batches error:', error);
    res.status(500).json({ error: 'Failed to get batches' });
  }
});

// Get batch details
router.get('/batches/:id', async (req, res) => {
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

    res.json({ batch });
  } catch (error) {
    console.error('Get batch details error:', error);
    res.status(500).json({ error: 'Failed to get batch details' });
  }
});

// Get audit trail for a batch
router.get('/audit/:batchId', async (req, res) => {
  try {
    const batch = await Batch.findOne({ batchId: req.params.batchId })
      .select('history batchId crop harvestDate currentOwner');

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    res.json({
      batchId: batch.batchId,
      crop: batch.crop,
      harvestDate: batch.harvestDate,
      currentOwner: batch.currentOwner,
      auditTrail: batch.history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    });
  } catch (error) {
    console.error('Get audit trail error:', error);
    res.status(500).json({ error: 'Failed to get audit trail' });
  }
});

// Initiate recall
router.post('/recall', async (req, res) => {
  try {
    const { error, value } = recallSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { reason, affectedBatches, recallDate } = value;

    // Update all affected batches
    const updateResult = await Batch.updateMany(
      { batchId: { $in: affectedBatches } },
      {
        $set: {
          'recall.isRecalled': true,
          'recall.reason': reason,
          'recall.recallDate': recallDate,
          'recall.affectedBatches': affectedBatches,
          status: 'RECALLED'
        },
        $push: {
          history: {
            action: 'RECALL',
            actor: req.user.username,
            details: { reason, affectedBatches },
            timestamp: new Date()
          }
        }
      }
    );

    res.json({
      message: 'Recall initiated successfully',
      affectedBatches: updateResult.modifiedCount,
      recallDetails: {
        reason,
        recallDate,
        affectedBatches
      }
    });
  } catch (error) {
    console.error('Initiate recall error:', error);
    res.status(500).json({ error: 'Failed to initiate recall' });
  }
});

// Get recall statistics
router.get('/recalls/stats', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const filter = { 'recall.isRecalled': true };
    
    if (fromDate || toDate) {
      filter['recall.recallDate'] = {};
      if (fromDate) filter['recall.recallDate'].$gte = new Date(fromDate);
      if (toDate) filter['recall.recallDate'].$lte = new Date(toDate);
    }

    const totalRecalls = await Batch.countDocuments(filter);
    
    const recallsByReason = await Batch.aggregate([
      { $match: filter },
      { $group: { _id: '$recall.reason', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recallsByOrganization = await Batch.aggregate([
      { $match: filter },
      { $group: { _id: '$currentOwner', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentRecalls = await Batch.find(filter)
      .sort({ 'recall.recallDate': -1 })
      .limit(10)
      .select('batchId crop recall currentOwner harvestDate');

    res.json({
      totalRecalls,
      recallsByReason,
      recallsByOrganization,
      recentRecalls
    });
  } catch (error) {
    console.error('Get recall stats error:', error);
    res.status(500).json({ error: 'Failed to get recall statistics' });
  }
});

// Get organization compliance report
router.get('/compliance/:organization', async (req, res) => {
  try {
    const { organization } = req.params;
    const { fromDate, toDate } = req.query;

    const filter = { currentOwner: organization };
    
    if (fromDate || toDate) {
      filter.harvestDate = {};
      if (fromDate) filter.harvestDate.$gte = new Date(fromDate);
      if (toDate) filter.harvestDate.$lte = new Date(toDate);
    }

    const totalBatches = await Batch.countDocuments(filter);
    const recalledBatches = await Batch.countDocuments({ 
      ...filter, 
      'recall.isRecalled': true 
    });

    const batchesByStatus = await Batch.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const batchesByCrop = await Batch.aggregate([
      { $match: filter },
      { $group: { _id: '$crop', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const complianceRate = totalBatches > 0 ? ((totalBatches - recalledBatches) / totalBatches * 100).toFixed(2) : 100;

    res.json({
      organization,
      period: { fromDate, toDate },
      totalBatches,
      recalledBatches,
      complianceRate: parseFloat(complianceRate),
      batchesByStatus,
      batchesByCrop
    });
  } catch (error) {
    console.error('Get compliance report error:', error);
    res.status(500).json({ error: 'Failed to get compliance report' });
  }
});

// Get system analytics
router.get('/analytics', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const filter = {};
    
    if (fromDate || toDate) {
      filter.harvestDate = {};
      if (fromDate) filter.harvestDate.$gte = new Date(fromDate);
      if (toDate) filter.harvestDate.$lte = new Date(toDate);
    }

    const totalBatches = await Batch.countDocuments(filter);
    const totalOrganizations = await User.distinct('organization');
    const totalUsers = await User.countDocuments({ isActive: true });

    const batchesByRole = await Batch.aggregate([
      { $match: filter },
      { $group: { _id: '$currentOwnerRole', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const batchesByCrop = await Batch.aggregate([
      { $match: filter },
      { $group: { _id: '$crop', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const recentActivity = await Batch.find(filter)
      .sort({ lastUpdated: -1 })
      .limit(20)
      .select('batchId crop currentOwner status lastUpdated');

    res.json({
      period: { fromDate, toDate },
      totalBatches,
      totalOrganizations: totalOrganizations.length,
      totalUsers,
      batchesByRole,
      batchesByCrop,
      recentActivity
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

module.exports = router;
