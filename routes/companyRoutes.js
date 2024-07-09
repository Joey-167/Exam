/*Routes for company operations */
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { companySchema } = require('../utils/validationSchemas');

// Middleware to validate request data against a schema
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

// Route to add a new company
router.post('/add', authMiddleware, roleMiddleware('Company_HR'), validateRequest(companySchema), companyController.addCompany);

// Route to update an existing company
router.put('/update/:companyId', authMiddleware, roleMiddleware('Company_HR'), validateRequest(companySchema), companyController.updateCompany);

// Route to delete a company
router.delete('/delete/:companyId', authMiddleware, roleMiddleware('Company_HR'), companyController.deleteCompany);

// Route to get a specific company's data
router.get('/:companyId', authMiddleware, roleMiddleware(['Company_HR', 'User']), companyController.getCompanyById);

// Route to search for a company by name
router.get('/search/:name', authMiddleware, roleMiddleware(['Company_HR', 'User']), companyController.searchCompanyByName);

// Route to get all applications for specific jobs of a company
router.get('/:companyId/applications', authMiddleware, roleMiddleware('Company_HR'), companyController.getApplicationsForCompanyJobs);

module.exports = router;
