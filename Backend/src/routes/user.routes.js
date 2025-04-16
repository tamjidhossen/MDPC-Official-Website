import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  refreshAccessToken,
  getAllUsers,
  updateUserRole,
} from "../controllers/user.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
} from "../middlewares/validators/user.validator.js";
import { upload } from "../utils/fileUpload.js";

const router = Router();

// Public routes
router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/profile", verifyJWT, getUserProfile);
router.put(
  "/profile",
  verifyJWT,
  upload.single("avatar"),
  updateProfileValidator,
  updateUserProfile
);

// Admin routes
router.get("/", verifyJWT, isAdmin, getAllUsers);
router.patch("/:userId/role", verifyJWT, isAdmin, updateUserRole);

export default router;
