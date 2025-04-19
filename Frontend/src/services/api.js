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
  // Register new user
  register: async (userData) => {
    const response = await apiClient.post("/users/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post("/users/login", credentials);

    // Parse programmingHandles if it exists and is a string
    if (response.data?.data?.user?.programmingHandles) {
      try {
        if (typeof response.data.data.user.programmingHandles === "string") {
          response.data.data.user.programmingHandles = JSON.parse(
            response.data.data.user.programmingHandles
          );
        }
      } catch (error) {
        console.error("Error parsing programmingHandles:", error);
        response.data.data.user.programmingHandles = {};
      }
    }

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

    // Parse programmingHandles if it's a string
    if (response.data?.data?.user?.programmingHandles) {
      try {
        if (typeof response.data.data.user.programmingHandles === "string") {
          response.data.data.user.programmingHandles = JSON.parse(
            response.data.data.user.programmingHandles
          );
        }
      } catch (error) {
        console.error("Error parsing programmingHandles:", error);
        // If parsing fails, set to empty object to avoid errors
        response.data.data.user.programmingHandles = {};
      }
    }

    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put("/users/profile", profileData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });

    // Parse programmingHandles in the response if it exists
    if (response.data?.data?.user?.programmingHandles) {
      try {
        if (typeof response.data.data.user.programmingHandles === "string") {
          response.data.data.user.programmingHandles = JSON.parse(
            response.data.data.user.programmingHandles
          );
        }
      } catch (error) {
        console.error("Error parsing programmingHandles:", error);
        response.data.data.user.programmingHandles = {};
      }
    }

    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiClient.put("/users/password", passwordData);
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
  // Get all blogs with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get("/blogs", { params });
    return response.data;
  },

  // Get a specific blog by ID
  getById: async (blogId) => {
    const response = await apiClient.get(`/blogs/${blogId}`);
    return response.data;
  },

  // Create a new blog
  create: async (blogData) => {
    const response = await apiClient.post("/blogs", blogData, {
      headers: {
        "Content-Type": "multipart/form-data", // For file uploads
      },
    });
    return response.data;
  },

  // Update an existing blog
  update: async (blogId, blogData) => {
    const response = await apiClient.put(`/blogs/${blogId}`, blogData, {
      headers: {
        "Content-Type": "multipart/form-data", // For file uploads
      },
    });
    return response.data;
  },

  // Delete a blog
  delete: async (blogId) => {
    const response = await apiClient.delete(`/blogs/${blogId}`);
    return response.data;
  },

  // Get user's blogs (drafts, published)
  getUserBlogs: async (params = {}) => {
    // Create a special endpoint to get the current user's blogs
    // This will bypass the regular status filtering rules
    const response = await apiClient.get("/blogs/my-blogs", { params });
    return response.data;
  },
};

// Event API endpoints
export const eventApi = {
  // Get all events with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get("/events", { params });
    return response.data;
  },

  // Get a specific event by ID
  getById: async (eventId) => {
    const response = await apiClient.get(`/events/${eventId}`);
    return response.data;
  },

  // Create a new event (admin only)
  create: async (eventData) => {
    const response = await apiClient.post("/events", eventData, {
      headers: {
        "Content-Type": "multipart/form-data", // For file uploads
      },
    });
    return response.data;
  },

  // Update an existing event (admin only)
  update: async (eventId, eventData) => {
    const response = await apiClient.put(`/events/${eventId}`, eventData, {
      headers: {
        "Content-Type": "multipart/form-data", // For file uploads
      },
    });
    return response.data;
  },

  // Delete an event (admin only)
  delete: async (eventId) => {
    const response = await apiClient.delete(`/events/${eventId}`);
    return response.data;
  },

  // Register for an event
  register: async (eventId) => {
    const response = await apiClient.post(`/events/${eventId}/register`);
    return response.data;
  },

  // Cancel event registration
  cancelRegistration: async (eventId) => {
    const response = await apiClient.delete(`/events/${eventId}/register`);
    return response.data;
  },
};

// Contest API endpoints
export const contestApi = {
  // Get all contests with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get("/contests", { params });
    return response.data;
  },

  // Get a specific contest by ID
  getById: async (contestId) => {
    const response = await apiClient.get(`/contests/${contestId}`);
    return response.data;
  },

  // Create a new contest (admin only)
  create: async (contestData) => {
    const response = await apiClient.post("/contests", contestData);
    return response.data;
  },

  // Update an existing contest (admin only)
  update: async (contestId, contestData) => {
    const response = await apiClient.put(`/contests/${contestId}`, contestData);
    return response.data;
  },

  // Delete a contest (admin only)
  delete: async (contestId) => {
    const response = await apiClient.delete(`/contests/${contestId}`);
    return response.data;
  },

  // Register for a contest
  register: async (contestId) => {
    const response = await apiClient.post(`/contests/${contestId}/register`);
    return response.data;
  },

  // Add contest results (admin only)
  addResults: async (contestId, resultsData) => {
    const response = await apiClient.post(
      `/contests/${contestId}/results`,
      resultsData
    );
    return response.data;
  },
};

// Resource API endpoints
export const resourceApi = {
  // Get all resources with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get("/resources", { params });
    return response.data;
  },

  // Get a specific resource by ID
  getById: async (resourceId) => {
    const response = await apiClient.get(`/resources/${resourceId}`);
    return response.data;
  },

  // Create a new resource (admin only)
  create: async (resourceData) => {
    const response = await apiClient.post("/resources", resourceData, {
      headers: {
        "Content-Type": "multipart/form-data", // For file uploads
      },
    });
    return response.data;
  },

  // Update an existing resource (admin only)
  update: async (resourceId, resourceData) => {
    const response = await apiClient.put(
      `/resources/${resourceId}`,
      resourceData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // For file uploads
        },
      }
    );
    return response.data;
  },

  // Delete a resource (admin only)
  delete: async (resourceId) => {
    const response = await apiClient.delete(`/resources/${resourceId}`);
    return response.data;
  },
};

export default apiClient;
