import api from './api/axios';

/**
 * Fetch the current user's profile details
 * @returns {Promise<Object>} Response data containing user profile object
 */
export const getMyProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};

/**
 * Future Placeholder: Update the current user's profile details
 * @param {Object} profileData - Updated profile fields payload
 * @returns {Promise<Object>} Response data containing updated user profile object
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/profile/me', profileData);
  return response.data;
};

/**
 * Future Placeholder: Calculate profile completion percentage locally
 * @returns {number} Completion percentage placeholder (0)
 */
export const calculateProfileCompletion = () => {
  return 0;
};

const profileService = {
  getMyProfile,
  updateProfile,
  calculateProfileCompletion,
};

export default profileService;
