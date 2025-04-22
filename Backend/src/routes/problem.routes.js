import { Router } from "express";
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} from "../controllers/problem.controller.js";

const router = Router();

// Make all routes public without authentication
router.post("/", createProblem);
router.get("/", getAllProblems);
router.put("/:id", updateProblem);
router.delete("/:id", deleteProblem);
router.get("/:id", getProblemById);

export default router;
