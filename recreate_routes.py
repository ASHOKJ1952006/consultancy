"""
Script to recreate all missing backend route files
"""

# Schedules Route
schedules_route = """const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');

// GET all schedules
router.get('/', async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (date) query.date = date;
    
    const schedules = await Schedule.find(query).sort({ date: -1, time: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new schedule
router.post('/', async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    const newSchedule = await schedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE schedule
router.put('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
    res.json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
"""

# Inventory Route
inventory_route = """const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// GET all inventory items
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    
    const inventory = await Inventory.find(query).sort({ name: 1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET low stock alerts
router.get('/alerts', async (req, res) => {
  try {
    const alerts = await Inventory.find({
      status: { $in: ['low', 'critical'] }
    }).sort({ status: -1, stock: 1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET inventory item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new inventory item
router.post('/', async (req, res) => {
  try {
    const item = new Inventory(req.body);
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE inventory item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
"""

# Machines Route  
machines_route = """const express = require('express');
const router = express.Router();
const Machine = require('../models/Machine');

// GET all machines
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) query.status = status;
    
    const machines = await Machine.find(query).sort({ machineId: 1 });
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET machine statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Machine.countDocuments();
    const running = await Machine.countDocuments({ status: 'running' });
    const idle = await Machine.countDocuments({ status: 'idle' });
    const maintenance = await Machine.countDocuments({ status: 'maintenance' });
    
    const machines = await Machine.find({ efficiency: { $exists: true, $gt: 0 } });
    const avgEfficiency = machines.length > 0
      ? Math.round(machines.reduce((sum, m) => sum + m.efficiency, 0) / machines.length)
      : 0;
    
    res.json({
      total,
      running,
      idle,
      maintenance,
      avgEfficiency
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET machine by ID
router.get('/:id', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    res.json(machine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ASSIGN job to machine
router.post('/:id/job', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    
    machine.status = 'running';
    machine.party = req.body.party;
    machine.color = req.body.color;
    machine.lotNo = req.body.lotNo;
    machine.quantity = req.body.quantity;
    machine.stage = req.body.stage || 'Dyeing';
    machine.efficiency = req.body.efficiency || 0;
    machine.runtime = req.body.runtime || '0h 0m';
    machine.startTime = new Date();
    
    await machine.save();
    res.json(machine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// COMPLETE job on machine
router.post('/:id/complete', async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    
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
    res.status(400).json({ message: error.message });
  }
});

// UPDATE machine
router.put('/:id', async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    res.json(machine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
"""

# Inspections Route
inspections_route = """const express = require('express');
const router = express.Router();
const Inspection = require('../models/Inspection');

// GET all inspections
router.get('/', async (req, res) => {
  try {
    const { status, date } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (date) query.date = date;
    
    const inspections = await Inspection.find(query).sort({ date: -1 });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET inspection statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Inspection.countDocuments();
    const approved = await Inspection.countDocuments({ status: 'approved' });
    const pending = await Inspection.countDocuments({ status: 'pending' });
    const rejected = await Inspection.countDocuments({ status: 'rejected' });
    
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    
    const inspections = await Inspection.find({ deltaE: { $exists: true } });
    const avgDeltaE = inspections.length > 0
      ? (inspections.reduce((sum, i) => sum + i.deltaE, 0) / inspections.length).toFixed(2)
      : 0;
    
    res.json({
      total,
      approved,
      pending,
      rejected,
      approvalRate,
      avgDeltaE
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET inspection by ID
router.get('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    res.json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new inspection
router.post('/', async (req, res) => {
  try {
    const inspection = new Inspection(req.body);
    const newInspection = await inspection.save();
    res.status(201).json(newInspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE inspection
router.put('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    res.json(inspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE inspection
router.delete('/:id', async (req, res) => {
  try {
    const inspection = await Inspection.findByIdAndDelete(req.params.id);
    if (!inspection) return res.status(404).json({ message: 'Inspection not found' });
    res.json({ message: 'Inspection deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
"""

# Alerts Route
alerts_route = """const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// GET all alerts
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
    res.status(500).json({ message: error.message });
  }
});

// GET alert by ID
router.get('/:id', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MARK alert as read
router.patch('/:id/read', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// CREATE new alert
router.post('/', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    const newAlert = await alert.save();
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE alert
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
"""

# Write all route files
import os

routes_dir = r'C:\Users\ashok\OneDrive\Desktop\consultancy\backend\routes'

with open(os.path.join(routes_dir, 'schedules.js'), 'w') as f:
    f.write(schedules_route)
print("✅ Created schedules.js")

with open(os.path.join(routes_dir, 'inventory.js'), 'w') as f:
    f.write(inventory_route)
print("✅ Created inventory.js")

with open(os.path.join(routes_dir, 'machines.js'), 'w') as f:
    f.write(machines_route)
print("✅ Created machines.js")

with open(os.path.join(routes_dir, 'inspections.js'), 'w') as f:
    f.write(inspections_route)
print("✅ Created inspections.js")

with open(os.path.join(routes_dir, 'alerts.js'), 'w') as f:
    f.write(alerts_route)
print("✅ Created alerts.js")

print("\n🎉 All route files created successfully!")
