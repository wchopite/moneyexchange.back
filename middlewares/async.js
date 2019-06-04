/**
 * Wrapper for route handler
 * Manage async-await errors
 */
module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch(error) {
      next(error);
    }
  }
};
