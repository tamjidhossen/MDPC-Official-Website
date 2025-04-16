import mongoose from "mongoose";

// Individual user data in the leaderboard
const leaderboardUserSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  maxRating: {
    type: Number,
    default: 0,
  },
  rank: {
    type: String,
    default: "unrated",
  },
  organization: {
    type: String,
    default: "",
  },
});

// Main schema for codeforces cached data
const codeforcesLeaderboardSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      index: true,
    },
    users: [leaderboardUserSchema],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Removed index: true to avoid duplicate index
    },
  },
  { timestamps: true }
);

// Set up TTL index to automatically delete expired documents
codeforcesLeaderboardSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const CodeforcesLeaderboard = mongoose.model(
  "CodeforcesLeaderboard",
  codeforcesLeaderboardSchema
);

// Schema for problem distribution caching
const problemDistributionSchema = new mongoose.Schema(
  {
    filters: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      // Removed index: true to avoid duplicate index
    },
  },
  { timestamps: true }
);

// Set up TTL index for problem distribution data
problemDistributionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const CodeforcesProblemDistribution = mongoose.model(
  "CodeforcesProblemDistribution",
  problemDistributionSchema
);
