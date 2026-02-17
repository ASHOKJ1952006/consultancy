const express = require('express');
const router = express.Router();

const Inventory = require('../models/Inventory');
// GET all inventory items with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) query.category = category;

    const items = await Inventory.find(query).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET low stock alerts
router.get('/alerts', async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      status: { $in: ['low', 'critical'] }
    }).sort({ stockLevel: 1 });

    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single inventory item
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new inventory item
router.post('/', async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE inventory item
router.put('/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Record daily usage
router.post('/:id/usage', async (req, res) => {
  try {
    const { day, amount } = req.body;
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.weeklyUsage[day] !== undefined) {
      item.weeklyUsage[day] = amount;
      item.stock -= amount;
      await item.save();
      res.json(item);
    } else {
      res.status(400).json({ error: 'Invalid day' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE inventory item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
