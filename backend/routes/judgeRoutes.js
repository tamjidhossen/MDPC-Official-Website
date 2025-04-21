//// routes/judgeRoutes.js
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Contest = require('../models/Contest');
const Submission = require('../models/Submission');


router.post('/run', async (req, res) => {
  const { code, testCases, username, problemId, contestId } = req.body;

  if (!code || !testCases || !username || !problemId || !contestId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const filePath = path.join(__dirname, 'solution.cpp');
  fs.writeFileSync(filePath, code);

  exec(`g++ ${filePath} -o solution`, (compileErr, _, compileStderr) => {
    if (compileErr || compileStderr) {
      recordSubmission(username, problemId, contestId, 'Compilation Error', 0);
      return res.json({ result: 'Compilation Error', error: compileStderr || compileErr });
    }

    const input = testCases.map(tc => tc.input).join('\n');
    fs.writeFileSync(path.join(__dirname, 'input.txt'), input);

    exec(`./solution < input.txt`, async (runErr, stdout, runStderr) => {
      if (runErr || runStderr) {
        recordSubmission(username, problemId, contestId, 'Runtime Error', 0);
        return res.json({ result: 'Runtime Error', error: runStderr || runErr });
      }

      const outputs = stdout.trim().split('\n');
      const passed = testCases.every((tc, index) => outputs[index]?.trim() === tc.output.trim());

      if (passed) {
        const score = await calculateScore(problemId, contestId);
        await recordSubmission(username, problemId, contestId, 'Accepted', score);
        return res.json({ result: 'Accepted', score });
      } else {
        await recordSubmission(username, problemId, contestId, 'Wrong Answer', 0);
        return res.json({ result: 'Wrong Answer', output: stdout });
      }
    });
  });
});

async function calculateScore(problemId, contestId) {
  const contest = await Contest.findById(contestId);
  if (!contest) return 0;

  const problem = await Problem.findById(problemId);
  if (!problem) return 0;

  const now = new Date();
  const contestStart = new Date(contest.startTime);
  const contestEnd = new Date(contestStart.getTime() + contest.duration * 60000);

  if (now > contestEnd) return 0;

  const elapsedMinutes = Math.floor((now - contestStart) / 60000);
  const penalty = Math.floor(elapsedMinutes / 5) * 2;
  const finalScore = Math.max(0, 150 - penalty);

  return finalScore;
}

async function recordSubmission(username, problemId, contestId, status, score) {
  const user = await User.findOne({ username });
  if (!user) return;

  const existingSubmission = user.submissions.find(
    sub => sub.problemId.toString() === problemId && sub.contestId.toString() === contestId && sub.status === 'Accepted'
  );

  if (status === 'Accepted' && !existingSubmission) {
    user.score += score;
  }

  user.submissions.push({
    problemId,
    contestId,
    status,
    submittedAt: new Date(),
    score: status === 'Accepted' ? score : 0,
  });

  await user.save();
}
  
module.exports = router;
