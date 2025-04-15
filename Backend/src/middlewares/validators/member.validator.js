// filepath: /home/tamjid/Codes/Projects/Mid Day Website/MDPC-Official-Website-Backend/Backend/src/middlewares/validators/member.validator.js
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

// Membership application validation rules
export const applyMembershipValidator = [
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

  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isString()
    .withMessage("Phone number must be a string"),

  body("session")
    .notEmpty()
    .withMessage("Session is required")
    .isString()
    .withMessage("Session must be a string"),

  body("roll")
    .notEmpty()
    .withMessage("Roll number/Student ID is required")
    .isString()
    .withMessage("Roll number must be a string"),

  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .isString()
    .withMessage("Department must be a string"),

  body("programmingHandles.codeforces")
    .optional()
    .isString()
    .withMessage("Codeforces handle must be a string"),

  body("programmingHandles.vjudge")
    .optional()
    .isString()
    .withMessage("Vjudge handle must be a string"),

  validate,
];

// Update member status validation
export const updateMemberStatusValidator = [
  param("id").isMongoId().withMessage("Invalid member ID format"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "active", "inactive"])
    .withMessage("Status must be pending, active, or inactive"),

  validate,
];

// ID param validation
export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  validate,
];
