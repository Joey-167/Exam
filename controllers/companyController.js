/*Handles company-related operations. */
const Company = require('../models/Company');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Add a new company
exports.addCompany = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;

  try {
    // Check if company already exists
    let company = await Company.findOne({ companyEmail });
    if (company) {
      return res.status(400).json({ msg: 'Company already exists' });
    }

    // Create new company
    company = new Company({
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR: req.user.id, // Associate the logged-in user as the company HR
    });

    // Save company to the database
    await company.save();
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update company data
exports.updateCompany = async (req, res) => {
  // Validate request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { description, industry, address, numberOfEmployees } = req.body;

  try {
    // Find the company by ID
    let company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    // Check if the logged-in user is the HR of the company
    if (company.companyHR.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update company details
    if (description) company.description = description;
    if (industry) company.industry = industry;
    if (address) company.address = address;
    if (numberOfEmployees) company.numberOfEmployees = numberOfEmployees;

    await company.save();
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a company
exports.deleteCompany = async (req, res) => {
  try {
    // Find the company by ID
    let company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    // Check if the logged-in user is the HR of the company
    if (company.companyHR.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await company.remove();
    res.json({ msg: 'Company removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get company data by ID
exports.getCompanyData = async (req, res) => {
  try {
    // Find the company by ID
    const company = await Company.findById(req.params.companyId).populate('companyHR', '-password');
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Search for a company by name
exports.searchCompanyByName = async (req, res) => {
  try {
    // Find companies that match the name query
    const companies = await Company.find({ companyName: { $regex: req.query.name, $options: 'i' } });
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all applications for a specific company's jobs
exports.getCompanyApplications = async (req, res) => {
  try {
    // Find the company by ID
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    // Check if the logged-in user is the HR of the company
    if (company.companyHR.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Populate applications for the company's jobs
    const applications = await Application.find({ companyId: req.params.companyId }).populate('userId', '-password');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const ExcelJS = require('exceljs'); // Assuming you use ExcelJS for creating Excel files

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('companyHR', '-password');
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all jobs for a specific company
exports.getCompanyJobs = async (req, res) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }
    const jobs = await Job.find({ companyHR: req.params.companyId });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create an Excel sheet of applications for a specific company on a specific day
exports.createApplicationsExcel = async (req, res) => {
  try {
    const { companyId, date } = req.params;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    // Check if the logged-in user is the HR of the company
    if (company.companyHR.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Find applications for the company's jobs on the specified date
    const applications = await Application.find({
      companyId: companyId,
      createdAt: { $gte: new Date(date).setHours(0, 0, 0, 0), $lt: new Date(date).setHours(23, 59, 59, 999) }
    }).populate('userId', '-password');

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Add column headers
    worksheet.columns = [
      { header: 'Job ID', key: 'jobId', width: 25 },
      { header: 'User ID', key: 'userId', width: 25 },
      { header: 'User Technical Skills', key: 'userTechSkills', width: 50 },
      { header: 'User Soft Skills', key: 'userSoftSkills', width: 50 },
      { header: 'Application Date', key: 'createdAt', width: 25 },
    ];

    // Add application data
    applications.forEach(application => {
      worksheet.addRow({
        jobId: application.jobId,
        userId: application.userId._id,
        userTechSkills: application.userTechSkills.join(', '),
        userSoftSkills: application.userSoftSkills.join(', '),
        createdAt: application.createdAt,
      });
    });

    // Write the Excel file to the response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=applications.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
