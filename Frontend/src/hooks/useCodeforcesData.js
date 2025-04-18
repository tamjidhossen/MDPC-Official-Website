import { useState, useCallback, useMemo, useEffect } from "react";
import { codeforcesApi } from "@/services/api";

// In-memory cache for API responses
const cache = {
  leaderboard: {
    data: null,
    timestamp: null,
  },
  userDashboards: {}, // Will store data by handle
  problemDistribution: {
    data: null,
    timestamp: null,
  },
};

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

// Request tracking to deduplicate in-flight requests
const pendingRequests = {
  leaderboard: null,
  userDashboards: {},
  problemDistribution: null,
};

/**
 * Custom hook for efficiently fetching and caching Codeforces data
 * Implements:
 * - Data caching with TTL
 * - Request deduplication
 * - Shared data between components
 */
const useCodeforcesData = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Fetches the organization leaderboard with caching
   */
  const getLeaderboard = useCallback(async (organization) => {
    // Check if we have valid cached data
    const now = Date.now();
    if (
      cache.leaderboard.data &&
      cache.leaderboard.timestamp &&
      now - cache.leaderboard.timestamp < CACHE_DURATION
    ) {
      return { data: cache.leaderboard.data, fromCache: true };
    }

    // If there's already a request in flight, wait for that one
    if (pendingRequests.leaderboard) {
      return pendingRequests.leaderboard;
    }

    // Start a new request
    setLoading(true);

    // Create a new promise for this request
    const requestPromise = new Promise(async (resolve) => {
      try {
        const response = await codeforcesApi.getLeaderboard(organization);

        // Update the cache with the new data
        cache.leaderboard = {
          data: response.data,
          timestamp: Date.now(),
        };

        resolve({ data: response.data, fromCache: false });
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        resolve({ error: error.message || "Failed to fetch leaderboard data" });
      } finally {
        setLoading(false);
        pendingRequests.leaderboard = null;
      }
    });

    // Store the promise so other calls can use it
    pendingRequests.leaderboard = requestPromise;

    return requestPromise;
  }, []);

  /**
   * Fetches a user's dashboard data with caching (by handle)
   */
  const getUserDashboard = useCallback(async (handle) => {
    if (!handle) {
      return { error: "No handle provided" };
    }

    // Check if we have valid cached data for this handle
    const now = Date.now();
    if (
      cache.userDashboards[handle]?.data &&
      cache.userDashboards[handle]?.timestamp &&
      now - cache.userDashboards[handle].timestamp < CACHE_DURATION
    ) {
      return { data: cache.userDashboards[handle].data, fromCache: true };
    }

    // If there's already a request in flight for this handle, wait for that one
    if (pendingRequests.userDashboards[handle]) {
      return pendingRequests.userDashboards[handle];
    }

    // Start a new request
    setLoading(true);

    // Create a new promise for this request
    const requestPromise = new Promise(async (resolve) => {
      try {
        const response = await codeforcesApi.getUserDashboard(handle);

        // Update the cache with the new data
        if (!cache.userDashboards[handle]) {
          cache.userDashboards[handle] = {};
        }

        cache.userDashboards[handle] = {
          data: response.data,
          timestamp: Date.now(),
        };

        resolve({ data: response.data, fromCache: false });
      } catch (error) {
        console.error(`Error fetching dashboard for ${handle}:`, error);
        resolve({
          error:
            error.message || `Failed to fetch dashboard data for ${handle}`,
        });
      } finally {
        setLoading(false);
        pendingRequests.userDashboards[handle] = null;
      }
    });

    // Store the promise so other calls can use it
    pendingRequests.userDashboards[handle] = requestPromise;

    return requestPromise;
  }, []);

  /**
   * Fetches problem distribution data with caching
   */
  const getProblemDistribution = useCallback(async (params = {}) => {
    // Create a cache key based on params
    const cacheKey = JSON.stringify(params);

    // Check if we have valid cached data
    const now = Date.now();
    if (
      cache.problemDistribution.data &&
      cache.problemDistribution.timestamp &&
      now - cache.problemDistribution.timestamp < CACHE_DURATION
    ) {
      return { data: cache.problemDistribution.data, fromCache: true };
    }

    // If there's already a request in flight, wait for that one
    if (pendingRequests.problemDistribution) {
      return pendingRequests.problemDistribution;
    }

    // Start a new request
    setLoading(true);

    // Create a new promise for this request
    const requestPromise = new Promise(async (resolve) => {
      try {
        const response = await codeforcesApi.getProblemDistribution(params);

        // Update the cache with the new data
        cache.problemDistribution = {
          data: response.data,
          timestamp: Date.now(),
        };

        resolve({ data: response.data, fromCache: false });
      } catch (error) {
        console.error("Error fetching problem distribution:", error);
        resolve({
          error: error.message || "Failed to fetch problem distribution data",
        });
      } finally {
        setLoading(false);
        pendingRequests.problemDistribution = null;
      }
    });

    // Store the promise so other calls can use it
    pendingRequests.problemDistribution = requestPromise;

    return requestPromise;
  }, []);

  /**
   * Manually clear the cache (useful for debugging or forcing a refresh)
   */
  const clearCache = useCallback((type, handle = null) => {
    if (type === "leaderboard") {
      cache.leaderboard = { data: null, timestamp: null };
    } else if (type === "userDashboard" && handle) {
      if (cache.userDashboards[handle]) {
        cache.userDashboards[handle] = { data: null, timestamp: null };
      }
    } else if (type === "problemDistribution") {
      cache.problemDistribution = { data: null, timestamp: null };
    } else if (type === "all") {
      cache.leaderboard = { data: null, timestamp: null };
      cache.userDashboards = {};
      cache.problemDistribution = { data: null, timestamp: null };
    }
  }, []);

  // Return the hook API
  return useMemo(
    () => ({
      loading,
      getLeaderboard,
      getUserDashboard,
      getProblemDistribution,
      clearCache,
    }),
    [
      loading,
      getLeaderboard,
      getUserDashboard,
      getProblemDistribution,
      clearCache,
    ]
  );
};

export default useCodeforcesData;
