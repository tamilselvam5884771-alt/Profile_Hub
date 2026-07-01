/**
 * @file profile.service.js
 * @description Implements business logic for profile CRUD operations, user resolution, and security checks.
 * @folder src/services/ - Houses logic separate from route handling.
 */

const Profile = require('../models/profile.model');
const User = require('../models/User');
const { AppError } = require('../middleware/errorMiddleware');

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

module.exports = {
  createProfile,
  getProfileByUserId,
  updateProfileByUserId,
  getProfileByUsername,
  deleteProfileByUserId,
};
