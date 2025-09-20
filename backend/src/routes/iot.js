const express = require('express');
const mqtt = require('mqtt');
const Joi = require('joi');
const Batch = require('../models/Batch');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// MQTT client for IoT data
let mqttClient = null;

if (process.env.MQTT_BROKER_URL) {
  mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL);
  
  mqttClient.on('connect', () => {
    console.log('📡 MQTT client connected');
    mqttClient.subscribe(`${process.env.MQTT_TOPIC_PREFIX || 'foodtrust/iot'}/+`);
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      const batchId = topic.split('/').pop();
      
      await addSensorData(batchId, data);
    } catch (error) {
      console.error('MQTT message processing error:', error);
    }
  });
}

// Add sensor data to batch
async function addSensorData(batchId, sensorData) {
  try {
    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      console.log(`Batch ${batchId} not found for sensor data`);
      return;
    }

    const sensorEntry = {
      ...sensorData,
      timestamp: new Date(),
      deviceId: sensorData.deviceId || 'unknown'
    };

    await Batch.findByIdAndUpdate(
      batch._id,
      { 
        $push: { sensorLog: sensorEntry },
        lastUpdated: new Date()
      }
    );

    console.log(`📊 Sensor data added to batch ${batchId}`);
  } catch (error) {
    console.error('Error adding sensor data:', error);
  }
}

// Validation schema for sensor data
const sensorDataSchema = Joi.object({
  temperature: Joi.number(),
  humidity: Joi.number(),
  location: Joi.object({
    latitude: Joi.number(),
    longitude: Joi.number(),
    address: Joi.string()
  }),
  deviceId: Joi.string(),
  additionalData: Joi.object()
});

// Manual sensor data entry (for testing)
router.post('/sensor-data', authenticateToken, requireRole(['distributor', 'processor']), async (req, res) => {
  try {
    const { error, value } = sensorDataSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { batchId, ...sensorData } = value;

    if (!batchId) {
      return res.status(400).json({ error: 'Batch ID required' });
    }

    await addSensorData(batchId, sensorData);

    res.json({
      message: 'Sensor data added successfully',
      batchId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Add sensor data error:', error);
    res.status(500).json({ error: 'Failed to add sensor data' });
  }
});

// Get sensor data for a batch
router.get('/sensor-data/:batchId', authenticateToken, async (req, res) => {
  try {
    const { batchId } = req.params;
    const { limit = 100, from, to } = req.query;

    const batch = await Batch.findOne({ batchId }).select('sensorLog batchId currentOwner');
    
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Check access
    if (batch.currentOwner !== req.user.organization && req.user.role !== 'regulator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    let sensorData = batch.sensorLog;

    // Filter by date range if provided
    if (from || to) {
      const fromDate = from ? new Date(from) : new Date(0);
      const toDate = to ? new Date(to) : new Date();
      
      sensorData = sensorData.filter(entry => 
        entry.timestamp >= fromDate && entry.timestamp <= toDate
      );
    }

    // Limit results
    sensorData = sensorData.slice(-parseInt(limit));

    res.json({
      batchId,
      sensorData,
      count: sensorData.length
    });
  } catch (error) {
    console.error('Get sensor data error:', error);
    res.status(500).json({ error: 'Failed to get sensor data' });
  }
});

// Get real-time sensor data (WebSocket simulation via polling)
router.get('/realtime/:batchId', authenticateToken, async (req, res) => {
  try {
    const { batchId } = req.params;
    const { limit = 10 } = req.query;

    const batch = await Batch.findOne({ batchId }).select('sensorLog batchId currentOwner');
    
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Check access
    if (batch.currentOwner !== req.user.organization && req.user.role !== 'regulator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const recentData = batch.sensorLog
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, parseInt(limit));

    res.json({
      batchId,
      recentData,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get real-time data error:', error);
    res.status(500).json({ error: 'Failed to get real-time data' });
  }
});

// Get sensor analytics for a batch
router.get('/analytics/:batchId', authenticateToken, async (req, res) => {
  try {
    const { batchId } = req.params;
    const { days = 7 } = req.query;

    const batch = await Batch.findOne({ batchId }).select('sensorLog batchId currentOwner');
    
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    // Check access
    if (batch.currentOwner !== req.user.organization && req.user.role !== 'regulator') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const recentData = batch.sensorLog.filter(entry => entry.timestamp >= cutoffDate);

    // Calculate analytics
    const analytics = {
      batchId,
      period: `${days} days`,
      totalReadings: recentData.length,
      temperature: {
        average: 0,
        min: 0,
        max: 0,
        readings: recentData.filter(d => d.temperature).length
      },
      humidity: {
        average: 0,
        min: 0,
        max: 0,
        readings: recentData.filter(d => d.humidity).length
      },
      locationUpdates: recentData.filter(d => d.location).length,
      deviceIds: [...new Set(recentData.map(d => d.deviceId).filter(Boolean))]
    };

    // Calculate temperature stats
    const tempReadings = recentData.filter(d => d.temperature).map(d => d.temperature);
    if (tempReadings.length > 0) {
      analytics.temperature.average = tempReadings.reduce((a, b) => a + b, 0) / tempReadings.length;
      analytics.temperature.min = Math.min(...tempReadings);
      analytics.temperature.max = Math.max(...tempReadings);
    }

    // Calculate humidity stats
    const humidityReadings = recentData.filter(d => d.humidity).map(d => d.humidity);
    if (humidityReadings.length > 0) {
      analytics.humidity.average = humidityReadings.reduce((a, b) => a + b, 0) / humidityReadings.length;
      analytics.humidity.min = Math.min(...humidityReadings);
      analytics.humidity.max = Math.max(...humidityReadings);
    }

    res.json(analytics);
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

module.exports = router;
