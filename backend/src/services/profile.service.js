/**
 * @file profile.service.js
 * @description Implements business logic for profile CRUD operations, user resolution, and security checks.
 * @folder src/services/ - Houses logic separate from route handling.
 */

const Profile = require('../models/profile.model');
const User = require('../models/user.model');
const { AppError } = require('../middleware/error.middleware');
const cloudinary = require('../config/cloudinary');

/**
 * Creates a new profile for a user.
 * Enforces the rule that every user can have only ONE profile.
 * @param {string} userId - User reference ObjectId
 * @param {Object} profileData - Profile details payload
 * @returns {Promise<Object>} The created Profile document
 */
const createProfile = async (userId, profileData) => {
  // 1. Check if the user already has a profile
  const profileExists = await Profile.findOne({ userId });
  if (profileExists) {
    throw new AppError('Profile already exists. You can only create one profile.', 400);
  }

  // 2. Create profile linked with the user
  const newProfile = await Profile.create({
    userId,
    ...profileData,
  });

  return newProfile;
};

/**
 * Retrieves the profile of the logged-in user.
 * @param {string} userId - User reference ObjectId
 * @returns {Promise<Object>} The Profile document
 */
const getProfileByUserId = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found. Please create a profile.', 404);
  }
  return profile;
};

/**
 * Updates an existing user's profile.
 * @param {string} userId - User reference ObjectId
 * @param {Object} updateData - Updated profile fields
 * @returns {Promise<Object>} The updated Profile document
 */
const updateProfileByUserId = async (userId, updateData) => {
  // Find and update the profile, running schema validators on fields changed
  const updatedProfile = await Profile.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedProfile) {
    throw new AppError('Profile not found. Create a profile before updating.', 404);
  }

  return updatedProfile;
};

/**
 * Resolves username to User ID, then retrieves their public profile.
 * Safely populates only public user info (name, username) and leaves out email/password.
 * @param {string} username - User account username
 * @returns {Promise<Object>} The Profile document populated with public User details
 */
const getProfileByUsername = async (username) => {
  // 1. Find user by case-insensitive username query
  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  // 2. Find associated profile and populate name/username
  const profile = await Profile.findOne({ userId: user._id }).populate('userId', 'name username');
  if (!profile) {
    throw new AppError('Profile not found for the requested user.', 404);
  }

  return profile;
};

/**
 * Deletes the profile associated with the user ID.
 * @param {string} userId - User reference ObjectId
 * @returns {Promise<Object>} The deleted Profile document representation
 */
const deleteProfileByUserId = async (userId) => {
  const deletedProfile = await Profile.findOneAndDelete({ userId });
  if (!deletedProfile) {
    throw new AppError('Profile not found. Nothing to delete.', 404);
  }
  return deletedProfile;
};

/**
 * Helper to upload buffer stream to Cloudinary
 */
const uploadToCloudinary = (fileBuffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(fileBuffer);
  });
};

/**
 * Uploads a profile avatar image to Cloudinary and updates profile references.
 * If an old avatar exists, deletes it from Cloudinary first.
 * @param {string} userId - User reference ObjectId
 * @param {Buffer} fileBuffer - Multer memory file buffer
 * @returns {Promise<Object>} The updated Profile document
 */
const uploadAvatar = async (userId, fileBuffer) => {
  // 1. Find profile first (profile must exist before uploading avatar)
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found. Please create a profile first.', 404);
  }

  // 2. If an old avatar exists, delete it from Cloudinary
  if (profile.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(profile.avatarPublicId);
    } catch (destroyError) {
      console.error('[Cloudinary] Failed to delete old avatar:', destroyError);
      // Continue anyway to avoid blocking upload of the new avatar
    }
  }

  // 3. Upload new avatar buffer to Cloudinary
  let uploadResult;
  try {
    uploadResult = await uploadToCloudinary(fileBuffer, {
      folder: 'ProfileHub/avatars',
      transformation: [
        { width: 300, height: 300, crop: 'fill', gravity: 'face' } // Standardize profile images
      ]
    });
  } catch (uploadError) {
    console.error('[Cloudinary] Upload failed:', uploadError);
    throw new AppError('Failed to upload image to cloud storage.', 500);
  }

  // 4. Save to database
  profile.avatarUrl = uploadResult.secure_url;
  profile.avatarPublicId = uploadResult.public_id;
  profile.profileImage = uploadResult.secure_url; // Map to legacy field to ensure compatibility
  await profile.save();

  return profile;
};

/**
 * Removes the avatar photo of the user. Deletes the asset from Cloudinary and clears DB fields.
 * @param {string} userId - User reference ObjectId
 * @returns {Promise<Object>} The updated Profile document
 */
const deleteAvatar = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found.', 404);
  }

  // Delete from Cloudinary if public ID exists
  if (profile.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(profile.avatarPublicId);
    } catch (destroyError) {
      console.error('[Cloudinary] Failed to delete avatar asset:', destroyError);
      throw new AppError('Failed to remove image from cloud storage.', 500);
    }
  }

  // Clear DB fields
  profile.avatarUrl = '';
  profile.avatarPublicId = '';
  profile.profileImage = '';
  await profile.save();

  return profile;
};

module.exports = {
  createProfile,
  getProfileByUserId,
  updateProfileByUserId,
  getProfileByUsername,
  deleteProfileByUserId,
  uploadAvatar,
  deleteAvatar,
};
