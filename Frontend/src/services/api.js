import axios from "axios";

// Create axios instance with default configs
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// Codeforces API endpoints
export const codeforcesApi = {
  // Get organization leaderboard
  getLeaderboard: async (
    organization = "Jatiya Kabi Kazi Nazrul Islam University"
  ) => {
    const response = await apiClient.get("/codeforces/leaderboard", {
      params: { organization },
    });
    return response.data;
  },

  // Get user dashboard data
  getUserDashboard: async (handle) => {
    const response = await apiClient.get(`/codeforces/user/${handle}`);
    return response.data;
  },

  // Get problem distribution data
  getProblemDistribution: async (params = {}) => {
    const response = await apiClient.get("/codeforces/problems/distribution", {
      params,
    });
    return response.data;
  },
};

// User API endpoints
export const userApi = {
  // Add user-related API calls here
};

// Blog API endpoints
export const blogApi = {
  // Add blog-related API calls here
};

// Event API endpoints
export const eventApi = {
  // Add event-related API calls here
};

// Contest API endpoints
export const contestApi = {
  // Add contest-related API calls here
};

// Resource API endpoints
export const resourceApi = {
  // Add resource-related API calls here
};

export default apiClient;
