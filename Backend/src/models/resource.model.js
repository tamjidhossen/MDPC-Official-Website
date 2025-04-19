import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Resource title is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Resource category is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: [true, "Resource level is required"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    content: {
      type: String,
      required: [true, "Resource content is required"],
    },
    externalLinks: [
      {
        title: String,
        url: String,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    file: {
      type: String, // Store the path to the uploaded file
      required: false,
    },
  },
  { timestamps: true }
);

export const Resource = mongoose.model("Resource", resourceSchema);
