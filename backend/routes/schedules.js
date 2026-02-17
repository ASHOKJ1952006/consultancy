const express = require('express');
const router = express.Router();

const Schedule = require('../models/Schedule');
// GET all schedules with optional date filter
router.get('/', async (req, res) => {
  try {
    const { date, status } = req.query;
    let query = {};

    if (date) query.date = date;
    if (status) query.status = status;

    const schedules = await Schedule.find(query).sort({ date: 1, time: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET week view for calendar
router.get('/week/:date', async (req, res) => {
  try {
    const startDate = new Date(req.params.date);
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const schedules = await Schedule.find({
      date: { $in: dates }
    }).sort({ date: 1, time: 1 });

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single schedule
router.get('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new schedule
router.post('/', async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
