// models/Submission.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      default: null, // Optional field
    },
    code: {
      type: String,
      required: true,
    },
    expectedOutput: {
      type: String,
      required: true,
    },
    verdict: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Compilation Error", "Runtime Error"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
