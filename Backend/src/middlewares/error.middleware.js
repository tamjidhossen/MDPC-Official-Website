import { ApiError } from "../utils/ApiError.js";

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err);

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Handle common errors

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    const validationErrors = Object.values(err.errors).map(
      (error) => error.message
    );
    message = "Validation failed";
    errors = validationErrors;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate ${Object.keys(err.keyValue)[0]} entered`;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Send error response
  res.status(statusCode).json({
    status: "error",
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export { errorHandler };
