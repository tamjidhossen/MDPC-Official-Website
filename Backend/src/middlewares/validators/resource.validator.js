import { body, param, validationResult } from "express-validator";
import { ResourceLevels } from "../../constants.js";

// Reuse validate middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }
  next();
};

// Create resource validation rules
export const createResourceValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .trim(),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string")
    .trim(),

  body("level")
    .notEmpty()
    .withMessage("Level is required")
    .isIn(Object.values(ResourceLevels).map((level) => level.toLowerCase()))
    .withMessage(
      `Level must be one of: ${Object.values(ResourceLevels)
        .map((level) => level.toLowerCase())
        .join(", ")}`
    ),

  body("externalLinks")
    .optional()
    .custom((value) => {
      try {
        const links = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(links)) {
          throw new Error("External links must be an array");
        }
        links.forEach((link) => {
          if (typeof link !== "object" || !link.title || !link.url) {
            throw new Error("Each external link must have a title and url");
          }
          if (typeof link.title !== "string" || typeof link.url !== "string") {
            throw new Error("External link title and url must be strings");
          }
          try {
            new URL(link.url);
          } catch (_) {
            throw new Error(`Invalid URL format for link: ${link.title}`);
          }
        });
        return true;
      } catch (e) {
        throw new Error(e.message || "Invalid format for externalLinks");
      }
    }),

  body("tags")
    .optional()
    .custom((value) => {
      try {
        const tags = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(tags)) {
          throw new Error("Tags must be an array");
        }
        tags.forEach((tag) => {
          if (typeof tag !== "string") {
            throw new Error("Each tag must be a string");
          }
        });
        return true;
      } catch (e) {
        throw new Error(e.message || "Invalid format for tags");
      }
    }),

  validate,
];

// Update resource validation rules
export const updateResourceValidator = [
  param("id").isMongoId().withMessage("Invalid resource ID format"),

  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .trim(),

  body("content").optional().isString().withMessage("Content must be a string"),

  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string")
    .trim(),

  body("level")
    .optional()
    .isIn(Object.values(ResourceLevels).map((level) => level.toLowerCase()))
    .withMessage(
      `Level must be one of: ${Object.values(ResourceLevels)
        .map((level) => level.toLowerCase())
        .join(", ")}`
    ),

  body("externalLinks")
    .optional()
    .custom((value) => {
      try {
        const links = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(links)) {
          throw new Error("External links must be an array");
        }
        links.forEach((link) => {
          if (typeof link !== "object" || !link.title || !link.url) {
            throw new Error("Each external link must have a title and url");
          }
          if (typeof link.title !== "string" || typeof link.url !== "string") {
            throw new Error("External link title and url must be strings");
          }
          try {
            new URL(link.url);
          } catch (_) {
            throw new Error(`Invalid URL format for link: ${link.title}`);
          }
        });
        return true;
      } catch (e) {
        throw new Error(e.message || "Invalid format for externalLinks");
      }
    }),

  body("tags")
    .optional()
    .custom((value) => {
      try {
        const tags = typeof value === "string" ? JSON.parse(value) : value;
        if (!Array.isArray(tags)) {
          throw new Error("Tags must be an array");
        }
        tags.forEach((tag) => {
          if (typeof tag !== "string") {
            throw new Error("Each tag must be a string");
          }
        });
        return true;
      } catch (e) {
        throw new Error(e.message || "Invalid format for tags");
      }
    }),

  validate,
];

// ID param validation
export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  validate,
];
