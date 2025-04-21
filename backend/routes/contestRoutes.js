const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Contest = require('../models/Contest');

// ✅ Create a new contest
router.post('/create', async (req, res) => {
  const { name, startTime, duration } = req.body;

  try {
    const contest = new Contest({
      name,
      startTime: new Date(startTime),
      duration: parseInt(duration),
    });

    await contest.save();
    res.json(contest);
  } catch (error) {
    console.error('❌ Error creating contest:', error);
    res.status(500).json({ error: 'Error creating contest' });
  }
});

// ✅ Get all contests
router.get('/', async (req, res) => {
  try {
    const contests = await Contest.find();
    res.json(contests);
  } catch (error) {
    console.error('❌ Error fetching contests:', error);
    res.status(500).json({ error: 'Error fetching contests' });
  }
});

// ✅ Get specific contest with problems
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid contest ID' });
    }

    const contest = await Contest.findById(id).populate('problems');

    if (!contest) {
      return res.status(404).json({ error: 'Contest not found' });
    }

    res.json(contest);
  } catch (error) {
    console.error('❌ Error fetching contest:', error.message);
    res.status(500).json({ error: 'Server error while fetching contest' });
  }
});

module.exports = router;
