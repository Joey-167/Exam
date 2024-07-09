/*Handles job-related operations. */
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const { validationResult } = require('express-validator');

// Add a new job
exports.addJob = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
  const companyHR = req.user.id;

  try {
    // Create a new job
    const newJob = new Job({
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      addedBy: companyHR
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;

  try {
    // Find the job by ID
    let job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the logged-in user is the one who added the job
    if (job.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update the job details
    job.jobTitle = jobTitle || job.jobTitle;
    job.jobLocation = jobLocation || job.jobLocation;
    job.workingTime = workingTime || job.workingTime;
    job.seniorityLevel = seniorityLevel || job.seniorityLevel;
    job.jobDescription = jobDescription || job.jobDescription;
    job.technicalSkills = technicalSkills || job.technicalSkills;
    job.softSkills = softSkills || job.softSkills;

    job = await job.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    // Find the job by ID
    let job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the logged-in user is the one who added the job
    if (job.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await job.remove();
    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all jobs with their company's information
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('addedBy', 'companyName');
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all jobs for a specific company
exports.getJobsByCompany = async (req, res) => {
  try {
    const jobs = await Job.find({ addedBy: req.params.companyId }).populate('addedBy', 'companyName');
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all jobs that match specific filters
exports.getJobsByFilters = async (req, res) => {
  const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

  try {
    const filters = {};

    if (workingTime) filters.workingTime = workingTime;
    if (jobLocation) filters.jobLocation = jobLocation;
    if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
    if (jobTitle) filters.jobTitle = jobTitle;
    if (technicalSkills) filters.technicalSkills = { $in: technicalSkills.split(',') };

    const jobs = await Job.find(filters).populate('addedBy', 'companyName');
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Apply to a job
exports.applyToJob = async (req, res) => {
  const { jobId, userTechSkills, userSoftSkills } = req.body;

  try {
    // Check if the job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Create a new application
    const newApplication = new Application({
      jobId,
      userId: req.user.id,
      userTechSkills,
      userSoftSkills,
    });

    const application = await newApplication.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
