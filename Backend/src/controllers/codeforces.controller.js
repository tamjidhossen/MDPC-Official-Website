import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import codeforcesService from "../services/codeforces.service.js";

// Get leaderboard data (Organization ranking, username, rating, rank, contests)
const getOrganizationLeaderboard = asyncHandler(async (req, res) => {
  const organization = req.query.organization || "Jatiya Kabi Kazi Nazrul Islam University";
  const limit = parseInt(req.query.limit) || 20;

  try {
    // Fetch all rated users
    const allUsers = await codeforcesService.getRatedUsers(false, true);
    // console.log(allUsers.length) # 808960 -> this shit needs to be cached
    // Filter users by organization (case-insensitive partial match)
    const orgUsers = allUsers
      .filter(
        (user) =>
          user.organization &&
          user.organization.toLowerCase().includes(organization.toLowerCase())
      )
      .slice(0, limit);

    if (orgUsers.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            [],
            `No users found for organization: ${organization}`
          )
        );
    }

    const userData = orgUsers.map((user) => {
      return {
      handle: user.handle,
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || "unrated",
      };
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userData,
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

    // Get submission data for problem counts (fetch latest 500 submissions)
    const submissions = await codeforcesService.getUserSubmissions(handle, 500);

    // Process submissions for solved problems
    const uniqueProblemsSolved = new Map();
    const lastWeekSolved = new Map();
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    submissions.forEach((sub) => {
      if (sub.verdict === "OK") {
        const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;

        // Track all-time solved problems
        uniqueProblemsSolved.set(problemKey, {
          name: sub.problem.name,
          rating: sub.problem.rating || 0,
          tags: sub.problem.tags || [],
          contestId: sub.problem.contestId,
          index: sub.problem.index,
          solvedTime: sub.creationTimeSeconds,
        });

        // Track last week solved problems
        if (sub.creationTimeSeconds * 1000 >= oneWeekAgo) {
          lastWeekSolved.set(problemKey, true);
        }
      }
    });

    // Analyze problems by rating
    const ratingDistribution = {};
    for (let rating = 800; rating <= 3500; rating += 100) {
      ratingDistribution[rating] = 0;
    }

    Array.from(uniqueProblemsSolved.values()).forEach((problem) => {
      if (problem.rating && ratingDistribution.hasOwnProperty(problem.rating)) {
        ratingDistribution[problem.rating]++;
      }
    });

    // Get recent contest performance
    const recentContests = await codeforcesService.getUserRecentContests(
      handle,
      10
    );
    const contests = await codeforcesService.getContestList();

    // Enrich recent contest data with contest names
    const contestMap = new Map();
    contests.forEach((contest) => {
      contestMap.set(contest.id, {
        name: contest.name,
        startTimeSeconds: contest.startTimeSeconds,
        type: contest.type,
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
          contestType: contestInfo.type || "Unknown",
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
        avatar: userInfo.avatar,
        contribution: userInfo.contribution || 0,
        registrationTimeSeconds: userInfo.registrationTimeSeconds,
        lastOnlineTimeSeconds: userInfo.lastOnlineTimeSeconds,
        organization: userInfo.organization || "",
      },
      problemStats: {
        totalSolved: uniqueProblemsSolved.size,
        lastWeekSolved: lastWeekSolved.size,
        ratingDistribution: ratingDistribution,
        recentlySolved: Array.from(uniqueProblemsSolved.values())
          .sort((a, b) => b.solvedTime - a.solvedTime)
          .slice(0, 10),
      },
      contestStats: {
        totalParticipated: ratingHistory.length,
        recentContests: enrichedRecentContests,
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
    const {
      index,
      contestType = "All Types",
      timing = "All Time",
      tags = "",
    } = req.query;

    // Get problem distribution based on filters
    const distribution = await codeforcesService.getProblemDistribution({
      index,
      contestType,
      timing,
      tags: tags ? tags.split(",") : undefined,
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

// Get contest list with optional filtering
const getContestList = asyncHandler(async (req, res) => {
  try {
    const { gym = false, type } = req.query;
    const showGym = gym === "true";

    const contests = await codeforcesService.getContestList(showGym);

    // Filter by contest type if specified
    const filteredContests = type
      ? contests.filter((contest) => contest.type === type.toUpperCase())
      : contests;

    // Return recent contests first
    const sortedContests = filteredContests.sort(
      (a, b) => b.startTimeSeconds - a.startTimeSeconds
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sortedContests,
          "Contest list fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Failed to fetch contest list: " + error.message);
  }
});

export {
  getOrganizationLeaderboard,
  getUserDashboard,
  getProblemDistribution,
  getContestList,
};
