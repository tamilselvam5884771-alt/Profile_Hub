/**
 * @file profile.controller.js
 * @description Coordinates HTTP requests for profiles, extracts payloads, calls the service layer, and formats JSON responses.
 * @folder src/controllers/ - Interfacing layer mapping API endpoints to service logic.
 */

const profileService = require('../services/profile.service');

/**
 * Async utility wrapper to forward rejected promises (async errors) to Express global error handler.
 * Avoids writing redundant try-catch blocks inside controllers.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @desc    Create a user profile
 * @route   POST /api/profile
 * @access  Private (Requires authenticated user)
 */
const createProfile = asyncHandler(async (req, res) => {
  const result = await profileService.createProfile(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: 'Profile created successfully.',
    data: result,
  });
});

/**
 * @desc    Get the current user's profile
 * @route   GET /api/profile/me
 * @access  Private (Requires authenticated user)
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const result = await profileService.getProfileByUserId(req.user._id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Update current user's profile
 * @route   PUT /api/profile/me
 * @access  Private (Requires authenticated user)
 */
const updateProfile = asyncHandler(async (req, res) => {
  const result = await profileService.updateProfileByUserId(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    data: result,
  });
});

/**
 * @desc    Get a user's public profile by their username
 * @route   GET /api/profile/:username
 * @access  Public
 */
const getPublicProfile = asyncHandler(async (req, res) => {
  const result = await profileService.getProfileByUsername(req.params.username);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Delete the current user's profile
 * @route   DELETE /api/profile/me
 * @access  Private (Requires authenticated user)
 */
const deleteProfile = asyncHandler(async (req, res) => {
  const result = await profileService.deleteProfileByUserId(req.user._id);

  res.status(200).json({
    success: true,
    message: 'Profile deleted successfully.',
    data: result,
  });
});

/**
 * @desc    Upload profile avatar
 * @route   POST /api/profile/avatar
 * @access  Private (Requires authenticated user)
 */
const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an image file to upload.',
    });
  }

  const result = await profileService.uploadAvatar(req.user._id, req.file.buffer);

  res.status(200).json({
    success: true,
    message: 'Avatar uploaded successfully.',
    data: result,
  });
});

/**
 * @desc    Delete profile avatar
 * @route   DELETE /api/profile/avatar
 * @access  Private (Requires authenticated user)
 */
const deleteAvatar = asyncHandler(async (req, res) => {
  const result = await profileService.deleteAvatar(req.user._id);

  res.status(200).json({
    success: true,
    message: 'Avatar removed successfully.',
    data: result,
  });
});

/**
 * @desc    Get all skills for the current user
 * @route   GET /api/profile/me/skills
 * @access  Private
 */
const getSkills = asyncHandler(async (req, res) => {
  const result = await profileService.getSkills(req.user._id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Add a new skill to the current user's profile
 * @route   POST /api/profile/me/skills
 * @access  Private
 */
const addSkill = asyncHandler(async (req, res) => {
  const result = await profileService.addSkill(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: 'Skill added successfully.',
    data: result,
  });
});

/**
 * @desc    Update an existing skill by ID
 * @route   PUT /api/profile/me/skills/:skillId
 * @access  Private
 */
const updateSkill = asyncHandler(async (req, res) => {
  const result = await profileService.updateSkill(req.user._id, req.params.skillId, req.body);

  res.status(200).json({
    success: true,
    message: 'Skill updated successfully.',
    data: result,
  });
});

/**
 * @desc    Delete a skill by ID
 * @route   DELETE /api/profile/me/skills/:skillId
 * @access  Private
 */
const deleteSkill = asyncHandler(async (req, res) => {
  const result = await profileService.deleteSkill(req.user._id, req.params.skillId);

  res.status(200).json({
    success: true,
    message: 'Skill deleted successfully.',
    data: result,
  });
});

/**
 * @desc    Get all projects for the current user
 * @route   GET /api/profile/me/projects
 * @access  Private
 */
const getProjects = asyncHandler(async (req, res) => {
  const result = await profileService.getProjects(req.user._id);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Add a new project to current user's profile
 * @route   POST /api/profile/me/projects
 * @access  Private
 */
const addProject = asyncHandler(async (req, res) => {
  const result = await profileService.addProject(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: 'Project added successfully.',
    data: result,
  });
});

/**
 * @desc    Update a project by ID
 * @route   PUT /api/profile/me/projects/:projectId
 * @access  Private
 */
const updateProject = asyncHandler(async (req, res) => {
  const result = await profileService.updateProject(req.user._id, req.params.projectId, req.body);

  res.status(200).json({
    success: true,
    message: 'Project updated successfully.',
    data: result,
  });
});

/**
 * @desc    Delete a project by ID
 * @route   DELETE /api/profile/me/projects/:projectId
 * @access  Private
 */
const deleteProject = asyncHandler(async (req, res) => {
  const result = await profileService.deleteProject(req.user._id, req.params.projectId);

  res.status(200).json({
    success: true,
    message: 'Project deleted successfully.',
    data: result,
  });
});

/**
 * @desc    Upload project thumbnail
 * @route   POST /api/profile/me/projects/thumbnail
 * @access  Private
 */
const uploadProjectThumbnail = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an image file to upload.',
    });
  }

  const result = await profileService.uploadProjectThumbnail(req.user._id, req.file.buffer);

  res.status(200).json({
    success: true,
    message: 'Thumbnail uploaded successfully.',
    data: result,
  });
});

module.exports = {
  createProfile,
  getMyProfile,
  updateProfile,
  getPublicProfile,
  deleteProfile,
  uploadAvatar,
  deleteAvatar,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  uploadProjectThumbnail,
};
