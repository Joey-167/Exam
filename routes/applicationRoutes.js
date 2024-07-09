/*Routes for job applications */
const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { applicationSchema } = require('../utils/validationSchemas');
const { validateRequest } = require('../middlewares/validationMiddleware');

// Route to apply for a job
router.post('/apply', authMiddleware, roleMiddleware('User'), validateRequest(applicationSchema), applicationController.applyToJob);

// Route to get applications for a specific job
router.get('/job/:jobId', authMiddleware, roleMiddleware('Company_HR'), applicationController.getApplicationsByJobId);

// Route to get applications by user
router.get('/user/:userId', authMiddleware, roleMiddleware('User'), applicationController.getApplicationsByUserId);

// Route to get all applications for a company
router.get('/company/:companyId', authMiddleware, roleMiddleware('Company_HR'), applicationController.getApplicationsByCompanyId);

// Route to delete an application
router.delete('/:applicationId', authMiddleware, roleMiddleware('User'), applicationController.deleteApplication);

module.exports = router;
