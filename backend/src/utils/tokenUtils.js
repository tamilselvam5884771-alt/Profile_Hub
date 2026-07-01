/**
 * @file tokenUtils.js
 * @description Provides helper functions for JSON Web Tokens (JWT) handling (e.g., token generation).
 * @folder src/utils/ - Contains general-purpose helper functions and utilities separate from business logic.
 */

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

/**
 * Generates a signed JSON Web Token containing the user ID in its payload.
 * @param {string} userId - User ID (typically Mongo ObjectId string)
 * @returns {string} Signed JWT token string
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

module.exports = {
  generateToken,
};
