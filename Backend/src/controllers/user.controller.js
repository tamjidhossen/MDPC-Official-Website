import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../constants.js";
import jwt from "jsonwebtoken";

// @desc    Register a new user
// @route   POST /api/v1/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, programmingHandles } = req.body;

  // Check if user already exists with email
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  // Create user object
  const user = await User.create({
    name,
    email,
    password,
    programmingHandles: programmingHandles || {},
  });

  // Remove sensitive information from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User registered successfully"
      )
    );
});

// @desc    Login user
// @route   POST /api/v1/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Check if password is correct
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Update refresh token in database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Remove sensitive information
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Set cookies with tokens
  res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// @desc    Logout user
// @route   POST /api/v1/users/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  // Clear refresh token in database
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true }
  );

  // Clear cookies
  res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { user }, "User profile fetched successfully"));
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, programmingHandles } = req.body;

  // Handle avatar upload if exists
  let avatarUrl = null;
  if (req.file) {
    avatarUrl = `/uploads/images/users/${req.file.filename}`;
  }

  // Update allowed fields
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name: name || req.user.name,
        ...(programmingHandles && { programmingHandles }),
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: updatedUser },
        "User profile updated successfully"
      )
    );
});

// @desc    Refresh access token
// @route   POST /api/v1/users/refresh-token
// @access  Public
export const refreshAccessToken = asyncHandler(async (req, res) => {
  // Get refresh token from cookies or request body
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  try {
    // Verify refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find user with refresh token
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Validate if incoming token matches stored token
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token expired or used");
    }

    // Generate new tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Update refresh token in database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set cookies with new tokens
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// @desc    Get all users (with filtering and pagination)
// @route   GET /api/v1/users
// @access  Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Set up filtering
  const filter = {};

  if (req.query.role) {
    filter.role = req.query.role;
  }

  if (req.query.isMember) {
    filter.isMember = req.query.isMember === "true";
  }

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Execute query
  const users = await User.find(filter)
    .select("-password -refreshToken")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Get total count
  const totalUsers = await User.countDocuments(filter);

  // Return users with pagination info
  res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
        },
      },
      "Users fetched successfully"
    )
  );
});

// @desc    Update user status (admin only)
// @route   PATCH /api/v1/users/:id/status
// @access  Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Find user by ID
  const user = await User.findById(id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update user status
  user.status = status;
  await user.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user },
        `User status updated to ${status} successfully`
      )
    );
});
