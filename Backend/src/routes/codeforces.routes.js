import express from "express";
import {
  getOrganizationLeaderboard,
  getUserDashboard,
  getProblemDistribution,
} from "../controllers/codeforces.controller.js";

const router = express.Router();

// Routes for Codeforces API integration
router.get("/leaderboard", getOrganizationLeaderboard);
router.get("/user/:handle", getUserDashboard);
router.get("/problems/distribution", getProblemDistribution);

export default router;
