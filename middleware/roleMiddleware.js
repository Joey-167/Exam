/*Authorization middleware based on user roles */
const User = require('../models/User');

// Middleware to authorize users based on their role
const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get the user ID from the request object (set by authentication middleware)
      const userId = req.user.id;

      // Fetch the user from the database
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      // Check if the user's role is in the allowed roles
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ msg: 'User role not authorized' });
      }

      // Proceed to the next middleware
      next();
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
};

module.exports = {
  authorizeRoles
};
