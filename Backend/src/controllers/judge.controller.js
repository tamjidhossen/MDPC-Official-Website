import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Problem } from "../models/problem.model.js";
import { Contest } from "../models/contest.model.js";
import { Submission } from "../models/submission.model.js";
import { User } from "../models/user.model.js";
import { runCppCode, calculateScore } from "../utils/codeRunner.js";
import mongoose from "mongoose";

// @desc    Submit and judge code
// @route   POST /api/v1/judge/submit
// @access  Public - no auth needed
export const submitCode = asyncHandler(async (req, res) => {
  const { code, problemId, contestId, language = "cpp", userId } = req.body;

  if (!code || !problemId) {
    throw new ApiError(400, "Code and problem ID are required");
  }

  // Find the problem
  const problem = await Problem.findById(problemId);
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }

  // If contestId is provided, validate it
  let contest = null;
  if (contestId) {
    contest = await Contest.findById(contestId);
    if (!contest) {
      throw new ApiError(404, "Contest not found");
    }

    // Removed registration check
  }

  // Judge the submission
  const judgingResult = await runCppCode(code, problem.testCases);

  // Calculate score
  const score =
    judgingResult.verdict === "Accepted"
      ? calculateScore(problem, contest, new Date())
      : 0;

  // Create submission record using provided userId or a temporary one
  const submissionUserId = userId || "temp_user_" + Date.now();

  // Check if userId is a valid MongoDB ObjectId
  let isTemporaryUser = true;
  if (userId) {
    try {
      // Check if it's an ObjectId format
      if (mongoose.Types.ObjectId.isValid(userId)) {
        // Check if it corresponds to an actual user
        const userExists = await User.exists({ _id: userId });
        if (userExists) {
          isTemporaryUser = false;
        }
      }
    } catch (error) {
      console.log("Error verifying user ID:", error);
    }
  }

  const submission = await Submission.create({
    userId: submissionUserId,
    problemId,
    contestId,
    code,
    language,
    verdict: judgingResult.verdict,
    executionTime: judgingResult.executionTime || 0,
    score,
    isTemporaryUser,
    testResults: judgingResult.results.map((result) => ({
      testCase: result.testCase,
      verdict: result.verdict,
      executionTime: result.executionTime,
    })),
  });

  // Update contest scores if needed
  if (judgingResult.verdict === "Accepted" && contest && !isTemporaryUser) {
    // Find the participant in the contest
    const participantIndex = contest.participants.findIndex(
      (p) => p.user.toString() === userId
    );

    if (participantIndex !== -1) {
      // Check if user has already solved this problem
      const existingSubmission = await Submission.findOne({
        userId: userId,
        problemId: problemId,
        contestId: contestId,
        verdict: "Accepted",
        _id: { $ne: submission._id }, // Exclude the current submission
      });

      // Only update score if this is their first accepted submission for this problem
      if (!existingSubmission) {
        // Update or add to participant's score
        const existingScore = contest.participants[participantIndex].score || 0;
        contest.participants[participantIndex].score = existingScore + score;

        // Create a sorted copy for ranking
        const sortedParticipants = [...contest.participants].sort(
          (a, b) => (b.score || 0) - (a.score || 0)
        );

        // Assign ranks
        let currentRank = 1;
        let prevScore = -1;

        // Create a map to store ranks by user ID
        const rankMap = new Map();

        sortedParticipants.forEach((participant, index) => {
          if (participant.score !== prevScore) {
            currentRank = index + 1;
            prevScore = participant.score;
          }
          // Store ranks in map keyed by user ID
          rankMap.set(participant.user.toString(), currentRank);
        });

        // Update ranks in the original participants array
        contest.participants.forEach((participant) => {
          if (participant.user) {
            const userId = participant.user.toString();
            if (rankMap.has(userId)) {
              participant.rank = rankMap.get(userId);
            }
          }
        });

        console.log(
          `Updated participant score: ${contest.participants[participantIndex].score}, rank: ${contest.participants[participantIndex].rank}`
        );

        // Save the updated contest
        await contest.save();
      }
    }
  }

  // Return response with filtered results for example test cases
  const responseResults = problem.testCases
    .filter((tc) => tc.isExample)
    .map((_, index) => judgingResult.results[index]);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        submission: {
          _id: submission._id,
          verdict: submission.verdict,
          score: submission.score,
          executionTime: submission.executionTime,
          testResults: responseResults,
        },
      },
      "Code submitted and judged successfully"
    )
  );
});

// @desc    Get user submissions
// @route   GET /api/v1/judge/submissions
// @access  Public - no auth needed
export const getUserSubmissions = asyncHandler(async (req, res) => {
  const {
    problemId,
    contestId,
    verdict,
    page = 1,
    limit = 10,
    userId,
  } = req.query;

  const filter = {};

  // Simply filter by userId if provided
  if (userId) {
    filter.userId = userId;
  }

  // Add additional filters if provided
  if (problemId) filter.problemId = problemId;
  if (contestId) filter.contestId = contestId;
  if (verdict) filter.verdict = verdict;

  const skip = (page - 1) * limit;

  try {
    const submissions = await Submission.find(filter)
      .populate("problemId", "name difficulty")
      .populate("contestId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Submission.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          submissions,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit),
          },
        },
        "Submissions fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw new ApiError(500, "Failed to fetch submissions");
  }
});

// @desc    Get a submission by ID
// @route   GET /api/v1/judge/submissions/:id
// @access  Public - no auth needed
export const getSubmissionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const submission = await Submission.findById(id)
    .populate("problemId")
    .populate("contestId", "title date duration")
    .populate("userId", "name username");

  if (!submission) {
    throw new ApiError(404, "Submission not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, { submission }, "Submission fetched successfully")
    );
});

// @desc    Get contest standings
// @route   GET /api/v1/judge/contests/:contestId/standings
// @access  Public - no auth needed
export const getContestStandings = asyncHandler(async (req, res) => {
  const { contestId } = req.params;

  const contest = await Contest.findById(contestId).populate({
    path: "participants.user",
    select: "name username",
  });

  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  // Get all problems in the contest
  const problems = await Problem.find({ contestId }).select(
    "_id name difficulty"
  );

  // Prepare standings
  const standings = contest.participants
    .map((participant) => ({
      user: participant.user,
      score: participant.score || 0,
      rank: participant.rank || 0,
    }))
    .sort((a, b) => b.score - a.score);

  // Assign ranks
  let currentRank = 1;
  let currentScore = -1;

  standings.forEach((participant, index) => {
    if (participant.score !== currentScore) {
      currentRank = index + 1;
      currentScore = participant.score;
    }
    participant.rank = currentRank;
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { standings, problems },
        "Contest standings fetched successfully"
      )
    );
});

export const getProblemsByContest = asyncHandler(async (req, res) => {
  const { contestId } = req.params;

  const contest = await Contest.findById(contestId);
  if (!contest) {
    throw new ApiError(404, "Contest not found");
  }

  const problems = await Problem.find({ contestId }).select(
    "_id name description difficulty inputFormat outputFormat testCases"
  );

  // Filter to only include example test cases
  problems.forEach((problem) => {
    problem.testCases = problem.testCases.filter((tc) => tc.isExample);
  });

  res
    .status(200)
    .json(new ApiResponse(200, { problems }, "Problems fetched successfully"));
});
