// leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Contest = require('../models/Contest');

router.post('/update', async (req, res) => {
  const { username, contestId, problemId, status, score } = req.body;

  try {
    // Find the user and contest by their IDs
    const user = await User.findOne({ username });
    const contest = await Contest.findById(contestId);

    // Check if user or contest doesn't exist
    if (!user || !contest) {
      return res.status(404).json({ error: 'User or Contest not found' });
    }

    const now = new Date();
    const contestStart = new Date(contest.startTime);
    const contestEnd = new Date(contestStart.getTime() + Number(contest.duration) * 60000);

    console.log(`Current time: ${now}, Contest start: ${contestStart}, Contest end: ${contestEnd}`);
    console.log(`Received score: ${score}`);

    // Ensure submission is within contest time
    if (now < contestStart || now > contestEnd) {
      return res.status(400).json({ error: 'Submission not within contest time' });
    }

    // Check if the problem was already solved by the user in this contest
    const alreadySolved = user.submissions.some(sub =>
      sub.problemId.toString() === problemId &&
      sub.contestId.toString() === contestId &&
      sub.status === 'Accepted'
    );

    console.log(`Already solved this problem: ${alreadySolved}`);

    // If the submission is accepted, award score and update history
    if (status === 'Accepted') {
      // Save the submission if it's accepted
      user.submissions.push({
        problemId: mongoose.Types.ObjectId(problemId),
        contestId: mongoose.Types.ObjectId(contestId),
        status,
        submittedAt: now,
        score, // Award score only for accepted submissions
      });

      console.log(`Submission for problemId: ${problemId} added to history`);

      // Update total score for the user if this is the first correct submission
      if (!alreadySolved) {
        user.score += score;  // Add score for accepted submissions during the contest
        console.log(`User's score updated to: ${user.score}`);
      } else {
        console.log(`User has already solved this problem, no score update`);
      }
    } else {
      console.log(`Submission status is not 'Accepted', no score awarded`);
    }

    // Save the user data (with updated submissions array)
    await user.save();
    console.log(`User saved with updated submissions and score`);

    // Respond with success
    res.json({ success: true });

  } catch (err) {
    console.error("Error saving submission:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Leaderboard sorted by score
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username score').sort({ score: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET user submission history by username
router.get('/history/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('submissions.problemId')
      .populate('submissions.contestId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const history = user.submissions.map(sub => ({
      problemName: sub.problemId?.title || 'N/A',
      contestName: sub.contestId?.name || 'N/A',
      status: sub.status,
      score: sub.score,
      submittedAt: sub.submittedAt,
    }));

    res.json({ history });
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
