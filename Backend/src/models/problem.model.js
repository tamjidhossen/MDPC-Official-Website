import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
      trim: true,
    },
    output: {
      type: String,
      required: true,
      trim: true,
    },
    isExample: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Problem name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Problem description is required"],
      trim: true,
    },
    inputFormat: {
      type: String,
      required: [true, "Input format is required"],
      trim: true,
    },
    outputFormat: {
      type: String,
      required: [true, "Output format is required"],
      trim: true,
    },
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    timeLimit: {
      type: Number,
      default: 1000, // in milliseconds
      min: 100,
      max: 10000,
    },
    memoryLimit: {
      type: Number,
      default: 256, // in MB
      min: 16,
      max: 1024,
    },
    testCases: {
      type: [testCaseSchema],
      required: true,
      validate: {
        validator: function (testCases) {
          return testCases && testCases.length > 0;
        },
        message: "At least one test case is required",
      },
    },
    points: {
      type: Number,
      default: 100,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster lookups
problemSchema.index({ name: 1 });
problemSchema.index({ difficulty: 1 });

export const Problem = mongoose.model("Problem", problemSchema);
