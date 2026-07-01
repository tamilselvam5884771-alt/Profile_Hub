/**
 * @file profile.model.js
 * @description Mongoose schema and model definition for User Profiles.
 * @folder src/models/ - Interacts directly with the database.
 */

const mongoose = require('mongoose');

/**
 * Nested schema for Skills.
 * Embedded directly inside Profile to avoid extra collection overhead and lookup operations.
 */
const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    level: {
      type: String,
      required: [true, 'Skill level is required'],
      trim: true,
      enum: {
        values: ['Beginner', 'Intermediate', 'Expert'],
        message: 'Skill level must be either Beginner, Intermediate, or Expert',
      },
    },
  },
  { _id: false } // Disable _id generation for nested subdocuments to save space and avoid clutter
);

/**
 * Nested schema for Projects.
 * Embedded directly inside Profile.
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    githubLink: {
      type: String,
      trim: true,
    },
    liveDemo: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { _id: false }
);

/**
 * Nested schema for Certifications.
 * Embedded directly inside Profile.
 */
const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Certification title is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Certification issuer is required'],
      trim: true,
    },
    issueDate: {
      type: Date,
    },
    certificateLink: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * Main Profile Schema.
 * Represents a user's professional profile. Enforces one profile per user via unique index on userId.
 */
const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Profile must be linked to a user'],
      unique: true, // One-to-one relationship: each user can have ONLY ONE profile
      index: true,
    },
    headline: {
      type: String,
      required: [true, 'Headline is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
      default: '',
    },
    // Social Links (Embedded flat key-value pairs)
    linkedin: {
      type: String,
      trim: true,
      default: '',
    },
    github: {
      type: String,
      trim: true,
      default: '',
    },
    leetcode: {
      type: String,
      trim: true,
      default: '',
    },
    hackerrank: {
      type: String,
      trim: true,
      default: '',
    },
    codechef: {
      type: String,
      trim: true,
      default: '',
    },
    geeksforgeeks: {
      type: String,
      trim: true,
      default: '',
    },
    portfolioWebsite: {
      type: String,
      trim: true,
      default: '',
    },
    // Embedded Arrays for Skills, Projects, and Certifications
    skills: {
      type: [skillSchema],
      default: [],
    },
    projects: {
      type: [projectSchema],
      default: [],
    },
    certifications: {
      type: [certificationSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Auto-manages createdAt and updatedAt fields
  }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
