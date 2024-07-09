/*Routes for job operations */
const express = require('express');
const router = express.Router();
const { jobSchema, jobFilterSchema } = require('../utils/validationSchemas');
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Middleware to validate request data against a schema
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

// Route to add a new job
router.post('/add', authMiddleware, roleMiddleware('Company_HR'), validateRequest(jobSchema), jobController.addJob);

// Route to update an existing job
router.put('/update/:jobId', authMiddleware, roleMiddleware('Company_HR'), validateRequest(jobSchema), jobController.updateJob);

// Route to delete a job
router.delete('/delete/:jobId', authMiddleware, roleMiddleware('Company_HR'), jobController.deleteJob);

// Route to get all jobs with their company's information
router.get('/all', authMiddleware, jobController.getAllJobs);

// Route to get all jobs for a specific company
router.get('/company/:companyId', authMiddleware, jobController.getJobsByCompany);

// Route to get all jobs that match the following filters
router.post('/filter', authMiddleware, validateRequest(jobFilterSchema), jobController.filterJobs);

// Route to apply to a job
router.post('/apply/:jobId', authMiddleware, roleMiddleware('User'), jobController.applyToJob);

module.exports = router;