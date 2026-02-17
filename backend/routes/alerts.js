const express = require('express');
const router = express.Router();

const Alert = require('../models/Alert');
// GET all alerts with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, category, read } = req.query;
    let query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (read !== undefined) query.read = read === 'true';

    const alerts = await Alert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single alert
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new alert
router.post('/', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark alert as read
router.put('/:id/read', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Auto-generate system alerts
router.post('/generate', async (req, res) => {
  try {
    const Inventory = require('../models/Inventory');
    const Machine = require('../models/Machine');

    const generatedAlerts = [];

    // Check inventory for low stock
    const lowStockItems = await Inventory.find({
      status: { $in: ['low', 'critical'] }
    });

    for (const item of lowStockItems) {
      const existingAlert = await Alert.findOne({
        category: 'inventory',
        relatedId: item._id.toString(),
        read: false
      });

      if (!existingAlert) {
        const alert = new Alert({
          type: item.status === 'critical' ? 'critical' : 'warning',
          category: 'inventory',
          title: `${item.status === 'critical' ? 'Critical' : 'Low'} Stock Level`,
          message: `${item.name} is at ${item.stockLevel}% stock level (${item.stock} kg remaining)`,
          actionable: true,
          relatedId: item._id.toString()
        });
        await alert.save();
        generatedAlerts.push(alert);
      }
    }

    // Check machines for low efficiency
    const machines = await Machine.find({ status: 'running' });
    for (const machine of machines) {
      if (machine.efficiency < 85 && machine.efficiency > 0) {
        const existingAlert = await Alert.findOne({
          category: 'machine',
          relatedId: machine._id.toString(),
          read: false
        });

        if (!existingAlert) {
          const alert = new Alert({
            type: 'warning',
            category: 'machine',
            title: 'Machine Efficiency Drop',
            message: `${machine.name} efficiency dropped to ${machine.efficiency}% - below threshold`,
            actionable: true,
            relatedId: machine._id.toString()
          });
          await alert.save();
          generatedAlerts.push(alert);
        }
      }
    }

    res.json({
      message: `Generated ${generatedAlerts.length} new alerts`,
      alerts: generatedAlerts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE alert
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
