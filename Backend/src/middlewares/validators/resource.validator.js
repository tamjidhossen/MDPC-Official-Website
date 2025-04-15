import { body, param, validationResult } from "express-validator";
import { ResourceCategories, ResourceLevels } from "../../constants.js";

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

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(Object.values(ResourceCategories))
    .withMessage(
      `Category must be one of: ${Object.values(ResourceCategories).join(", ")}`
    ),

  body("level")
    .notEmpty()
    .withMessage("Level is required")
    .isIn(Object.values(ResourceLevels))
    .withMessage(
      `Level must be one of: ${Object.values(ResourceLevels).join(", ")}`
    ),

  body("resourceUrl")
    .optional()
    .isURL()
    .withMessage("Resource URL must be a valid URL"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string")
    .trim(),

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

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("category")
    .optional()
    .isIn(Object.values(ResourceCategories))
    .withMessage(
      `Category must be one of: ${Object.values(ResourceCategories).join(", ")}`
    ),

  body("level")
    .optional()
    .isIn(Object.values(ResourceLevels))
    .withMessage(
      `Level must be one of: ${Object.values(ResourceLevels).join(", ")}`
    ),

  body("resourceUrl")
    .optional()
    .isURL()
    .withMessage("Resource URL must be a valid URL"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string")
    .trim(),

  validate,
];

// ID param validation
export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  validate,
];
