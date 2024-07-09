/*Routes for authentication */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { userSignUpSchema, userSignInSchema } = require('../utils/validationSchemas');
const { validateRequest } = require('../middlewares/validationMiddleware');

// Route to sign up a new user
router.post('/signup', validateRequest(userSignUpSchema), authController.signUp);

// Route to sign in an existing user
router.post('/signin', validateRequest(userSignInSchema), authController.signIn);

// Route to update the user's password
router.post('/update-password', authController.updatePassword);

// Route to handle forget password
router.post('/forget-password', authController.forgetPassword);

// Route to get all accounts associated with a specific recovery email
router.get('/recovery-email/:email', authController.getAccountsByRecoveryEmail);

module.exports = router;
