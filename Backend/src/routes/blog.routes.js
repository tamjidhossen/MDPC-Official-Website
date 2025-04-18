import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
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

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", idParamValidator, getBlog);

// Protected routes
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
