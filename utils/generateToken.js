// Utility to generate JWT tokens
const jwt = require('jsonwebtoken');

// Function to generate JWT
const generateToken = (userId, role) => {
  // Define the payload of the token
  const payload = {
    id: userId,
    role: role
  };

  // Define the options for the token
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d' // Token expiry time, default is 1 day
  };

  // Sign the token with the secret key
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  return token;
};

// Function to verify JWT
const verifyToken = (token) => {
  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    // If token verification fails, throw an error
    throw new Error('Invalid Token');
  }
};

module.exports = {
  generateToken,
  verifyToken
};
