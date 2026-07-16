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

module.exports = {
  createProfile,
  getMyProfile,
  updateProfile,
  getPublicProfile,
  deleteProfile,
  uploadAvatar,
  deleteAvatar,
};
