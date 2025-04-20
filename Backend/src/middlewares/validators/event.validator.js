import { body, param, validationResult } from "express-validator";

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

// Create event validation rules
export const createEventValidator = [
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


  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),

  body("registrationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Registration deadline must be a valid date format")
    .custom((value, { req }) => {
      if (new Date(value) >= new Date(req.body.startDate)) {
        throw new Error("Registration deadline must be before start date");
      }
      return true;
    }),

  validate,
];

// Update event validation rules
export const updateEventValidator = [
  param("id").isMongoId().withMessage("Invalid event ID format"),

  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .trim(),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string"),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),

  body("registrationDeadline")
    .optional()
    .isISO8601()
    .withMessage("Registration deadline must be a valid date format"),

  validate,
];

// ID param validation
export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  validate,
];
