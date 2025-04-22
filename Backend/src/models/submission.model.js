import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema(
  {
    testCase: {
      type: Number,
      required: true,
    },
    verdict: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
      ],
      required: true,
    },
    executionTime: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed, // Changed from ObjectId to Mixed to support both ObjectId and string
      ref: "User",
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["cpp", "java", "python"],
      default: "cpp",
    },
    verdict: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
        "Runtime Error",
        "Compilation Error",
        "Internal Error",
      ],
      required: true,
    },
    executionTime: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      default: 0,
    },
    testResults: {
      type: [testResultSchema],
      default: [],
    },
    // Add a flag to indicate if this is a temporary user submission
    isTemporaryUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster lookups
submissionSchema.index({ userId: 1, createdAt: -1 });
submissionSchema.index({ contestId: 1, userId: 1, createdAt: -1 });
submissionSchema.index({ problemId: 1, verdict: 1 });

export const Submission = mongoose.model("Submission", submissionSchema);
