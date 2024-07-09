/*Mongoose schema for Company collection. */
const mongoose = require('mongoose');

// Define Company schema
const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  numberOfEmployees: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501+'],
    required: true
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true
  },
  companyHR: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Company model
const Company = mongoose.model('Company', CompanySchema);

module.exports = Company;
