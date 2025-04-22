import { Problem } from "../models/problem.model.js";
import { Contest } from "../models/contest.model.js";
import { Submission } from "../models/submission.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Create a new problem
// @route   POST /api/v1/problems
// @access  Admin
export const createProblem = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    inputFormat,
    outputFormat,
    difficulty,
    contestId,
    timeLimit,
    memoryLimit,
    points,
    testCases,
  } = req.body;

  // Validate required fields
  if (!name || !description || !inputFormat || !outputFormat) {
    throw new ApiError(
      400,
      "Name, description, input format, and output format are required"
    );
  }

  // Validate test cases
  if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
    throw new ApiError(400, "At least one test case is required");
  }

  // Check if contest exists if contestId is provided
  if (contestId) {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      throw new ApiError(404, "Contest not found");
    }
  }

  // Create the problem
  const problem = await Problem.create({
    name,
    description,
    inputFormat,
    outputFormat,
    difficulty: difficulty || "Medium",
    contestId: contestId || null,
    timeLimit: timeLimit || 1000,
    memoryLimit: memoryLimit || 256,
    points: points || 100,
    testCases,
  });

  // If problem is associated with a contest, add it to the contest's problems array
  if (contestId) {
    await Contest.findByIdAndUpdate(contestId, {
      $addToSet: { problems: problem._id },
    });
  }

  res
    .status(201)
    .json(new ApiResponse(201, { problem }, "Problem created successfully"));
});

// @desc    Get all problems
// @route   GET /api/v1/problems
// @access  Admin
export const getAllProblems = asyncHandler(async (req, res) => {
  const { contestId, difficulty, search, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = {};

  if (contestId) {
    filter.contestId = contestId;
  }

  if (difficulty) {
    filter.difficulty = difficulty;
  }

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Find problems with pagination
  const problems = await Problem.find(filter)
    .populate("contestId", "title date")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Count total problems for pagination info
  const total = await Problem.countDocuments(filter);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        problems,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Problems fetched successfully"
    )
  );
});

// @desc    Get a single problem
// @route   GET /api/v1/problems/:id
// @access  Public
export const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find problem by ID
  const problem = await Problem.findById(id);

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  // For problems in contests, only return example test cases
  // unless explicitly requested to see all (for editing/admin purposes)
  const showAllTestCases = req.query.showAllTests === "true";

  if (!showAllTestCases) {
    problem.testCases = problem.testCases.filter((tc) => tc.isExample);
  }

  res
    .status(200)
    .json(new ApiResponse(200, { problem }, "Problem fetched successfully"));
});

// @desc    Update a problem
// @route   PUT /api/v1/problems/:id
// @access  Admin
export const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    inputFormat,
    outputFormat,
    difficulty,
    contestId,
    timeLimit,
    memoryLimit,
    points,
    testCases,
  } = req.body;

  // Find problem by ID
  const problem = await Problem.findById(id);

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  // Check if contest exists if contestId is provided
  if (contestId) {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      throw new ApiError(404, "Contest not found");
    }
  }

  // Update problem fields if provided
  if (name) problem.name = name;
  if (description) problem.description = description;
  if (inputFormat) problem.inputFormat = inputFormat;
  if (outputFormat) problem.outputFormat = outputFormat;
  if (difficulty) problem.difficulty = difficulty;
  if (timeLimit) problem.timeLimit = timeLimit;
  if (memoryLimit) problem.memoryLimit = memoryLimit;
  if (points) problem.points = points;
  if (testCases && Array.isArray(testCases) && testCases.length > 0) {
    problem.testCases = testCases;
  }

  // Handle contest association changes
  if (contestId !== undefined) {
    const oldContestId = problem.contestId?.toString();

    // Remove problem from old contest if it was previously associated
    if (oldContestId && oldContestId !== contestId) {
      await Contest.findByIdAndUpdate(oldContestId, {
        $pull: { problems: problem._id },
      });
    }

    // Add to new contest if contestId is provided
    if (contestId) {
      await Contest.findByIdAndUpdate(contestId, {
        $addToSet: { problems: problem._id },
      });
      problem.contestId = contestId;
    } else {
      problem.contestId = null;
    }
  }

  // Save the updated problem
  await problem.save();

  res
    .status(200)
    .json(new ApiResponse(200, { problem }, "Problem updated successfully"));
});

// @desc    Delete a problem
// @route   DELETE /api/v1/problems/:id
// @access  Admin
export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find problem by ID
  const problem = await Problem.findById(id);

  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  // If problem is associated with a contest, remove it from the contest's problems array
  if (problem.contestId) {
    await Contest.findByIdAndUpdate(problem.contestId, {
      $pull: { problems: problem._id },
    });
  }

  // Delete associated submissions
  await Submission.deleteMany({ problemId: problem._id });

  // Delete the problem
  await Problem.findByIdAndDelete(id);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Problem and associated submissions deleted successfully"
      )
    );
});
