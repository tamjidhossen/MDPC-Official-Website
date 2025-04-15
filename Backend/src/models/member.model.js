// filepath: /home/tamjid/Codes/Projects/Mid Day Website/MDPC-Official-Website-Backend/Backend/src/models/member.model.js
import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    session: {
      type: String,
      required: [true, "Session is required"],
    },
    roll: {
      type: String,
      required: [true, "Roll/Student ID is required"],
      unique: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
    },
    programmingHandles: {
      codeforces: {
        type: String,
      },
      vjudge: {
        type: String,
      },
    },
    photo: {
      type: String, // Path to the photo: /uploads/images/members/[filename]
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
    joinDate: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Member = mongoose.model("Member", memberSchema);
