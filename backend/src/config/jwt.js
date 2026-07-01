/**
 * @file jwt.js
 * @description Exports central configuration variables for signing and verifying JSON Web Tokens (JWT).
 * @folder src/config/ - Contains configuration modules for databases, third-party APIs, and environmental setups.
 */

module.exports = {
  secret: process.env.JWT_SECRET || 'super_secret_profilehub_key_2026_change_this_in_production',
  expiresIn: process.env.JWT_EXPIRE || '24h',
};
