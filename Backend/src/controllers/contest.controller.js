import { Contest } from "../models/contest.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ContestTypes } from "../constants.js";
import { getFilePath } from "../utils/fileUpload.js";
import mongoose from "mongoose";

// @desc    Create a new contest
// @route   POST /api/v1/contests
// @access  Admin
export const createContest = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    time,
    duration,
    platform,
    difficultyLevel,
    registrationStatus,
    registrationDeadline,
    contestLink,
    status,
    contestType,
  } = req.body;

  // Handle image upload if exists using standardized path
  let imageUrl = null;
  if (req.file) {
    imageUrl = getFilePath(req, req.file);
  }

  // Create contest object
  const contest = await Contest.create({
    title,
    description,
    date: new Date(date),
    time,
    duration,
    platform,
    difficultyLevel,
    registrationStatus:
      registrationStatus !== undefined ? registrationStatus : true,
    registrationDeadline: registrationDeadline
      ? new Date(registrationDeadline)
      : undefined,
    contestLink,
    status: status || "upcoming",
    contestType: contestType || ContestTypes.INDIVIDUAL,
    ...(imageUrl && { image: imageUrl }),
  });

  res
    .status(201)
    .json(new ApiResponse(201, { contest }, "Contest created successfully"));
});

// @desc    Get all contests with optional filtering
// @route   GET /api/v1/contests
// @access  Public
export const getAllContests = asyncHandler(async (req, res) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Set up filtering
  const filter = {};

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Filter by platform
  if (req.query.platform) {
    filter.platform = req.query.platform;
  }

  // Filter by contest type
  if (req.query.contestType) {
    filter.contestType = req.query.contestType;
  }

  // Filter by difficulty level
  if (req.query.difficultyLevel) {
    filter.difficultyLevel = req.query.difficultyLevel;
  }

  // Filter by date range
  if (req.query.fromDate) {
    filter.date = { $gte: new Date(req.query.fromDate) };
  }

  if (req.query.toDate) {
    filter.date = {
      ...filter.date,
      $lte: new Date(req.query.toDate),
    };
  }

  // Filter by registration status
  if (req.query.registrationStatus) {
    filter.registrationStatus = req.query.registrationStatus === "true";
  }

  // Search in title or description
  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
    ];
  }

  // Execute query
  const contests = await Contest.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ date: 1 }); // Sort by upcoming date

  // Get total count
  const totalContests = await Contest.countDocuments(filter);

  // Return contests with pagination info
  res.status(200).json(
    new ApiResponse(
      200,
      {
        contests,
        pagination: {
          page,
          limit,
          totalContests,
          totalPages: Math.ceil(totalContests / limit),
        },
      },
      "Contests fetched successfully"
    )
  );
});

// @desc    Get a single contest
// @route   GET /api/v1/contests/:id
// @access  Public
export const getContest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find contest by ID
  const contest = await Contest.findById(id);

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  // Check if user is registered for the contest
  let isRegistered = false;

  if (req.user) {
    // Check if user is in participants list
    isRegistered = contest.participants.some(
      (participant) =>
        participant.user &&
        participant.user.toString() === req.user._id.toString()
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        contest,
        isRegistered,
      },
      "Contest fetched successfully"
    )
  );
});

// @desc    Update a contest
// @route   PUT /api/v1/contests/:id
// @access  Admin
export const updateContest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    date,
    time,
    duration,
    platform,
    difficultyLevel,
    registrationStatus,
    registrationDeadline,
    contestLink,
    status,
    contestType,
  } = req.body;

  // Find contest by ID
  const contest = await Contest.findById(id);

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  // Handle image update if exists using standardized path
  if (req.file) {
    contest.image = getFilePath(req, req.file);
  }

  // Update contest fields
  if (title) contest.title = title;
  if (description) contest.description = description;
  if (date) contest.date = new Date(date);
  if (time) contest.time = time;
  if (duration) contest.duration = duration;
  if (platform) contest.platform = platform;
  if (difficultyLevel) contest.difficultyLevel = difficultyLevel;
  if (registrationStatus !== undefined)
    contest.registrationStatus = registrationStatus;
  if (registrationDeadline)
    contest.registrationDeadline = new Date(registrationDeadline);
  if (contestLink) contest.contestLink = contestLink;
  if (status) contest.status = status;
  if (contestType) contest.contestType = contestType;

  // Save updated contest
  await contest.save();

  res
    .status(200)
    .json(new ApiResponse(200, { contest }, "Contest updated successfully"));
});

// @desc    Delete a contest
// @route   DELETE /api/v1/contests/:id
// @access  Admin
export const deleteContest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find contest by ID
  const contest = await Contest.findById(id);

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  // Delete contest
  await Contest.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Contest deleted successfully"));
});

// @desc    Register for a contest
// @route   POST /api/v1/contests/:id/register
// @access  Private
export const registerForContest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const { teamName, teamMembers } = req.body;

  // Find contest by ID
  const contest = await Contest.findById(id);

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  // Check if registration is still open
  if (!contest.registrationStatus) {
    throw new ApiError(400, "Registration for this contest is closed");
  }

  // Check if registration deadline has passed
  if (
    contest.registrationDeadline &&
    new Date() > new Date(contest.registrationDeadline)
  ) {
    throw new ApiError(400, "Registration deadline has passed");
  }

  // Check if user is already registered
  const isAlreadyRegistered = contest.participants.some(
    (participant) =>
      participant.user && participant.user.toString() === userId.toString()
  );

  if (isAlreadyRegistered) {
    throw new ApiError(400, "You are already registered for this contest");
  }

  // Handle registration based on contest type
  if (contest.contestType === ContestTypes.INDIVIDUAL) {
    // Individual registration
    contest.participants.push({ user: userId });
  } else if (contest.contestType === ContestTypes.TEAM) {
    // Team registration - validate team info
    if (!teamName) {
      throw new ApiError(400, "Team name is required for team contests");
    }

    if (!teamMembers || !teamMembers.length) {
      throw new ApiError(400, "Team members are required for team contests");
    }

    // Verify all team members exist
    for (const memberId of teamMembers) {
      const memberExists = await User.exists({
        _id: memberId,
        status: "active",
      });
      if (!memberExists) {
        throw new ApiError(
          404,
          `Team member with ID ${memberId} not found or not active`
        );
      }
    }

    // Add team registration
    contest.participants.push({
      user: userId, // Team leader
      teamName,
      teamMembers,
    });
  }

  // Save updated contest
  await contest.save();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Registered for contest successfully"));
});

// @desc    Add contest results
// @route   POST /api/v1/contests/:id/results
// @access  Admin
export const addContestResults = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { problems, standings } = req.body;

  // Find contest by ID
  const contest = await Contest.findById(id);

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  // Validate that contest is completed or set it to completed
  if (contest.status !== "completed") {
    contest.status = "completed";
  }

  // Add results data
  contest.resultsData = {
    problems: problems || [],
    standings: standings || [],
  };

  // Update participants with their ranks/scores from standings
  if (standings && standings.length) {
    for (const standing of standings) {
      const participantIndex = contest.participants.findIndex(
        (p) => p.user.toString() === standing.user.toString()
      );

      if (participantIndex !== -1) {
        contest.participants[participantIndex].rank = standing.rank;
        contest.participants[participantIndex].score = standing.score;
      }
    }
  }

  // Save updated contest
  await contest.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, { contest }, "Contest results added successfully")
    );
});
