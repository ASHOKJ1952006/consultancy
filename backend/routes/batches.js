const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');

// GET all batches with optional filters
router.get('/', async (req, res) => {
    try {
        const { status, party, startDate, endDate } = req.query;
        let query = {};

        if (status) query.status = status;
        if (party) query.party = party;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = startDate;
            if (endDate) query.date.$lte = endDate;
        }

        const batches = await Batch.find(query).sort({ createdAt: -1 });
        res.json(batches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET batch statistics
router.get('/stats', async (req, res) => {
    try {
        const batches = await Batch.find();
        const completedBatches = batches.filter(b => b.status === 'completed');

        const stats = {
            total: batches.length,
            completed: completedBatches.length,
            rejected: batches.filter(b => b.status === 'rejected').length,
            inProgress: batches.filter(b => b.status === 'in-progress').length,
            avgEfficiency: completedBatches.length > 0
                ? Math.round(completedBatches.reduce((sum, b) => sum + b.efficiency, 0) / completedBatches.length)
                : 0,
            totalQuantity: batches.reduce((sum, b) => sum + parseFloat(b.quantity), 0)
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single batch by ID
router.get('/:id', async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        res.json(batch);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE new batch
router.post('/', async (req, res) => {
    try {
        const batch = new Batch(req.body);
        await batch.save();
        res.status(201).json(batch);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// UPDATE batch
router.put('/:id', async (req, res) => {
    try {
        const batch = await Batch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        res.json(batch);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE batch
router.delete('/:id', async (req, res) => {
    try {
        const batch = await Batch.findByIdAndDelete(req.params.id);
        if (!batch) {
            return res.status(404).json({ error: 'Batch not found' });
        }
        res.json({ message: 'Batch deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
