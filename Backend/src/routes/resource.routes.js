import { Router } from "express";
import {
  createResource,
  getAllResources,
  getResource,
  updateResource,
  deleteResource,
} from "../controllers/resource.controller.js";
import {
  verifyJWT,
  isAdmin,
  isActive,
} from "../middlewares/auth.middleware.js";
import { upload } from "../utils/fileUpload.js";
import {
  createResourceValidator,
  updateResourceValidator,
  idParamValidator,
} from "../middlewares/validators/resource.validator.js";

const router = Router();

// Public routes
router.get("/", getAllResources);
router.get("/:id", idParamValidator, getResource);

// Admin routes
router.post(
  "/",
  verifyJWT,
  isAdmin,
  upload.single("file"),
  createResourceValidator,
  createResource
);
router.put(
  "/:id",
  verifyJWT,
  isAdmin,
  upload.single("file"),
  updateResourceValidator,
  updateResource
);
router.delete("/:id", verifyJWT, isAdmin, idParamValidator, deleteResource);

export default router;
