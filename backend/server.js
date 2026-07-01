/**
 * @file server.js
 * @description Application entry point. Loads environmental config, boots MongoDB connection, and starts the Express server.
 * @folder / - Root of the backend project.
 */

const dotenv = require('dotenv');

// 1. Initialize environment variables from .env
dotenv.config();

const app = require('./src/app');
const connectDB = require('./src/config/database');

// 2. Connect to the MongoDB database
connectDB();

// 3. Start listening on designated port
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[Server] API Health check endpoint available at http://localhost:${PORT}/`);
});

// 4. Global Unhandled Rejection catcher (e.g. database disconnects or external API failure cases)
process.on('unhandledRejection', (err) => {
  console.error(`[Fatal Server Error] Unhandled promise rejection: ${err.message}`);
  // Gracefully close server, then shutdown Node process
  server.close(() => {
    process.exit(1);
  });
});
