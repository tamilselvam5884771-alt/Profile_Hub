/**
 * @file errorMiddleware.js
 * @description Global error handler middleware that catches all unhandled errors in the application.
 * @folder src/middleware/ - Handles request/response interception, authentication, and error formatting.
 */

/**
 * Custom Error class for operational (predictable) application errors.
 */
class AppError extends Error {
  /**
   * @param {string} message - Error description
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Express error handling middleware function.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // 1. Mongoose Duplicate Key Error (MongoDB code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    error.statusCode = 400;
    error.message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' is already in use.`;
  }

  // 2. Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    const messageList = Object.values(err.errors).map((val) => val.message);
    error.statusCode = 400;
    error.message = `Validation failed: ${messageList.join('. ')}`;
  }

  // 3. JWT Signature Errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid authentication token. Please log in again.';
  }

  // 4. JWT Expiration Errors
  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Authentication token expired. Please log in again.';
  }

  // Send uniform error structure
  res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message || 'Internal Server Error',
    // Only leak stack trace in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = {
  AppError,
  errorHandler,
};
