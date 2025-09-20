const express = require('express');
const QRCode = require('qrcode');
const Batch = require('../models/Batch');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate QR code for batch
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { batchId, url } = req.body;

    if (!batchId) {
      return res.status(400).json({ error: 'Batch ID required' });
    }

    const batch = await Batch.findOne({ 
      $or: [
        { batchId },
        { _id: batchId }
      ]
    });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Check access
    if (batch.currentOwner !== req.user.organization && req.user.role !== 'regulator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const qrUrl = url || `${process.env.QR_CODE_BASE_URL || 'http://localhost:3000/scan'}/${batch.batchId}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrUrl);

    // Update batch with new QR code
    await Batch.findByIdAndUpdate(batch._id, { qrCode: qrCodeDataURL });

    res.json({
      batchId: batch.batchId,
      qrCode: qrCodeDataURL,
      url: qrUrl
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Scan QR code and get batch information (public endpoint for consumers)
router.get('/scan/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findOne({ batchId });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Return public information for consumers
    const publicInfo = {
      batchId: batch.batchId,
      crop: batch.crop,
      variety: batch.variety,
      harvestDate: batch.harvestDate,
      farmLocation: {
        address: batch.farmLocation?.address,
        farmName: batch.farmLocation?.farmName
      },
      currentOwner: batch.currentOwner,
      status: batch.status,
      quality: {
        grade: batch.quality?.grade,
        certifications: batch.quality?.certifications
      },
      processing: batch.processing ? {
        processor: batch.processing.processor,
        processingDate: batch.processing.processingDate,
        methods: batch.processing.methods
      } : null,
      retail: batch.retail ? {
        retailer: batch.retail.retailer,
        storeLocation: batch.retail.storeLocation,
        price: batch.retail.price,
        currency: batch.retail.currency
      } : null,
      recall: batch.recall?.isRecalled ? {
        isRecalled: batch.recall.isRecalled,
        reason: batch.recall.reason,
        recallDate: batch.recall.recallDate
      } : null,
      lastUpdated: batch.lastUpdated
    };

    res.json({
      success: true,
      data: publicInfo
    });
  } catch (error) {
    console.error('Scan QR code error:', error);
    res.status(500).json({ error: 'Failed to scan QR code' });
  }
});

// Get detailed batch information (authenticated)
router.get('/details/:batchId', authenticateToken, async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findOne({ batchId });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Check access
    if (batch.currentOwner !== req.user.organization && req.user.role !== 'regulator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      data: batch
    });
  } catch (error) {
    console.error('Get batch details error:', error);
    res.status(500).json({ error: 'Failed to get batch details' });
  }
});

// Get batch traceability history
router.get('/trace/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findOne({ batchId }).select('history batchId crop harvestDate');

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Format history for traceability display
    const traceability = {
      batchId: batch.batchId,
      crop: batch.crop,
      harvestDate: batch.harvestDate,
      timeline: batch.history.map(entry => ({
        action: entry.action,
        timestamp: entry.timestamp,
        actor: entry.actor,
        details: entry.details,
        previousOwner: entry.previousOwner,
        newOwner: entry.newOwner
      })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    };

    res.json({
      success: true,
      data: traceability
    });
  } catch (error) {
    console.error('Get traceability error:', error);
    res.status(500).json({ error: 'Failed to get traceability information' });
  }
});

// Validate QR code
router.post('/validate', async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ error: 'QR data required' });
    }

    // Extract batch ID from QR data
    let batchId;
    if (qrData.includes('/scan/')) {
      batchId = qrData.split('/scan/')[1];
    } else if (qrData.startsWith('BATCH_')) {
      batchId = qrData;
    } else {
      return res.status(400).json({ error: 'Invalid QR code format' });
    }

    const batch = await Batch.findOne({ batchId });

    if (!batch) {
      return res.status(404).json({ 
        valid: false,
        error: 'Batch not found' 
      });
    }

    res.json({
      valid: true,
      batchId: batch.batchId,
      status: batch.status,
      isRecalled: batch.recall?.isRecalled || false
    });
  } catch (error) {
    console.error('Validate QR code error:', error);
    res.status(500).json({ error: 'Failed to validate QR code' });
  }
});

module.exports = router;
