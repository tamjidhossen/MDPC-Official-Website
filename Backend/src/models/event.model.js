import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    venue: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationDeadline: {
      type: Date,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxParticipants: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
