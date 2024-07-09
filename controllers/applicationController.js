/*Handles job applications*/
const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// Get all applications for a specific job
exports.getApplicationsForJob = async (req, res) => {
  try {
    // Find all applications for the provided job ID
    const applications = await Application.find({ jobId: req.params.jobId }).populate('userId', 'firstName lastName email');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all applications for a specific user
exports.getApplicationsForUser = async (req, res) => {
  try {
    // Find all applications submitted by the provided user ID
    const applications = await Application.find({ userId: req.params.userId }).populate('jobId', 'jobTitle jobLocation');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all applications for jobs of a specific company
exports.getApplicationsForCompany = async (req, res) => {
  try {
    // Find all jobs added by the company HR
    const jobs = await Job.find({ addedBy: req.user.id });

    // Extract job IDs from the jobs found
    const jobIds = jobs.map(job => job._id);

    // Find all applications for the company's jobs
    const applications = await Application.find({ jobId: { $in: jobIds } }).populate('userId', 'firstName lastName email');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete an application
exports.deleteApplication = async (req, res) => {
  try {
    // Find the application by ID
    let application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }

    // Check if the logged-in user is the one who submitted the application or the company HR who posted the job
    const job = await Job.findById(application.jobId);
    if (application.userId.toString() !== req.user.id && job.addedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await application.remove();
    res.json({ msg: 'Application removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get application details by application ID
exports.getApplicationDetails = async (req, res) => {
  try {
    // Find the application by ID
    const application = await Application.findById(req.params.applicationId).populate('userId', 'firstName lastName email').populate('jobId', 'jobTitle jobLocation');
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create an Excel sheet with applications for a specific company on a specific day
exports.createApplicationsExcel = async (req, res) => {
  const { date } = req.params;
  try {
    // Find all jobs added by the company HR
    const jobs = await Job.find({ addedBy: req.user.id });

    // Extract job IDs from the jobs found
    const jobIds = jobs.map(job => job._id);

    // Find all applications for the company's jobs on the specified date
    const applications = await Application.find({ jobId: { $in: jobIds }, createdAt: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) } }).populate('userId', 'firstName lastName email').populate('jobId', 'jobTitle jobLocation');

    // Create and send the Excel sheet (assuming you have a utility function to generate Excel sheets)
    const excelBuffer = generateExcelSheet(applications);
    res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');
    res.send(excelBuffer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Utility function to generate Excel sheet (dummy implementation)
const generateExcelSheet = (applications) => {
  // Dummy function to create Excel sheet
  // Use libraries like exceljs to implement actual Excel generation
  return Buffer.from('Excel data');
};
