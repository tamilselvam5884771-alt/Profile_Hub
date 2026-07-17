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

/**
 * Retrieves all skills for a user's profile.
 * @param {string} userId - User reference ObjectId
 * @returns {Promise<Array>} The skills array
 */
const getSkills = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found. Please create a profile first.', 404);
  }
  return profile.skills;
};

/**
 * Adds a new skill to the user's profile.
 * Enforces case-insensitive uniqueness across skill names.
 * @param {string} userId - User reference ObjectId
 * @param {Object} skillData - { skillName, category, level, experience, verified, source }
 * @returns {Promise<Object>} The updated Profile document
 */
const addSkill = async (userId, skillData) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found. Please create a profile first.', 404);
  }

  // Case-insensitive duplicate check
  const duplicate = profile.skills.find(
    (s) => s.skillName.trim().toLowerCase() === skillData.skillName.trim().toLowerCase()
  );
  if (duplicate) {
    throw new AppError(`Skill '${skillData.skillName.trim()}' already exists in your profile.`, 409);
  }

  profile.skills.push({
    skillName: skillData.skillName.trim(),
    category: skillData.category,
    level: skillData.level,
    experience: {
      value: skillData.experience?.value ?? null,
      unit: skillData.experience?.unit ?? null,
    },
    verified: skillData.verified ?? false,
    source: skillData.source ?? 'Manual',
  });

  await profile.save();
  return profile;
};

/**
 * Updates an existing skill by its subdocument _id.
 * Also enforces case-insensitive uniqueness (excluding the skill being edited).
 * @param {string} userId - User reference ObjectId
 * @param {string} skillId - Subdocument _id of the skill
 * @param {Object} skillData - Updated skill fields
 * @returns {Promise<Object>} The updated Profile document
 */
const updateSkill = async (userId, skillId, skillData) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found.', 404);
  }

  const skill = profile.skills.id(skillId);
  if (!skill) {
    throw new AppError('Skill not found.', 404);
  }

  // Case-insensitive duplicate check (exclude current skill)
  const duplicate = profile.skills.find(
    (s) =>
      s._id.toString() !== skillId &&
      s.skillName.trim().toLowerCase() === skillData.skillName.trim().toLowerCase()
  );
  if (duplicate) {
    throw new AppError(`Skill '${skillData.skillName.trim()}' already exists in your profile.`, 409);
  }

  // Apply updates
  skill.skillName = skillData.skillName.trim();
  skill.category = skillData.category;
  skill.level = skillData.level;
  skill.experience = {
    value: skillData.experience?.value ?? null,
    unit: skillData.experience?.unit ?? null,
  };
  if (skillData.verified !== undefined) skill.verified = skillData.verified;
  if (skillData.source !== undefined) skill.source = skillData.source;

  await profile.save();
  return profile;
};

/**
 * Deletes a skill by its subdocument _id.
 * @param {string} userId - User reference ObjectId
 * @param {string} skillId - Subdocument _id of the skill
 * @returns {Promise<Object>} The updated Profile document
 */
const deleteSkill = async (userId, skillId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found.', 404);
  }

  const skill = profile.skills.id(skillId);
  if (!skill) {
    throw new AppError('Skill not found.', 404);
  }

  skill.deleteOne();
  await profile.save();
  return profile;
};

/**
 * Retrieves all projects for a user's profile.
 */
const getProjects = async (userId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found. Please create a profile first.', 404);
  }
  return profile.projects;
};

/**
 * Adds a new project. Enforces case-insensitive duplicate checking and single featured project.
 */
const addProject = async (userId, projectData) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found. Please create a profile first.', 404);
  }

  // Duplicate check
  const duplicate = profile.projects.find(
    (p) => p.title.trim().toLowerCase() === projectData.title.trim().toLowerCase()
  );
  if (duplicate) {
    throw new AppError(`Project '${projectData.title.trim()}' already exists in your profile.`, 409);
  }

  // Featured check: only one project featured at a time
  if (projectData.featured === true) {
    profile.projects.forEach((p) => {
      p.featured = false;
    });
  }

  profile.projects.push({
    title: projectData.title.trim(),
    tagline: projectData.tagline?.trim() || '',
    description: projectData.description.trim(),
    techStack: Array.isArray(projectData.techStack) ? projectData.techStack.map((t) => t.trim()) : [],
    category: projectData.category.trim(),
    status: projectData.status.trim(),
    githubUrl: projectData.githubUrl?.trim() || '',
    liveDemoUrl: projectData.liveDemoUrl?.trim() || '',
    thumbnailUrl: projectData.thumbnailUrl?.trim() || '',
    thumbnailPublicId: projectData.thumbnailPublicId?.trim() || '',
    featured: projectData.featured ?? false,
    startDate: projectData.startDate ? new Date(projectData.startDate) : null,
    endDate: projectData.endDate ? new Date(projectData.endDate) : null,
    achievements: Array.isArray(projectData.achievements) ? projectData.achievements.map((a) => a.trim()) : [],
  });

  await profile.save();
  return profile;
};

/**
 * Updates a project. Handles title duplicate checks, thumbnail replacements, and featured project logic.
 */
const updateProject = async (userId, projectId, projectData) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found.', 404);
  }

  const project = profile.projects.id(projectId);
  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  // Duplicate check (exclude current project)
  const duplicate = profile.projects.find(
    (p) =>
      p._id.toString() !== projectId &&
      p.title.trim().toLowerCase() === projectData.title.trim().toLowerCase()
  );
  if (duplicate) {
    throw new AppError(`Project '${projectData.title.trim()}' already exists in your profile.`, 409);
  }

  // Featured check: only one project featured at a time
  if (projectData.featured === true) {
    profile.projects.forEach((p) => {
      if (p._id.toString() !== projectId) {
        p.featured = false;
      }
    });
  }

  // Cloudinary cleanup of old thumbnail if replaced
  if (project.thumbnailPublicId && project.thumbnailPublicId !== projectData.thumbnailPublicId) {
    try {
      await cloudinary.uploader.destroy(project.thumbnailPublicId);
    } catch (destroyError) {
      console.error('[Cloudinary] Failed to delete replaced project thumbnail:', destroyError);
    }
  }

  // Apply updates
  project.title = projectData.title.trim();
  project.tagline = projectData.tagline?.trim() || '';
  project.description = projectData.description.trim();
  project.techStack = Array.isArray(projectData.techStack) ? projectData.techStack.map((t) => t.trim()) : [];
  project.category = projectData.category.trim();
  project.status = projectData.status.trim();
  project.githubUrl = projectData.githubUrl?.trim() || '';
  project.liveDemoUrl = projectData.liveDemoUrl?.trim() || '';
  project.thumbnailUrl = projectData.thumbnailUrl?.trim() || '';
  project.thumbnailPublicId = projectData.thumbnailPublicId?.trim() || '';
  project.featured = projectData.featured ?? false;
  project.startDate = projectData.startDate ? new Date(projectData.startDate) : null;
  project.endDate = projectData.endDate ? new Date(projectData.endDate) : null;
  project.achievements = Array.isArray(projectData.achievements) ? projectData.achievements.map((a) => a.trim()) : [];

  await profile.save();
  return profile;
};

/**
 * Deletes a project by ID and destroys its thumbnail on Cloudinary.
 */
const deleteProject = async (userId, projectId) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found.', 404);
  }

  const project = profile.projects.id(projectId);
  if (!project) {
    throw new AppError('Project not found.', 404);
  }

  // Cloudinary cleanup
  if (project.thumbnailPublicId) {
    try {
      await cloudinary.uploader.destroy(project.thumbnailPublicId);
    } catch (destroyError) {
      console.error('[Cloudinary] Failed to delete project thumbnail:', destroyError);
    }
  }

  project.deleteOne();
  await profile.save();
  return profile;
};

/**
 * Uploads project thumbnail to Cloudinary.
 */
const uploadProjectThumbnail = async (userId, fileBuffer) => {
  const profile = await Profile.findOne({ userId });
  if (!profile) {
    throw new AppError('Profile not found. Please create a profile first.', 404);
  }

  let uploadResult;
  try {
    uploadResult = await uploadToCloudinary(fileBuffer, {
      folder: 'ProfileHub/projects',
      transformation: [{ width: 800, height: 500, crop: 'limit' }],
    });
  } catch (uploadError) {
    console.error('[Cloudinary] Project thumbnail upload failed:', uploadError);
    throw new AppError('Failed to upload thumbnail to cloud storage.', 500);
  }

  return {
    thumbnailUrl: uploadResult.secure_url,
    thumbnailPublicId: uploadResult.public_id,
  };
};

module.exports = {
  createProfile,
  getProfileByUserId,
  updateProfileByUserId,
  getProfileByUsername,
  deleteProfileByUserId,
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

