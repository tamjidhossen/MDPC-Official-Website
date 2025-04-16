import axios from "axios";

const CODEFORCES_API_BASE_URL = "https://codeforces.com/api";

class CodeforcesService {
  constructor() {
    this.baseURL = CODEFORCES_API_BASE_URL;
  }

  // Common request method
  async makeRequest(methodName, params = {}) {
    try {
      const url = `${this.baseURL}/${methodName}`;
      const response = await axios.get(url, { params });

      if (response.data.status === "OK") {
        return response.data.result;
      } else {
        throw new Error(
          `Codeforces API Error: ${response.data.comment || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error(
        `Error calling Codeforces API (${methodName}):`,
        error.message
      );
      throw error;
    }
  }

  // Get information about one or several users
  async getUserInfo(handles) {
    // Convert single handle to semicolon-separated format if needed
    const handlesParam = Array.isArray(handles) ? handles.join(";") : handles;
    return this.makeRequest("user.info", { handles: handlesParam });
  }

  // Get rating history for a user
  async getUserRatingHistory(handle) {
    return this.makeRequest("user.rating", { handle });
  }

  // Get user submissions
  async getUserSubmissions(handle, count = 100, from = 1) {
    return this.makeRequest("user.status", { handle, count, from });
  }

  // Get user's blog entries
  async getUserBlogEntries(handle) {
    return this.makeRequest("user.blogEntries", { handle });
  }

  // Get authorized user's friends (requires auth)
  // async getUserFriends(onlyOnline = false) {
  //   return this.makeRequest("user.friends", { onlyOnline });
  // }

  // Get users who participated in rated contests
  async getRatedUsers(activeOnly = true, includeRetired = false) {
    return this.makeRequest("user.ratedList", { activeOnly, includeRetired });
  }

  // Get all available contests
  async getContestList(gym = false) {
    return this.makeRequest("contest.list", { gym });
  }

  // Get contest standings
  async getContestStandings(
    contestId,
    from = 1,
    count = 10,
    showUnofficial = false,
    room = undefined,
    handles = undefined
  ) {
    const params = { contestId, from, count, showUnofficial };
    if (room !== undefined) params.room = room;
    if (handles !== undefined) {
      // Convert array to semicolon-separated format if needed
      params.handles = Array.isArray(handles) ? handles.join(";") : handles;
    }
    return this.makeRequest("contest.standings", params);
  }

  // Get submissions for a contest
  async getContestSubmissions(
    contestId,
    from = 1,
    count = 10,
    handle = undefined
  ) {
    const params = { contestId, from, count };
    if (handle) params.handle = handle;
    return this.makeRequest("contest.status", params);
  }

  // Get rating changes after a contest
  async getContestRatingChanges(contestId) {
    return this.makeRequest("contest.ratingChanges", { contestId });
  }

  // Get hacks in a contest
  async getContestHacks(contestId) {
    return this.makeRequest("contest.hacks", { contestId });
  }

  // Get all problems
  async getProblems(tags = "") {
    const params = {};
    if (tags) {
      // Convert array to semicolon-separated format if needed
      params.tags = Array.isArray(tags) ? tags.join(";") : tags;
    }
    return this.makeRequest("problemset.problems", params);
  }

  // Get recent submissions
  async getRecentSubmissions(count = 10) {
    return this.makeRequest("problemset.recentStatus", { count });
  }

  // Get a blog entry
  async getBlogEntry(blogEntryId) {
    return this.makeRequest("blogEntry.view", { blogEntryId });
  }

  // Get comments on a blog entry
  async getBlogEntryComments(blogEntryId) {
    return this.makeRequest("blogEntry.comments", { blogEntryId });
  }

  // Get recent actions
  async getRecentActions(maxCount = 30) {
    return this.makeRequest("recentActions", { maxCount });
  }

  // Get user's recent contest performance (utility method)
  async getUserRecentContests(handle, count = 5) {
    const ratingChanges = await this.makeRequest("user.rating", { handle });
    return ratingChanges.slice(-count);
  }

  // Calculate problem statistics by index and rating
  async getProblemDistribution(filters = {}) {
    const { problemsetName, tags } = filters;
    const params = {};

    if (problemsetName) params.problemsetName = problemsetName;
    if (tags) {
      // Convert array to semicolon-separated format if needed
      params.tags = Array.isArray(tags) ? tags.join(";") : tags;
    }

    const result = await this.makeRequest("problemset.problems", params);
    return this.analyzeProblemDistribution(result.problems, filters);
  }

  // Helper method to analyze problem distribution
  analyzeProblemDistribution(problems, filters = {}) {
    const { contestType, timing, index } = filters;
    let filteredProblems = [...problems];

    // Filter by index if specified
    if (index) {
      filteredProblems = filteredProblems.filter((p) => p.index === index);
    }

    // Filter by contest type if specified
    if (contestType && contestType !== "All Types") {
      filteredProblems = filteredProblems.filter((p) => {
        // Contest type filtering logic
        // Typical contest IDs follow patterns:
        // - Educational rounds: 1200-1399
        // - Div. 1: typically under 1000
        // - Div. 2: typically 1000-1999
        // - Div. 3: typically 1600-1999
        // - Gym contests: typically above 100000
        const contestId = p.contestId;

        switch (contestType) {
          case "Educational":
            return contestId >= 1200 && contestId < 1400;
          case "Div. 1":
            return contestId < 1000 || (contestId >= 1700 && contestId < 1800);
          case "Div. 2":
            return contestId >= 1000 && contestId < 1600;
          case "Div. 3":
            return contestId >= 1600 && contestId < 1700;
          case "Gym":
            return contestId >= 100000;
          default:
            return true;
        }
      });
    }

    // Filter by timing if specified
    if (timing && timing !== "All Time") {
      const now = Date.now();
      let timeFilter = 0;

      switch (timing) {
        case "Last Week":
          timeFilter = 7 * 24 * 60 * 60 * 1000;
          break;
        case "Last Month":
          timeFilter = 30 * 24 * 60 * 60 * 1000;
          break;
        case "Last 3 Months":
          timeFilter = 90 * 24 * 60 * 60 * 1000;
          break;
        case "Last 6 Months":
          timeFilter = 180 * 24 * 60 * 60 * 1000;
          break;
        case "Last Year":
          timeFilter = 365 * 24 * 60 * 60 * 1000;
          break;
        case "Last 2 Years":
          timeFilter = 2 * 365 * 24 * 60 * 60 * 1000;
          break;
        case "Last 4 Years":
          timeFilter = 4 * 365 * 24 * 60 * 60 * 1000;
          break;
      }

      // Filter problems by contest ID as a proxy for date
      // Lower contest IDs are generally older
      // This is an approximation since the API doesn't directly provide problem creation date
      const contestIds = [
        ...new Set(filteredProblems.map((p) => p.contestId)),
      ].sort((a, b) => b - a);
      const recentContestIds = new Set(
        contestIds.slice(
          0,
          Math.ceil(
            contestIds.length * (timeFilter / (4 * 365 * 24 * 60 * 60 * 1000))
          )
        )
      );

      filteredProblems = filteredProblems.filter((p) =>
        recentContestIds.has(p.contestId)
      );
    }

    // Analyze by rating
    const ratingDistribution = {};
    for (let rating = 800; rating <= 3500; rating += 100) {
      ratingDistribution[rating] = filteredProblems.filter(
        (p) => p.rating === rating
      ).length;
    }

    // Analyze by index
    const indexDistribution = {};
    filteredProblems.forEach((p) => {
      if (p.index) {
        indexDistribution[p.index] = (indexDistribution[p.index] || 0) + 1;
      }
    });

    // Add analysis by tags
    const tagDistribution = {};
    filteredProblems.forEach((p) => {
      if (p.tags && Array.isArray(p.tags)) {
        p.tags.forEach((tag) => {
          tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
        });
      }
    });

    return {
      ratingDistribution,
      indexDistribution,
      tagDistribution,
      totalProblems: filteredProblems.length,
    };
  }
}

export default new CodeforcesService();
