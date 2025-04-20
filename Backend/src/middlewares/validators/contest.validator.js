import { body, param, validationResult } from "express-validator";
import { ContestTypes } from "../../constants.js";
import { Contest } from "../../models/contest.model.js";

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

// Create contest validation rules
export const createContestValidator = [
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

  body("contestType")
    .notEmpty()
    .withMessage("Contest type is required")
    .isIn(Object.values(ContestTypes))
    .withMessage(
      `Contest type must be one of: ${Object.values(ContestTypes).join(", ")}`
    ),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date format"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer")
    .withMessage("Duration in minutes is required"),

  body("platform")
    .notEmpty()
    .withMessage("Platform is required")
    .isString()
    .withMessage("Platform must be a string"),

  body("contestUrl")
    .optional()
    .isURL()
    .withMessage("Contest URL must be a valid URL"),

  body("maxTeamSize")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Maximum team size must be a positive integer"),

  validate,
];

// Update contest validation rules
export const updateContestValidator = [
  param("id").isMongoId().withMessage("Invalid contest ID format"),

  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .trim(),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("contestType")
    .optional()
    .isIn(Object.values(ContestTypes))
    .withMessage(
      `Contest type must be one of: ${Object.values(ContestTypes).join(", ")}`
    ),

  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date format"),

  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),

  body("platform")
    .optional()
    .isString()
    .withMessage("Platform must be a string"),

  body("contestUrl")
    .optional()
    .isURL()
    .withMessage("Contest URL must be a valid URL"),

  body("maxTeamSize")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Maximum team size must be a positive integer"),

  validate,
];

// Contest registration validation - first validate basic params, then check contest type separately
export const contestRegistrationValidator = [
  param("id").isMongoId().withMessage("Invalid contest ID format"),

  // Team fields are optional during initial validation
  body("teamName")
    .optional()
    .isString()
    .withMessage("Team name must be a string"),

  body("teamMembers")
    .optional()
    .isArray()
    .withMessage("Team members must be an array"),

  body("teamMembers.*")
    .optional()
    .isMongoId()
    .withMessage("Team member IDs must be valid user IDs"),

  // Do the main validation after contest type is known
  validate,

  // Add a middleware to validate based on contest type
  async (req, res, next) => {
    try {
      const contestId = req.params.id;

      // Find contest to check its type
      const contest = await Contest.findById(contestId);

      if (!contest) {
        return res.status(404).json({
          status: "fail",
          message: "Contest not found",
        });
      }

      // If it's a team contest, validate team information
      if (contest.contestType === ContestTypes.TEAM) {
        if (!req.body.teamName) {
          return res.status(400).json({
            status: "fail",
            message: "Validation failed",
            errors: [
              {
                field: "teamName",
                message: "Team name is required for team contests",
              },
            ],
          });
        }

        if (!req.body.teamMembers || !req.body.teamMembers.length) {
          return res.status(400).json({
            status: "fail",
            message: "Validation failed",
            errors: [
              {
                field: "teamMembers",
                message: "Team members are required for team contests",
              },
            ],
          });
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  },
];

// Contest results validation
export const contestResultsValidator = [
  param("id").isMongoId().withMessage("Invalid contest ID format"),

  body("results")
    .isArray()
    .withMessage("Results must be an array")
    .notEmpty()
    .withMessage("Results cannot be empty"),

  body("results.*.rank")
    .isInt({ min: 1 })
    .withMessage("Rank must be a positive integer"),

  body("results.*.participantId")
    .isMongoId()
    .withMessage("Participant ID must be a valid user/team ID"),

  body("results.*.score")
    .optional()
    .isNumeric()
    .withMessage("Score must be a number"),

  validate,
];

// ID param validation
export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid ID format"),

  validate,
];
