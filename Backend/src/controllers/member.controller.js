// filepath: /home/tamjid/Codes/Projects/Mid Day Website/MDPC-Official-Website-Backend/Backend/src/controllers/member.controller.js
import { Member } from "../models/member.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// @desc    Submit a club membership application
// @route   POST /api/v1/members/apply
// @access  Public
export const applyForMembership = asyncHandler(async (req, res) => {
  const { name, email, phone, session, roll, department, programmingHandles } =
    req.body;

  // Check if member already exists with email or roll
  const existingMember = await Member.findOne({
    $or: [{ email }, { roll }],
  });

  if (existingMember) {
    throw new ApiError(
      409,
      `An application already exists with ${
        existingMember.email === email ? "this email" : "this roll number"
      }`
    );
  }

  // Handle image upload if exists
  let photoUrl = null;
  if (req.file) {
    photoUrl = `/uploads/images/members/${req.file.filename}`;
  }

  // Check if user exists with this email
  const user = await User.findOne({ email });

  // Create member object
  const member = await Member.create({
    name,
    email,
    phone,
    session,
    roll,
    department,
    programmingHandles: programmingHandles || {},
    photo: photoUrl,
    user: user ? user._id : null,
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { member },
        "Membership application submitted successfully, awaiting approval"
      )
    );
});

// @desc    Get all membership applications (with filtering and pagination)
// @route   GET /api/v1/members
// @access  Admin
export const getAllMembers = asyncHandler(async (req, res) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Set up filtering
  const filter = {};

  if (req.query.status) {
    filter.status = req.query.status;
  }

  if (req.query.department) {
    filter.department = req.query.department;
  }

  if (req.query.session) {
    filter.session = req.query.session;
  }

  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
      { roll: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Execute query
  const members = await Member.find(filter)
    .populate("user", "name email")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Get total count
  const totalMembers = await Member.countDocuments(filter);

  // Return members with pagination info
  res.status(200).json(
    new ApiResponse(
      200,
      {
        members,
        pagination: {
          page,
          limit,
          totalMembers,
          totalPages: Math.ceil(totalMembers / limit),
        },
      },
      "Members fetched successfully"
    )
  );
});

// @desc    Get a single membership application
// @route   GET /api/v1/members/:id
// @access  Admin
export const getMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find member by ID
  const member = await Member.findById(id).populate("user", "name email");

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { member }, "Member fetched successfully"));
});

// @desc    Update membership status (approve/reject)
// @route   PATCH /api/v1/members/:id/status
// @access  Admin
export const updateMemberStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Find member by ID
  const member = await Member.findById(id);

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  // Update status
  member.status = status;

  // If status is approved, set joinDate and update user if exists
  if (status === "active" && member.status !== "active") {
    member.joinDate = Date.now();

    // If user exists, mark them as a member
    if (member.user) {
      await User.findByIdAndUpdate(member.user, { isMember: true });
    }
  }

  // If status is inactive, update user if exists
  if (status === "inactive" && member.user) {
    await User.findByIdAndUpdate(member.user, { isMember: false });
  }

  await member.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { member },
        `Member ${status === "active" ? "approved" : status === "inactive" ? "deactivated" : "status updated"} successfully`
      )
    );
});

// @desc    Delete a member application
// @route   DELETE /api/v1/members/:id
// @access  Admin
export const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const member = await Member.findById(id);

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  await Member.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(200, {}, "Member deleted successfully"));
});
