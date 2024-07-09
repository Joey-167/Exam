/*Mongoose schema for Application collection */
const mongoose = require('mongoose');

// Define Application schema
const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userTechSkills: {
    type: [String],
    required: true
  },
  userSoftSkills: {
    type: [String],
    required: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

// Create Application model
const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;
