/**
 * @file app.js
 * @description Creates the Express application instance, configures global middlewares, binds routes, and configures error interceptors.
 * @folder src/ - Parent folder containing all MVC architecture layers and configuration.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables if not loaded at the root level
dotenv.config();

const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const { errorHandler, AppError } = require('./middleware/error.middleware');

const app = express();

// 1. Enable Cross-Origin Resource Sharing (CORS) for external frontend consumption
app.use(cors());

// 2. Parse incoming JSON payloads in request bodies
app.use(express.json());

// 3. Parse URL-encoded payloads (form submissions)
app.use(express.urlencoded({ extended: true }));

// Welcome Route for health verification
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the ProfileHub Authentication API!',
  });
});

// 4. Mount authentication endpoints under /api/auth
app.use('/api/auth', authRoutes);

// Mount profile endpoints under /api/profile
app.use('/api/profile', profileRoutes);

// 5. Catch-all for undefined route paths (resolves to 404 error)
app.use('*', (req, res, next) => {
  next(new AppError(`Cannot find endpoint '${req.originalUrl}' on this server.`, 404));
});

// 6. Global Error Handling Middleware (must be registered last to catch errors propagated via next())
app.use(errorHandler);

module.exports = app;
