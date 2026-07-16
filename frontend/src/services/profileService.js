import api from './api/axios';

/**
 * Fetch the current user's profile details.
 * Throws AxiosError with status 404 if no profile exists yet — callers should handle gracefully.
 * @returns {Promise<Object>} Response data containing user profile object
 */
export const getMyProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};

/**
 * Create a new profile for the authenticated user.
 * Backend requires: headline, bio, location.
 * @param {Object} profileData - Profile fields payload { headline, bio, location, ... }
 * @returns {Promise<Object>} Response data containing the created profile
 */
export const createProfile = async (profileData) => {
  const response = await api.post('/profile', profileData);
  return response.data;
};

/**
 * Update the current user's existing profile.
 * Supports partial updates — only sends the fields that changed.
 * @param {Object} profileData - Updated profile fields payload
 * @returns {Promise<Object>} Response data containing the updated profile
 */
export const updateProfile = async (profileData) => {
  const response = await api.put('/profile/me', profileData);
  return response.data;
};

/**
 * Calculate profile completion percentage based on filled fields.
 * Placeholder — full algorithm to be implemented in a future sprint.
 * @param {Object} profile - Profile document
 * @returns {number} Completion percentage (0–100)
 */
export const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  const fields = ['headline', 'bio', 'location', 'profileImage', 'linkedin', 'github'];
  const filled = fields.filter(f => profile[f] && profile[f].trim() !== '').length;
  const arrFields = ['skills', 'projects', 'certifications'];
  const filledArr = arrFields.filter(f => Array.isArray(profile[f]) && profile[f].length > 0).length;
  return Math.round(((filled + filledArr) / (fields.length + arrFields.length)) * 100);
};

const profileService = {
  getMyProfile,
  createProfile,
  updateProfile,
  calculateProfileCompletion,
  /**
   * Upload user avatar photo using multipart form data.
   * @param {File} file - Browser file object
   * @returns {Promise<Object>} Response data containing the updated profile
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/profile/avatar', formData);
    return response.data;
  },
  /**
   * Remove user avatar photo and delete from Cloudinary.
   * @returns {Promise<Object>} Response data containing the updated profile
   */
  removeAvatar: async () => {
    const response = await api.delete('/profile/avatar');
    return response.data;
  },
};

export default profileService;
