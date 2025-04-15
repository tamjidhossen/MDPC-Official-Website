import { body, param, validationResult } from "express-validator";

// Middleware to validate results
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

// Register validation rules
export const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("programmingHandles.codeforces")
    .optional()
    .isString()
    .withMessage("Codeforces handle must be a string"),

  validate,
];

// Login validation rules
export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  validate,
];

// Update profile validation rules
export const updateProfileValidator = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .trim(),

  body("programmingHandles.codeforces")
    .optional()
    .isString()
    .withMessage("Codeforces handle must be a string"),

  validate,
];

// Change password validation
export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  validate,
];

// Update user status validation rules
export const updateStatusValidator = [
  param("id").isMongoId().withMessage("Invalid user ID format"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "active", "inactive"])
    .withMessage("Status must be pending, active, or inactive"),

  validate,
];
