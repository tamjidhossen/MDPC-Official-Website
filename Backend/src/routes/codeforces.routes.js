import express from "express";
import {
  getOrganizationLeaderboard,
  getUserDashboard,
  getProblemDistribution,
  getContestList,
} from "../controllers/codeforces.controller.js";

const router = express.Router();

// Routes for Codeforces API integration
router.get("/leaderboard", getOrganizationLeaderboard);
router.get("/user/:handle", getUserDashboard);
router.get("/problems/distribution", getProblemDistribution);
router.get("/contests", getContestList);

export default router;
