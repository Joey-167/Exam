/*Mongoose schema for Job collection*/
const mongoose = require('mongoose');

// Define Job schema
const JobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true
  },
  jobLocation: {
    type: String,
    enum: ['onsite', 'remotely', 'hybrid'],
    required: true
  },
  workingTime: {
    type: String,
    enum: ['part-time', 'full-time'],
    required: true
  },
  seniorityLevel: {
    type: String,
    enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  technicalSkills: {
    type: [String],
    required: true
  },
  softSkills: {
    type: [String],
    required: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Job model
const Job = mongoose.model('Job', JobSchema);

module.exports = Job;

//Static method to find jobs by location and seniority level
JobSchema.statics.findByLocationAndSeniority = async function(location, seniority) {
  return this.find({ jobLocation: location, seniorityLevel: seniority }).populate('addedBy', 'firstName lastName');
};