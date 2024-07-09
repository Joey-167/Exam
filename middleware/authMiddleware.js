/*Authentication middleware for protected routes */
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

// Middleware to authenticate a user using JWT
exports.authenticateUser = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // Attach user to request object
    req.user = decoded.user;

    // Proceed to next middleware
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to authorize a user by role
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'User role not authorized' });
    }
    next();
  };
};

// Middleware to ensure the user is the owner of the account they are trying to access
exports.ensureAccountOwnership = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Middleware to ensure the user is the owner of the company they are trying to access
exports.ensureCompanyOwnership = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.companyId);

    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    if (company.companyHR.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Middleware to ensure the user is the owner of the job they are trying to access
exports.ensureJobOwnership = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    if (job.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
