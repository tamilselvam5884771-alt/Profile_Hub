import api from './api/axios';

/**
 * Authenticate user with credentials (email/username and password)
 * @param {Object} credentials - { email, username, password }
 * @returns {Promise<Object>} Response data containing user and token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Register a new user account
 * @param {Object} userData - { name, username, email, password }
 * @returns {Promise<Object>} Response data containing registered user details and token
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Log out user session on backend
 * @returns {Promise<Object>} Success response message
 */
export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

/**
 * Retrieve current user profile details
 * @returns {Promise<Object>} Response data containing current user details
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Export services object as default and api instance for reuse in future services
const authService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export { api };
export default authService;
