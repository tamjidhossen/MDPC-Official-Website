import { Router } from "express";
import {
  createContest,
  getAllContests,
  getContest,
  updateContest,
  deleteContest,
  registerForContest,
  addContestResults,
} from "../controllers/contest.controller.js";
import {
  verifyJWT,
  isAdmin,
  isActive,
} from "../middlewares/auth.middleware.js";
import { upload } from "../utils/fileUpload.js";
import {
  createContestValidator,
  updateContestValidator,
  contestRegistrationValidator,
  contestResultsValidator,
  idParamValidator,
} from "../middlewares/validators/contest.validator.js";

const router = Router();

// Public routes
router.get("/", getAllContests);
router.get("/:id", idParamValidator, getContest);

// Protected routes
router.post(
  "/:id/register",
  verifyJWT,
  isActive,
  contestRegistrationValidator,
  registerForContest
);

// Admin routes
router.post(
  "/",
  verifyJWT,
  isAdmin,
  upload.single("image"),
  createContestValidator,
  createContest
);
router.put(
  "/:id",
  verifyJWT,
  isAdmin,
  upload.single("image"),
  updateContestValidator,
  updateContest
);
router.delete("/:id", verifyJWT, isAdmin, idParamValidator, deleteContest);
router.post(
  "/:id/results",
  verifyJWT,
  isAdmin,
  contestResultsValidator,
  addContestResults
);

export default router;
