import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import codeforcesService from "../services/codeforces.service.js";

// Get leaderboard data (Organization ranking, username, rating, rank, contests)
// e.g., jkkniu with rank 63
const getOrganizationLeaderboard = asyncHandler(async (req, res) => {
  const organization = req.query.organization || "jkkniu";

  try {
    // For a real implementation, we would likely have pre-stored user handles from our org
    // Here's a simple placeholder implementation for jkkniu users
    const userHandles = [
      "CuriousLearner",
      "tamjid",
      "codeforcesuser1",
      "codeforcesuser2",
    ];

    // Get data for each user
    const userData = await Promise.all(
      userHandles.map(async (handle) => {
        try {
          const userInfoResult = await codeforcesService.getUserInfo(handle);
          const userInfo = userInfoResult[0]; // API returns array of user objects
          const ratingHistory =
            await codeforcesService.getUserRatingHistory(handle);

          return {
            handle: userInfo.handle,
            rating: userInfo.rating || 0,
            maxRating: userInfo.maxRating || 0,
            rank: userInfo.rank || "unrated",
            organization: userInfo.organization || "",
            contestCount: ratingHistory.length,
          };
        } catch (error) {
          console.error(
            `Error fetching data for user ${handle}:`,
            error.message
          );
          return {
            handle,
            rating: 0,
            maxRating: 0,
            rank: "unrated",
            organization: "",
            contestCount: 0,
            error: error.message,
          };
        }
      })
    );

    // Sort by rating in descending order
    const sortedUsers = userData
      .filter((user) => !user.error)
      .sort((a, b) => b.rating - a.rating);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sortedUsers,
          "Organization leaderboard fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to fetch organization leaderboard: " + error.message
    );
  }
});

// Get user dashboard data (for specific user)
const getUserDashboard = asyncHandler(async (req, res) => {
  const handle = req.params.handle;
  if (!handle) {
    throw new ApiError(400, "Codeforces handle is required");
  }

  try {
    // Get user info
    const userInfoResult = await codeforcesService.getUserInfo(handle);
    const userInfo = userInfoResult[0]; // API returns array of user objects

    // Get rating history for graph
    const ratingHistory = await codeforcesService.getUserRatingHistory(handle);

    // Get submission data for problem counts
    const submissions = await codeforcesService.getUserSubmissions(handle, 500);

    // Process submissions for solved problems
    const uniqueProblemsSolved = new Map();
    const lastWeekSolved = new Map();
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    submissions.forEach((sub) => {
      if (sub.verdict === "OK") {
        const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;

        // Track all-time solved problems
        uniqueProblemsSolved.set(problemKey, true);

        // Track last week solved problems
        if (sub.creationTimeSeconds * 1000 >= oneWeekAgo) {
          lastWeekSolved.set(problemKey, true);
        }
      }
    });

    // Get recent contest performance (last 5)
    const recentContests =
      await codeforcesService.getUserRecentContests(handle);
    const contests = await codeforcesService.getContestList();

    // Enrich recent contest data with contest names
    const contestMap = new Map();
    contests.forEach((contest) => {
      contestMap.set(contest.id, {
        name: contest.name,
        startTimeSeconds: contest.startTimeSeconds,
      });
    });

    const enrichedRecentContests = recentContests
      .map((contest) => {
        const contestInfo = contestMap.get(contest.contestId) || {};
        return {
          contestId: contest.contestId,
          contestName: contestInfo.name || `Contest ${contest.contestId}`,
          date: new Date(contest.ratingUpdateTimeSeconds * 1000)
            .toISOString()
            .split("T")[0],
          rank: contest.rank,
          oldRating: contest.oldRating,
          newRating: contest.newRating,
          ratingChange: contest.newRating - contest.oldRating,
        };
      })
      .reverse(); // Most recent first

    const dashboardData = {
      userInfo: {
        handle: userInfo.handle,
        rating: userInfo.rating || 0,
        maxRating: userInfo.maxRating || 0,
        rank: userInfo.rank || "unrated",
        titlePhoto: userInfo.titlePhoto,
        contribution: userInfo.contribution || 0,
      },
      problemStats: {
        totalSolved: uniqueProblemsSolved.size,
        lastWeekSolved: lastWeekSolved.size,
      },
      contestStats: {
        totalParticipated: ratingHistory.length,
      },
      ratingHistory: ratingHistory.map((r) => ({
        contestId: r.contestId,
        contestName: r.contestName,
        date: new Date(r.ratingUpdateTimeSeconds * 1000)
          .toISOString()
          .split("T")[0],
        rank: r.rank,
        oldRating: r.oldRating,
        newRating: r.newRating,
      })),
      recentContests: enrichedRecentContests,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          dashboardData,
          "User dashboard data fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to fetch user dashboard data: " + error.message
    );
  }
});

// Get problem distribution data (not user specific)
const getProblemDistribution = asyncHandler(async (req, res) => {
  try {
    const { index, contestType = "All Types", timing = "All Time" } = req.query;

    // Get problem distribution based on filters
    const distribution = await codeforcesService.getProblemDistribution({
      index,
      contestType,
      timing,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          distribution,
          "Problem distribution data fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Failed to fetch problem distribution data: " + error.message
    );
  }
});

export { getOrganizationLeaderboard, getUserDashboard, getProblemDistribution };
