import { Router } from "express";
import {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelEventRegistration,
} from "../controllers/event.controller.js";
import {
  verifyJWT,
  isAdmin,
  isActive,
} from "../middlewares/auth.middleware.js";
import { upload } from "../utils/fileUpload.js";
import {
  createEventValidator,
  updateEventValidator,
  idParamValidator,
} from "../middlewares/validators/event.validator.js";

const router = Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", idParamValidator, getEvent);

// Protected routes
router.post(
  "/:id/register",
  verifyJWT,
  isActive,
  idParamValidator,
  registerForEvent
);
router.delete(
  "/:id/register",
  verifyJWT,
  isActive,
  idParamValidator,
  cancelEventRegistration
);

// Admin routes
router.post(
  "/",
  verifyJWT,
  isAdmin,
  upload.single("image"),
  createEventValidator,
  createEvent
);
router.put(
  "/:id",
  verifyJWT,
  isAdmin,
  upload.single("image"),
  updateEventValidator,
  updateEvent
);
router.delete("/:id", verifyJWT, isAdmin, idParamValidator, deleteEvent);

export default router;
