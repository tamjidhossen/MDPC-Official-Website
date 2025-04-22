import { Contest } from "../models/contest.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ContestTypes } from "../constants.js";
import { getFilePath } from "../utils/fileUpload.js";
import {
  hasContestEnded,
  updateContestsStatus,
} from "../utils/contestStatus.js";
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

  // Validate required fields
  if (!title || !description || !date || !time || !duration || !platform) {
    throw new ApiError(
      400,
      "Missing required fields: title, description, date, time, duration, platform are required"
    );
  }

  // Check for empty strings after trimming
  if (
    title.trim() === "" ||
    description.trim() === "" ||
    time.trim() === "" ||
    duration.trim() === "" ||
    platform.trim() === ""
  ) {
    throw new ApiError(
      400,
      "Title, description, time, duration, platform, cannot be empty"
    );
  }

  // Validate date format
  if (!Date.parse(date)) {
    throw new ApiError(400, "Invalid date format");
  }

  // Validate duration is a positive number
  const durationNum = Number(duration);
  if (isNaN(durationNum) || durationNum <= 0) {
    throw new ApiError(400, "Duration must be a positive number");
  }

  // Validate registration deadline if provided
  if (registrationDeadline) {
    if (!Date.parse(registrationDeadline)) {
      throw new ApiError(400, "Invalid registration deadline format");
    }
  }

  // Validate contestType if provided
  if (contestType && !Object.values(ContestTypes).includes(contestType)) {
    throw new ApiError(
      400,
      `Contest type must be one of: ${Object.values(ContestTypes).join(", ")}`
    );
  }

  // Handle image upload if exists using standardized path
  let imageUrl = null;
  if (req.file) {
    imageUrl = getFilePath(req, req.file);
  }

  // Create contest object
  const contest = await Contest.create({
    title: title.trim(),
    description: description.trim(),
    date: new Date(date),
    time: time.trim(),
    duration: duration.trim(),
    platform: platform.trim(),
    difficultyLevel: difficultyLevel ? difficultyLevel.trim() : undefined,
    registrationStatus:
      registrationStatus !== undefined ? registrationStatus : true,
    registrationDeadline: registrationDeadline
      ? new Date(registrationDeadline)
      : undefined,
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
  let contests = await Contest.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ date: 1 }); // Sort by upcoming date

  // Check and update contest status based on current time
  for (let contest of contests) {
    if (contest.status === "upcoming" && hasContestEnded(contest)) {
      contest.status = "completed";
      await contest.save();
    }
  }

  // Re-fetch if we're filtering by status since some statuses may have changed
  if (req.query.status) {
    contests = await Contest.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 });
  }

  // Get total count (after potential status updates)
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
  const { userId } = req.query; // Optional userId can be passed as query parameter

  // Find contest by ID
  const contest = await Contest.findById(id);

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  // Check if the contest has ended but still marked as upcoming
  if (contest.status === "upcoming" && hasContestEnded(contest)) {
    contest.status = "completed";
    await contest.save();
  }

  // Check if user ID was provided and if that user is registered
  let isRegistered = false;
  if (userId) {
    isRegistered = contest.participants.some(
      (participant) =>
        participant.user && participant.user.toString() === userId.toString()
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

  // Validate fields if provided
  if (title && title.trim() === "") {
    throw new ApiError(400, "Title cannot be empty");
  }

  if (description && description.trim() === "") {
    throw new ApiError(400, "Description cannot be empty");
  }

  if (time && time.trim() === "") {
    throw new ApiError(400, "Time cannot be empty");
  }

  if (duration && duration.trim() === "") {
    throw new ApiError(400, "Duration cannot be empty");
  }

  if (platform && platform.trim() === "") {
    throw new ApiError(400, "Platform cannot be empty");
  }

  // Validate date format if provided
  if (date && !Date.parse(date)) {
    throw new ApiError(400, "Invalid date format");
  }

  // Validate duration is a positive number if provided
  if (duration) {
    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      throw new ApiError(400, "Duration must be a positive number");
    }
  }

  // Validate registration deadline if provided
  if (registrationDeadline) {
    if (!Date.parse(registrationDeadline)) {
      throw new ApiError(400, "Invalid registration deadline format");
    }
  }

  // Validate contestType if provided
  if (contestType && !Object.values(ContestTypes).includes(contestType)) {
    throw new ApiError(
      400,
      `Contest type must be one of: ${Object.values(ContestTypes).join(", ")}`
    );
  }

  // Handle image update if exists using standardized path
  if (req.file) {
    contest.image = getFilePath(req, req.file);
  }

  // Update contest fields
  if (title) contest.title = title.trim();
  if (description) contest.description = description.trim();
  if (date) contest.date = new Date(date);
  if (time) contest.time = time.trim();
  if (duration) contest.duration = duration.trim();
  if (platform) contest.platform = platform.trim();
  if (difficultyLevel) contest.difficultyLevel = difficultyLevel.trim();
  if (registrationStatus !== undefined)
    contest.registrationStatus = registrationStatus;
  if (registrationDeadline)
    contest.registrationDeadline = new Date(registrationDeadline);
  if (contestLink) contest.contestLink = contestLink.trim();
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
// @access  Public
export const registerForContest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, teamName, teamMembers } = req.body;

  // Find contest by ID
  const contest = await Contest.findById(id);

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  // Check if user is already registered
  if (userId) {
    const isAlreadyRegistered = contest.participants.some(
      (participant) =>
        participant.user && participant.user.toString() === userId.toString()
    );

    if (isAlreadyRegistered) {
      // Return a 200 status with a message instead of throwing an error
      // This makes the UI experience better as the user can see they're already registered
      return res
        .status(200)
        .json(new ApiResponse(200, { isRegistered: true }, "You are already registered for this contest"));
    }
  } else {
    // If no userId is provided, we cannot check for existing registration
    throw new ApiError(400, "User ID is required for registration");
  }

  // Add participant (individual registration only)
  contest.participants.push({
    user: userId,
  });

  // Save updated contest
  await contest.save();

  res
    .status(200)
    .json(new ApiResponse(200, { isRegistered: true }, "Registered for contest successfully"));
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

// @desc    Get contest lobby information (countdown or problems)
// @route   GET /api/v1/contests/:id/lobby
// @access  Public
export const getContestLobby = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query; // Optional user ID can be passed as query param

  // Find contest by ID with problems populated
  const contest = await Contest.findById(id)
    .populate("problems", "name difficulty")
    .populate({
      path: "participants.user",
      select: "name username",
    });

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  // Calculate contest timing information
  // Parse the contest's date and time
  const now = new Date();
  
  // Create start time by combining date and time
  const startTime = new Date(contest.date);
  if (contest.time) {
    // Parse time in format "HH:MM AM/PM" (e.g., "2:30 PM")
    const timeMatch = contest.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const period = timeMatch[3].toUpperCase();
      
      // Convert to 24-hour format
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      startTime.setHours(hours, minutes, 0, 0);
    }
  }
  
  // Calculate end time by adding duration (in minutes) to start time
  const endTime = new Date(
    startTime.getTime() + parseInt(contest.duration) * 60000
  );

  const contestStatus = {
    isStarted: now >= startTime,
    isEnded: now >= endTime,
    timeUntilStart: Math.max(0, startTime - now),
    timeUntilEnd: Math.max(0, endTime - now),
    startTime,
    endTime,
  };

  // Return appropriate data based on contest status
  const responseData = {
    contest: {
      _id: contest._id,
      title: contest.title,
      description: contest.description,
      startTime,
      duration: contest.duration,
      status: contest.status,
      isJudged: contest.isJudged || false,
    },
    contestStatus,
    problems: contest.problems, // Always include problems
  };

  // Include participant count
  responseData.participantCount = contest.participants.length;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        responseData,
        "Contest lobby information fetched successfully"
      )
    );
});

// @desc    Toggle judge functionality for a contest
// @route   PATCH /api/v1/contests/:id/toggle-judge
// @access  Admin
export const toggleContestJudge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isJudged } = req.body;

  if (isJudged === undefined) {
    throw new ApiError(400, "isJudged field is required");
  }

  const contest = await Contest.findById(id);

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  contest.isJudged = isJudged;
  await contest.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { contest },
        `Contest judge functionality ${isJudged ? "enabled" : "disabled"} successfully`
      )
    );
});

// @desc    Remove a participant from a contest
// @route   DELETE /api/v1/contests/:id/participants/:participantId
// @access  Admin
export const removeParticipant = asyncHandler(async (req, res) => {
  const { id, participantId } = req.params;

  const contest = await Contest.findById(id);

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  const participantIndex = contest.participants.findIndex(
    (p) => p._id.toString() === participantId
  );

  if (participantIndex === -1) {
    throw new ApiError(404, "Participant not found in this contest");
  }

  contest.participants.splice(participantIndex, 1);
  await contest.save();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Participant removed successfully"));
});

// @desc    Unregister from a contest
// @route   DELETE /api/v1/contests/:id/register
// @access  Public
export const unregisterFromContest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, participantId } = req.body;

  const contest = await Contest.findById(id);

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  // Find the participant to remove
  let participantIndex = -1;

  if (userId) {
    participantIndex = contest.participants.findIndex(
      (p) => p.user && p.user.toString() === userId.toString()
    );
  } else if (participantId) {
    participantIndex = contest.participants.findIndex(
      (p) => p._id.toString() === participantId.toString()
    );
  } else {
    // If no specific user/participant is given, remove the last added participant
    participantIndex = contest.participants.length - 1;
  }

  if (participantIndex === -1) {
    throw new ApiError(404, "Participant not found in this contest");
  }

  contest.participants.splice(participantIndex, 1);
  await contest.save();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Unregistered from contest successfully"));
});
