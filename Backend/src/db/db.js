import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `\n✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`
    );

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected successfully");
    });

    // Properly close connection on application termination
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed due to app termination");
        process.exit(0);
      } catch (error) {
        console.error("Error during MongoDB disconnection:", error);
        process.exit(1);
      }
    });

    return connectionInstance;
  } catch (error) {
    console.error("MONGODB CONNECTION FAILED:", error);
    process.exit(1);
  }
};

export default connectDB;
