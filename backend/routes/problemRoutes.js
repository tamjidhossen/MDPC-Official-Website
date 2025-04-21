//routes/problemRoutes.jsx
const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const Contest = require('../models/Contest');

router.post('/add', async (req, res) => {
    const { name, description, inputFormat, outputFormat, testCases, contestId } = req.body;

    const problem = new Problem({ name, description, inputFormat, outputFormat, testCases, contestId });
    await problem.save();

    await Contest.findByIdAndUpdate(contestId, { $push: { problems: problem._id } });

    res.json(problem);
});

router.get('/:id', async (req, res) => {
    const problem = await Problem.findById(req.params.id);
    res.json(problem);
});

module.exports = router;
