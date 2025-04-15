/**
 * Wraps controller functions to handle async errors consistently
 * @param {Function} requestHandler - The controller function to wrap
 * @returns {Function} - Express middleware function that handles errors
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
