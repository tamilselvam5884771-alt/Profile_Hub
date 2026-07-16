/**
 * @file authController.js
 * @description Coordinates HTTP requests for authentication, extracts payloads, calls the service layer, and returns HTTP responses.
 * @folder src/controllers/ - Interfacing layer mapping API endpoints to business logic results and managing HTTP response structures.
 */

const authService = require('../services/auth.service');

/**
 * Async utility wrapper to forward rejected promises (async errors) to Express global error handler.
 * Avoids writing redundant try-catch blocks inside controllers.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: result,
  });
});

/**
 * @desc    Log in an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: result,
  });
});

/**
 * @desc    Retrieve profile info for the currently authenticated user
 * @route   GET /api/auth/me
 * @access  Private (Requires JWT auth header)
 */
const getMe = asyncHandler(async (req, res) => {
  // req.user has already been queried and populated by the 'protect' middleware.
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

/**
 * @desc    Log out user session
 * @route   POST /api/auth/logout
 * @access  Private (Requires JWT auth header)
 */
const logout = asyncHandler(async (req, res) => {
  /**
   * Note on JWT Logout:
   * JSON Web Tokens (JWT) are stateless. The server does not maintain session state in memory/DB.
   * To "log out", the client application (Frontend) must discard the stored JWT (from localStorage, sessionStorage, or client cookies).
   * Here we return a success response instructing the client to delete the token.
   */
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please delete your authentication token on the frontend.',
  });
});

module.exports = {
  register,
  login,
  getMe,
  logout,
};
