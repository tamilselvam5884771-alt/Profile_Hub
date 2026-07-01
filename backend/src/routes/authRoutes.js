/**
 * @file authRoutes.js
 * @description Declares endpoints related to user authentication, applying validators and protection middleware where required.
 * @folder src/routes/ - Defines URL endpoints and mapping rules connecting client requests to controllers.
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../validators/authValidator');

// Public Route: Register a new user
router.post('/register', validateRegister, authController.register);

// Public Route: User login
router.post('/login', validateLogin, authController.login);

// Private Route: Fetch current user profile details
router.get('/me', protect, authController.getMe);

// Private Route: User logout
router.post('/logout', protect, authController.logout);

module.exports = router;
