import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
  getMyBlogs,
  getAllApprovedBlogs,
} from "../controllers/blog.controller.js";
import {
  verifyJWT,
  isAdmin,
  isActive,
} from "../middlewares/auth.middleware.js";
import { upload } from "../utils/fileUpload.js";
import {
  createBlogValidator,
  updateBlogValidator,
  blogStatusValidator,
  idParamValidator,
} from "../middlewares/validators/blog.validator.js";

const router = Router();

// public routes
router.get("/all-approved", getAllApprovedBlogs);

// Admin routes
router.get("/", verifyJWT, getAllBlogs);

// Protected routes for current user - this must come before /:id
router.get("/my-blogs", verifyJWT, getMyBlogs);

// Get blog by ID route - must be after any specific routes with string paths
router.get("/:id", idParamValidator, getBlog);

// Other protected routes
router.post(
  "/",
  verifyJWT,
  upload.single("image"),
  createBlogValidator,
  createBlog
);
router.put(
  "/:id",
  verifyJWT,
  upload.single("image"),
  updateBlogValidator,
  updateBlog
);
router.delete("/:id", verifyJWT, idParamValidator, deleteBlog);

// Admin routes
router.patch(
  "/:id/status",
  verifyJWT,
  isAdmin,
  blogStatusValidator,
  updateBlogStatus
);

export default router;
