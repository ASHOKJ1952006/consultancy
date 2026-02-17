const express = require('express');
const router = express.Router();

const Machine = require('../models/Machine');
// GET all machines
router.get('/', async (req, res) => {
  try {
    const machines = await Machine.find().sort({ machineId: 1 });
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET machine statistics
router.get('/stats', async (req, res) => {
  try {
    const machines = await Machine.find();
    const runningMachines = machines.filter(m => m.status === 'running');

    const stats = {
      total: machines.length,
      running: runningMachines.length,
      idle: machines.filter(m => m.status === 'idle').length,
      maintenance: machines.filter(m => m.status === 'maintenance').length,
      avgEfficiency: runningMachines.length > 0
        ? Math.round(runningMachines.reduce((sum, m) => sum + m.efficiency, 0) / runningMachines.length)
        : 0,
      totalProduction: runningMachines.reduce((sum, m) => sum + (parseInt(m.quantity) || 0), 0)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single machine
router.get('/:id', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }
    res.json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new machine
router.post('/', async (req, res) => {
  try {
    const machine = new Machine(req.body);
    await machine.save();
    res.status(201).json(machine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE machine status/job
router.put('/:id', async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }
    res.json(machine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assign new job to machine
router.post('/:id/job', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    machine.status = 'running';
    machine.party = req.body.party;
    machine.color = req.body.color;
    machine.lotNo = req.body.lotNo;
    machine.quantity = req.body.quantity;
    machine.stage = req.body.stage || 'TD Load';
    machine.efficiency = 0;
    machine.runtime = 'Just started';
    machine.startTime = new Date();

    await machine.save();
    res.json(machine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Complete job
router.put('/:id/complete', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    machine.status = 'idle';
    machine.party = '';
    machine.color = '';
    machine.lotNo = '';
    machine.quantity = '';
    machine.stage = '';
    machine.efficiency = 0;
    machine.runtime = '';
    machine.startTime = null;

    await machine.save();
    res.json(machine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE machine
router.delete('/:id', async (req, res) => {
  try {
    const machine = await Machine.findByIdAndDelete(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }
    res.json({ message: 'Machine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
