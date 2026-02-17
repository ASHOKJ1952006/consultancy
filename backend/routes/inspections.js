const express = require('express');
const router = express.Router();

const Inspection = require('../models/Inspection');
// GET all inspections with optional status filter
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) query.status = status;

    const inspections = await Inspection.find(query).sort({ createdAt: -1 });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET inspection statistics
router.get('/stats', async (req, res) => {
  try {
    const inspections = await Inspection.find();
    const withDeltaE = inspections.filter(i => i.deltaE !== null && i.deltaE !== undefined);

    const stats = {
      total: inspections.length,
      approved: inspections.filter(i => i.status === 'approved').length,
      pending: inspections.filter(i => i.status === 'pending').length,
      rejected: inspections.filter(i => i.status === 'rejected').length,
      approvalRate: inspections.length > 0
        ? Math.round((inspections.filter(i => i.status === 'approved').length / inspections.length) * 100)
        : 0,
      avgDeltaE: withDeltaE.length > 0
        ? (withDeltaE.reduce((sum, i) => sum + i.deltaE, 0) / withDeltaE.length).toFixed(2)
        : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single inspection
router.get('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }
    res.json(inspection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new inspection
router.post('/', async (req, res) => {
  try {
    const inspection = new Inspection(req.body);
    await inspection.save();
    res.status(201).json(inspection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE inspection (approve/reject, add deltaE)
router.put('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }
    res.json(inspection);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE inspection
router.delete('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndDelete(req.params.id);
    if (!inspection) {
      return res.status(404).json({ error: 'Inspection not found' });
    }
    res.json({ message: 'Inspection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
