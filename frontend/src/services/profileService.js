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

/**
 * Fetch the current user's skills array.
 * @returns {Promise<Object>} Response data containing skills array
 */
export const getSkills = async () => {
  const response = await api.get('/profile/me/skills');
  return response.data;
};

/**
 * Add a new skill to the authenticated user's profile.
 * @param {Object} skillData - { skillName, category, level, experience: { value, unit } }
 * @returns {Promise<Object>} Response data containing the updated profile
 */
export const addSkill = async (skillData) => {
  const response = await api.post('/profile/me/skills', skillData);
  return response.data;
};

/**
 * Update an existing skill by its subdocument ID.
 * @param {string} skillId - MongoDB ObjectId of the skill subdocument
 * @param {Object} skillData - Updated skill fields
 * @returns {Promise<Object>} Response data containing the updated profile
 */
export const updateSkill = async (skillId, skillData) => {
  const response = await api.put(`/profile/me/skills/${skillId}`, skillData);
  return response.data;
};

/**
 * Delete a skill by its subdocument ID.
 * @param {string} skillId - MongoDB ObjectId of the skill subdocument
 * @returns {Promise<Object>} Response data containing the updated profile
 */
export const deleteSkill = async (skillId) => {
  const response = await api.delete(`/profile/me/skills/${skillId}`);
  return response.data;
};

export const getProjects = async () => {
  const response = await api.get('/profile/me/projects');
  return response.data;
};

export const addProject = async (projectData) => {
  const response = await api.post('/profile/me/projects', projectData);
  return response.data;
};

export const updateProject = async (projectId, projectData) => {
  const response = await api.put(`/profile/me/projects/${projectId}`, projectData);
  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await api.delete(`/profile/me/projects/${projectId}`);
  return response.data;
};

const profileService = {
  getMyProfile,
  createProfile,
  updateProfile,
  calculateProfileCompletion,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
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
  /**
   * Upload project thumbnail image using multipart form data.
   */
  uploadProjectThumbnail: async (file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    const response = await api.post('/profile/me/projects/thumbnail', formData);
    return response.data;
  },
};

export default profileService;

