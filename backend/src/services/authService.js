/**
 * @file authService.js
 * @description Implements backend business logic for user registration, authentication, and retrieval.
 * @folder src/services/ - Handles database interaction, business rules, and validation logic, isolated from express.
 */

const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');
const { AppError } = require('../middleware/errorMiddleware');

/**
 * Registers a new user account.
 * Checks for email/username duplicates, writes the user, and signs a JWT.
 * @param {Object} userData - User registration payload { name, username, email, password }
 * @returns {Promise<Object>} { user, token }
 */
const registerUser = async (userData) => {
  const { name, username, email, password } = userData;

  // 1. Check if email is already registered
  const emailExists = await User.findOne({ email: email.toLowerCase() });
  if (emailExists) {
    throw new AppError('Email address is already registered.', 400);
  }

  // 2. Check if username is already taken
  const usernameExists = await User.findOne({ username: username.toLowerCase() });
  if (usernameExists) {
    throw new AppError('Username is already taken.', 400);
  }

  // 3. Create user in the database (Mongoose hook handles password hashing)
  const user = await User.create({
    name,
    username,
    email,
    password,
  });

  // 4. Generate JWT token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Authenticates a user login request.
 * Resolves by email or username, matches credentials, and signs a JWT.
 * @param {Object} credentials - Login credentials { email, username, password }
 * @returns {Promise<Object>} { user, token }
 */
const loginUser = async (credentials) => {
  const { email, username, password } = credentials;

  // 1. Construct search query based on input type
  const query = {};
  if (email) {
    query.email = email.toLowerCase();
  } else if (username) {
    query.username = username.toLowerCase();
  }

  // 2. Locate user
  const user = await User.findOne(query);
  if (!user) {
    throw new AppError('Invalid credentials. User not found.', 401);
  }

  // 3. Verify password match
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials. Password mismatch.', 401);
  }

  // 4. Generate JWT token
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
};

/**
 * Gets a user's details by their database ObjectId.
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} User document (excluding password)
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new AppError('User account not found.', 404);
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
