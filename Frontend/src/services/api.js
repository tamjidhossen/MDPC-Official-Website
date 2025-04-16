import axios from "axios";

// Create axios instance with default configs
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // This is important for cookies to be sent and received
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
  // Login user
  login: async (credentials) => {
    const response = await apiClient.post("/users/login", credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await apiClient.post("/users/logout");
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post("/users/refresh-token", {
      refreshToken,
    });
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    const response = await apiClient.get("/users", { params });
    return response.data;
  },

  // Update user role to admin (admin only)
  promoteToAdmin: async (userId) => {
    const response = await apiClient.patch(`/users/${userId}/role`, {
      role: "admin",
    });
    return response.data;
  },

  // Update user role to regular user (admin only)
  removeAdmin: async (userId) => {
    const response = await apiClient.patch(`/users/${userId}/role`, {
      role: "user",
    });
    return response.data;
  },
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
