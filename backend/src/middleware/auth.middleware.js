/**
 * @file authMiddleware.js
 * @description Middleware to verify JWT tokens and secure private endpoints.
 * @folder src/middleware/ - Handles request interception, token verification, and session setup.
 */

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const User = require('../models/user.model');
const { AppError } = require('./error.middleware');

/**
 * Express middleware to protect routes.
 * Checks for a valid Bearer token in the 'Authorization' header.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token is passed inside the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token string
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token signature and integrity
      const decoded = jwt.verify(token, jwtConfig.secret);

      // 3. Find the user in the database, excluding the password field
      const currentUser = await User.findById(decoded.userId).select('-password');

      if (!currentUser) {
        return next(
          new AppError('The user associated with this token no longer exists.', 401)
        );
      }

      // 4. Attach user data to request object
      req.user = currentUser;
      return next();
    } catch (error) {
      // Forward the error to the global handler (e.g., TokenExpiredError or JsonWebTokenError)
      return next(error);
    }
  }

  // 5. If no token is provided
  if (!token) {
    return next(
      new AppError('Access denied. Authorization token is missing.', 401)
    );
  }
};

module.exports = {
  protect,
};
