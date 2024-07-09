/*JOI validation schemas for request payloads*/
const Joi = require('joi');

// User Schema for Sign Up
const userSignUpSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required',
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Last name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
  recoveryEmail: Joi.string().email().optional().messages({
    'string.email': 'Recovery email must be a valid email',
  }),
  DOB: Joi.date().iso().required().messages({
    'date.base': 'Date of birth must be a valid date',
    'any.required': 'Date of birth is required',
  }),
  mobileNumber: Joi.string().regex(/^[0-9]{10}$/).required().messages({
    'string.empty': 'Mobile number is required',
    'string.pattern.base': 'Mobile number must be a valid 10-digit number',
  }),
  role: Joi.string().valid('User', 'Company_HR').required().messages({
    'any.only': 'Role must be either User or Company_HR',
  }),
});

// User Schema for Sign In
const userSignInSchema = Joi.object({
  emailOrMobile: Joi.alternatives().try(
    Joi.string().email(),
    Joi.string().regex(/^[0-9]{10}$/)
  ).required().messages({
    'any.required': 'Email or mobile number is required',
    'string.email': 'Must be a valid email',
    'string.pattern.base': 'Must be a valid 10-digit mobile number',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

// User Schema for Updating Account
const userUpdateSchema = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email must be a valid email',
  }),
  mobileNumber: Joi.string().regex(/^[0-9]{10}$/).optional().messages({
    'string.pattern.base': 'Mobile number must be a valid 10-digit number',
  }),
  recoveryEmail: Joi.string().email().optional().messages({
    'string.email': 'Recovery email must be a valid email',
  }),
  DOB: Joi.date().iso().optional().messages({
    'date.base': 'Date of birth must be a valid date',
  }),
});

// Company Schema for Adding Company
const companySchema = Joi.object({
  companyName: Joi.string().required().messages({
    'string.empty': 'Company name is required',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required',
  }),
  industry: Joi.string().required().messages({
    'string.empty': 'Industry is required',
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Address is required',
  }),
  numberOfEmployees: Joi.string().regex(/^\d+-\d+$/).required().messages({
    'string.empty': 'Number of employees is required',
    'string.pattern.base': 'Number of employees must be in the format "min-max"',
  }),
  companyEmail: Joi.string().email().required().messages({
    'string.empty': 'Company email is required',
    'string.email': 'Company email must be a valid email',
  }),
  companyHR: Joi.string().required().messages({
    'string.empty': 'Company HR ID is required',
  }),
});

// Job Schema for Adding Job
const jobSchema = Joi.object({
  jobTitle: Joi.string().required().messages({
    'string.empty': 'Job title is required',
  }),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').required().messages({
    'any.only': 'Job location must be either onsite, remotely, or hybrid',
  }),
  workingTime: Joi.string().valid('part-time', 'full-time').required().messages({
    'any.only': 'Working time must be either part-time or full-time',
  }),
  seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required().messages({
    'any.only': 'Seniority level must be one of Junior, Mid-Level, Senior, Team-Lead, CTO',
  }),
  jobDescription: Joi.string().required().messages({
    'string.empty': 'Job description is required',
  }),
  technicalSkills: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Technical skills must be an array of strings',
  }),
  softSkills: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Soft skills must be an array of strings',
  }),
  addedBy: Joi.string().required().messages({
    'string.empty': 'Added by (Company HR ID) is required',
  }),
});

// Application Schema for Applying to Job
const applicationSchema = Joi.object({
  jobId: Joi.string().required().messages({
    'string.empty': 'Job ID is required',
  }),
  userId: Joi.string().required().messages({
    'string.empty': 'User ID is required',
  }),
  userTechSkills: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'User technical skills must be an array of strings',
  }),
  userSoftSkills: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'User soft skills must be an array of strings',
  }),
});

module.exports = {
  userSignUpSchema,
  userSignInSchema,
  userUpdateSchema,
  companySchema,
  jobSchema,
  applicationSchema,
};

const Joi = require('joi');

const jobFilterSchema = Joi.object({
  workingTime: Joi.string().valid('part-time', 'full-time').optional(),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').optional(),
  seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').optional(),
  jobTitle: Joi.string().optional(),
  technicalSkills: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
  jobSchema,
  jobFilterSchema,
};

