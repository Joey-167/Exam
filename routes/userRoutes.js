/*Routes for user operations */
const express = require('express');
const router = express.Router();
const { userSignUpSchema, userSignInSchema, userUpdateSchema, userPasswordUpdateSchema, userRecoveryEmailSchema } = require('../utils/validationSchemas');
const userController = require('../controllers/userController');
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

// Route to sign up a new user
router.post('/signup', validateRequest(userSignUpSchema), userController.signUp);

// Route to sign in a user
router.post('/signin', validateRequest(userSignInSchema), userController.signIn);

// Route to update user account information
router.put('/update', authMiddleware, validateRequest(userUpdateSchema), userController.updateAccount);

// Route to delete user account
router.delete('/delete', authMiddleware, userController.deleteAccount);

// Route to get user account data
router.get('/account', authMiddleware, userController.getUserAccountData);

// Route to get profile data for another user
router.get('/profile/:userId', authMiddleware, userController.getProfileDataForAnotherUser);

// Route to update user password
router.put('/update-password', authMiddleware, validateRequest(userPasswordUpdateSchema), userController.updatePassword);

// Route for user to recover their password
router.post('/forgot-password', validateRequest(userRecoveryEmailSchema), userController.forgotPassword);

// Route to get all accounts associated with a specific recovery email
router.get('/recovery-email/:email', authMiddleware, userController.getAccountsByRecoveryEmail);

module.exports = router;
