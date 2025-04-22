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

// All endpoints are public - no authentication required
router.get("/submissions", getUserSubmissions);
router.get("/submissions/:id", getSubmissionById);
router.get("/contests/:contestId/standings", getContestStandings);
router.get("/contests/:contestId/problems", getProblemsByContest);
router.post("/submit", submitCode);

export default router;
