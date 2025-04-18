import { body, param, validationResult } from "express-validator";
import { ContentStatus } from "../../constants.js";

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

// Create blog validation rules
export const createBlogValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters")
    .trim(),

  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string")
    .trim(),

  validate,
];

// Update blog validation rules
export const updateBlogValidator = [
  param("id").isMongoId().withMessage("Invalid blog ID format"),

  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters")
    .trim(),

  body("content")
    .optional()
    .isString()
    .withMessage("Content must be a string")
    .isLength({ min: 50 })
    .withMessage("Content must be at least 50 characters"),


  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string")
    .trim(),

  validate,
];

// Blog status validation rules
export const blogStatusValidator = [
  param("id").isMongoId().withMessage("Invalid blog ID format"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(Object.values(ContentStatus))
    .withMessage(
      `Status must be one of: ${Object.values(ContentStatus).join(", ")}`
    ),

  validate,
];

// ID param validation
export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  validate,
];
