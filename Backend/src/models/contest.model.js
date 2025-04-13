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
      required: [true, "Contest link is required"],
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export const Contest = mongoose.model("Contest", contestSchema);
