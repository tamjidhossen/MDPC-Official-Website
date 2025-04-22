import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";

// Import error handler
import { errorHandler } from "./middlewares/error.middleware.js";

// Import routes
import userRoutes from "./routes/user.routes.js";
import memberRoutes from "./routes/member.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import eventRoutes from "./routes/event.routes.js";
import contestRoutes from "./routes/contest.routes.js";
import resourceRoutes from "./routes/resource.routes.js";
import codeforcesRoutes from "./routes/codeforces.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import judgeRoutes from "./routes/judge.routes.js";

const app = express();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow loading images from different origins
  })
); // Set security headers
app.use(morgan("dev")); // Logging

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    exposedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON and URL-encoded data with built-in Express 5 security
// The "extended: true" option allows for rich objects and arrays to be encoded,
// and includes security features that sanitize user input to prevent XSS attacks
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Cookie parser
app.use(cookieParser());

// Serve static files
app.use(express.static("public"));

// API routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/contests", contestRoutes);
app.use("/api/v1/resources", resourceRoutes);
app.use("/api/v1/codeforces", codeforcesRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/judge", judgeRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

// 404 route handler
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler middleware
app.use(errorHandler);

export { app };
