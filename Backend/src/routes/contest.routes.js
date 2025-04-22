import { Router } from "express";
import {
  createContest,
  getAllContests,
  getContest,
  updateContest,
  deleteContest,
  registerForContest,
  addContestResults,
  getContestLobby,
  toggleContestJudge,
  removeParticipant,
  unregisterFromContest,
} from "../controllers/contest.controller.js";
import { upload } from "../utils/fileUpload.js";

const router = Router();

// All routes made public without authentication
router.get("/", getAllContests);
router.get("/:id", getContest);
router.post("/:id/register", registerForContest);
router.get("/:id/lobby", getContestLobby);
router.delete("/:id/register", unregisterFromContest);
router.post("/", upload.single("image"), createContest);
router.put("/:id", upload.single("image"), updateContest);
router.delete("/:id", deleteContest);
router.post("/:id/results", addContestResults);
router.patch("/:id/toggle-judge", toggleContestJudge);
router.delete("/:id/participants/:participantId", removeParticipant);

export default router;
