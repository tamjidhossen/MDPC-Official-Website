const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const User = require('../models/User');
const Problem = require('../models/Problem');

// 👇 Route to submit a code (POST /submissions)
router.post('/', async (req, res) => {
  try {
    const { userId, problemId, contestId, code, expectedOutput, verdict } = req.body;

    const newSubmission = new Submission({
      userId,
      problemId,
      contestId,
      code,
      expectedOutput,
      verdict,
    });

    await newSubmission.save();
    res.status(201).json({ message: 'Submission successful', submission: newSubmission });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 👇 Route to get user-wise submissions (GET /submissions/user-wise)
router.get('/user-wise', async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('userId', 'username')
      .populate('problemId', 'name')
      .sort({ createdAt: -1 });

    const userWiseData = {};

    submissions.forEach((sub) => {
      const username = sub.userId.username;
      if (!userWiseData[username]) {
        userWiseData[username] = [];
      }
      userWiseData[username].push({
        problem: sub.problemId.name,
        verdict: sub.verdict,
        time: sub.createdAt,
      });
    });

    res.json(userWiseData);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
