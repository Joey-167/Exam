/*Error handling middleware */
const { ValidationError } = require('express-validation');

// Custom error handling middleware
const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // If the error is a ValidationError, handle it accordingly
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  // Handle other known errors with specific messages
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ msg: 'Invalid token' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ msg: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    return res.status(400).json({ msg: 'Duplicate field value entered' });
  }

  // Default to 500 server error
  res.status(500).json({
    msg: 'Server error'
  });
};

// Not found middleware for handling 404 errors
const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({ msg: 'Resource not found' });
};

module.exports = {
  errorMiddleware,
  notFoundMiddleware
};
