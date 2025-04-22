import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Contest title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Contest description is required"],
    },
    date: {
      type: Date,
      required: [true, "Contest date is required"],
    },
    time: {
      type: String,
      required: [true, "Contest time is required"],
    },
    duration: {
      type: String,
      required: [true, "Contest duration is required"],
    },
    platform: {
      type: String,
      required: [true, "Contest platform is required"],
    },
    difficultyLevel: {
      type: String,
    },
    registrationStatus: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rank: {
          type: Number,
        },
        score: {
          type: Number,
        },
        teamName: {
          type: String,
        },
        teamMembers: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    resultsData: {
      problems: [
        {
          name: String,
          id: String,
          difficulty: String,
        },
      ],
      standings: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          rank: Number,
          score: Number,
          problemResults: [
            {
              problemId: String,
              verdict: String,
              points: Number,
              time: Number,
            },
          ],
        },
      ],
    },
    contestLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    // Added fields for judging functionality
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    isJudged: {
      type: Boolean,
      default: false,
    },
    startTime: {
      type: Date,
      get: function () {
        return this.date;
      },
    },
    visibleAfterEnd: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

export const Contest = mongoose.model("Contest", contestSchema);
