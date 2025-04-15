import axios from "axios";
import crypto from "crypto";

const CODEFORCES_API_BASE_URL = "https://codeforces.com/api";

class CodeforcesService {
  constructor() {
    this.apiKey = process.env.CODEFORCES_API_KEY;
    this.apiSecret = process.env.CODEFORCES_API_SECRET;
    this.baseURL = CODEFORCES_API_BASE_URL;
  }

  // Helper method to generate API signature
  generateApiSignature(methodName, params = {}) {
    if (!this.apiKey || !this.apiSecret) {
      return {}; // No auth needed for public endpoints
    }

    const rand = Math.random().toString(36).substring(2, 8); // Generate random 6 chars
    const currentTime = Math.floor(Date.now() / 1000);

    // Add API key and time to params
    params.apiKey = this.apiKey;
    params.time = currentTime;

    // Sort params alphabetically
    const sortedParams = Object.entries(params)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    // Build query string
    const queryString = Object.entries(sortedParams)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    // Create signature string
    const signatureString = `${rand}/${methodName}?${queryString}#${this.apiSecret}`;

    // Generate SHA-512 hash
    const hash = crypto
      .createHash("sha512")
      .update(signatureString)
      .digest("hex");

    // Return all necessary parameters for authenticated request
    return {
      ...params,
      apiSig: `${rand}${hash}`,
    };
  }

  // Common request method
  async makeRequest(methodName, params = {}) {
    try {
      const authParams = this.generateApiSignature(methodName, params);
      const url = `${this.baseURL}/${methodName}`;
      const response = await axios.get(url, { params: authParams });

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

  // Get user info
  async getUserInfo(handle) {
    return this.makeRequest("user.info", { handles: handle });
  }

  // Get rating history for a user
  async getUserRatingHistory(handle) {
    return this.makeRequest("user.rating", { handle });
  }

  // Get user submissions
  async getUserSubmissions(handle, count = 100) {
    return this.makeRequest("user.status", { handle, count });
  }

  // Get user contest participation
  async getContestList(gym = false) {
    return this.makeRequest("contest.list", { gym });
  }

  // Get problems with statistics
  async getProblems(tags = "") {
    return this.makeRequest("problemset.problems", tags ? { tags } : {});
  }

  // Get user's recent contest performance
  async getUserRecentContests(handle, count = 5) {
    const ratingChanges = await this.makeRequest("user.rating", { handle });
    return ratingChanges.slice(-count);
  }

  // Calculate problem statistics by index and rating
  async getProblemDistribution(filters = {}) {
    const { problemsetName, tags } = filters;
    const params = {};

    if (problemsetName) params.problemsetName = problemsetName;
    if (tags) params.tags = tags;

    const problems = await this.makeRequest("problemset.problems", params);
    return this.analyzeProblemDistribution(problems.problems, filters);
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
        // Logic to determine contest type from problem data
        // This is approximate as the API doesn't directly provide contest type
        const contestId = p.contestId;
        // Implementation would depend on how to identify contest types
        return true; // Placeholder
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

      // Filter problems by date if we can determine it
      // Note: This would require additional data about when problems were added
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

    return {
      ratingDistribution,
      indexDistribution,
      totalProblems: filteredProblems.length,
    };
  }
}

export default new CodeforcesService();
