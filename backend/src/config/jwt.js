/**
 * @file jwt.js
 * @description Exports central configuration variables for signing and verifying JSON Web Tokens (JWT).
 * @folder src/config/ - Contains configuration modules for databases, third-party APIs, and environmental setups.
 */

if (!process.env.JWT_SECRET) {
  throw new Error('[Startup Error] CRITICAL: Environment variable JWT_SECRET is not defined!');
}

module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRE || '24h',
};
