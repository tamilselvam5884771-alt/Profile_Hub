/**
 * @file authValidator.js
 * @description Input validation middleware for registration and login payloads.
 * @folder src/validators/ - Contains validation rules and middlewares to validate request data before reaching controllers.
 */

/**
 * Validates register request payload.
 * Checks for name, username, email format, and password criteria.
 */
const validateRegister = (req, res, next) => {
  const { name, username, email, password } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!username || username.trim() === '') {
    errors.push('Username is required');
  } else if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain alphanumeric characters and underscores');
  }

  if (!email || email.trim() === '') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Validates login request payload.
 * Ensures either email or username is provided, along with the password.
 */
const validateLogin = (req, res, next) => {
  const { email, username, password } = req.body;
  const errors = [];

  if (!email && !username) {
    errors.push('Email or username is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
