//models/Problem.js
const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    name: String,
    description: String,
    inputFormat: String,
    outputFormat: String,
    testCases: [
        {
            input: String,
            output: String,
        },
    ],
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }
});

module.exports = mongoose.model('Problem', problemSchema);
