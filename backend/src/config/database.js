/**
 * @file database.js
 * @description Configures and establishes connection to the MongoDB database (local or MongoDB Atlas) using Mongoose.
 * @folder src/config/ - Contains configuration modules for databases, third-party APIs, and environmental setups.
 */

const mongoose = require('mongoose');

/**
 * Establishes connection to the MongoDB server.
 * Reads MONGO_URI from environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Modern Mongoose options (Mongoose 6+ has these enabled by default, but good for reference)
    });
    console.log(`[Database] MongoDB Atlas connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failed: ${error.message}`);
    process.exit(1); // Exit server process on failure
  }
};

module.exports = connectDB;
