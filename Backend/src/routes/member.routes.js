// filepath: /home/tamjid/Codes/Projects/Mid Day Website/MDPC-Official-Website-Backend/Backend/src/routes/member.routes.js
import { Router } from "express";
import {
  applyForMembership,
  getAllMembers,
  getMember,
  updateMemberStatus,
  deleteMember,
} from "../controllers/member.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/fileUpload.js";
import {
  applyMembershipValidator,
  updateMemberStatusValidator,
  idParamValidator,
} from "../middlewares/validators/member.validator.js";

const router = Router();

// Public routes
router.post(
  "/apply",
  upload.single("photo"),
  applyMembershipValidator,
  applyForMembership
);

// Admin routes
router.get("/", verifyJWT, isAdmin, getAllMembers);
router.get("/:id", verifyJWT, isAdmin, idParamValidator, getMember);
router.patch(
  "/:id/status",
  verifyJWT,
  isAdmin,
  updateMemberStatusValidator,
  updateMemberStatus
);
router.delete("/:id", verifyJWT, isAdmin, idParamValidator, deleteMember);

export default router;
