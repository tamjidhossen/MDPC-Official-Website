export const DB_NAME = "MDPCDB";

// User roles
export const UserRoles = {
  ADMIN: "admin",
  USER: "user",
};

// User status
export const UserStatus = {
  PENDING: "pending",
  ACTIVE: "active",
  INACTIVE: "inactive",
};

// Content status
export const ContentStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

// Contest types
export const ContestTypes = {
  INDIVIDUAL: "individual",
  TEAM: "team",
};

// Event types
export const EventTypes = {
  WORKSHOP: "workshop",
  SEMINAR: "seminar",
  COMPETITION: "competition",
  OTHER: "other",
};

// Resource categories
export const ResourceCategories = {
  ALGORITHM: "algorithm",
  DATA_STRUCTURE: "data_structure",
  MATH: "math",
  PROGRAMMING_LANGUAGE: "programming_language",
  COMPETITIVE_PROGRAMMING: "competitive_programming",
  MISCELLANEOUS: "miscellaneous",
};

// Resource levels
export const ResourceLevels = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
};

// Cookie options
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};
