// middleware/role.js

/**
 * Middleware to restrict access based on user roles.
 * @param {string|string[]} roles - The role or roles that are allowed access.
 */
module.exports = function (roles = []) {
  // Convert single role to an array
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // req.user is set in the auth middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
    }
    next();
  };
};
