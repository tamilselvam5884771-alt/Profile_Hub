/**
 * @file profile.model.js
 * @description Mongoose schema and model definition for User Profiles.
 * @folder src/models/ - Interacts directly with the database.
 */

const mongoose = require('mongoose');

/**
 * Nested schema for Skills.
 * Embedded directly inside Profile to avoid extra collection overhead and lookup operations.
 * Each skill gets its own _id so it can be individually updated and deleted.
 */
const skillSchema = new mongoose.Schema(
  {
    skillName: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      trim: true,
      enum: {
        values: [
          'Programming Language',
          'Frontend',
          'Backend',
          'Database',
          'Cloud',
          'DevOps',
          'AI / Machine Learning',
          'Mobile',
          'Tools',
          'Soft Skills',
          'Other',
        ],
        message: 'Invalid skill category',
      },
    },
    level: {
      type: String,
      required: [true, 'Skill level is required'],
      trim: true,
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        message: 'Skill level must be Beginner, Intermediate, Advanced, or Expert',
      },
    },
    experience: {
      value: {
        type: Number,
        min: [0, 'Experience value cannot be negative'],
        default: null,
      },
      unit: {
        type: String,
        enum: {
          values: ['Months', 'Years'],
          message: 'Experience unit must be Months or Years',
        },
        default: null,
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      trim: true,
      default: 'Manual',
    },
  },
  {
    timestamps: true, // Adds createdAt + updatedAt per skill subdocument
  }
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
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      trim: true,
      enum: {
        values: [
          'Web Application',
          'Mobile Application',
          'Desktop Application',
          'AI / Machine Learning',
          'Data Science',
          'IoT',
          'Blockchain',
          'Open Source',
          'College Project',
          'Hackathon',
          'Other',
        ],
        message: 'Invalid project category',
      },
    },
    status: {
      type: String,
      required: [true, 'Project status is required'],
      trim: true,
      enum: {
        values: ['Planning', 'In Progress', 'Completed', 'Archived'],
        message: 'Invalid project status',
      },
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: '',
    },
    thumbnailPublicId: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    achievements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Auto-manages createdAt and updatedAt for each project subdocument
  }
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
    avatarUrl: {
      type: String,
      trim: true,
      default: '',
    },
    avatarPublicId: {
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
