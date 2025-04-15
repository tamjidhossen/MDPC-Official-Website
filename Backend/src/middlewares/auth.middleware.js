import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to verify JWT token and authorize user
export const verifyJWT = async (req, res, next) => {
  try {
    // Get token from cookies or authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized - No token provided",
      });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user by ID from token
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User not found. Invalid token.",
      });
    }

    // Add user object to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token or session expired",
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "fail",
        message: "Access denied. Admin privileges required.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Middleware to check if user is an active member
export const isActive = (req, res, next) => {
  try {
    if (!req.user.isMember) {
      return res.status(403).json({
        status: "fail",
        message:
          "Your account is not an active member. Please contact an administrator.",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
