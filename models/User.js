/*Mongoose schema for User collection. */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  recoveryEmail: {
    type: String
  },
  DOB: {
    type: Date,
    required: true
  },
  mobileNumber: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    enum: ['User', 'Company_HR'],
    default: 'User'
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving to database
UserSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// Create method to verify password
UserSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// Create User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
