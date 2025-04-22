import { Router } from "express";
import {
  submitCode,
  getUserSubmissions,
  getSubmissionById,
  getContestStandings,
  getProblemsByContest,
} from "../controllers/judge.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes that don't require authentication
router.get("/submissions", getUserSubmissions); // Removed verifyJWT middleware
router.get("/submissions/:id", getSubmissionById);
router.get("/contests/:contestId/standings", getContestStandings);
router.get("/contests/:contestId/problems", getProblemsByContest);
router.post("/submit", submitCode);

export default router;
