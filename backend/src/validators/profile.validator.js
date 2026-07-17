/**
 * @file profile.validator.js
 * @description Input validation middleware for profile creation and updates, as well as route parameters.
 * @folder src/validators/ - Validates request payloads and parameters before handing off to controllers.
 */

/**
 * Helper function to validate absolute URL formats.
 * @param {string} urlString - URL string to validate
 * @returns {boolean} True if valid absolute URL, false otherwise
 */
const isValidURL = (urlString) => {
  if (!urlString || urlString.trim() === '') return true;
  try {
    const parsed = new URL(urlString);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

/**
 * Validates profile creation and update request bodies.
 * Handles duplicate detection, empty strings, and URL syntax constraints.
 */
const validateProfile = (req, res, next) => {
  const errors = [];
  const {
    headline,
    bio,
    location,
    profileImage,
    linkedin,
    github,
    leetcode,
    hackerrank,
    codechef,
    geeksforgeeks,
    portfolioWebsite,
    skills,
    projects,
    certifications,
  } = req.body;

  // 1. Required fields validation (Only required on POST / creation)
  if (req.method === 'POST') {
    if (!headline || headline.trim() === '') {
      errors.push('Headline is required');
    }
    if (!bio || bio.trim() === '') {
      errors.push('Bio is required');
    }
    if (!location || location.trim() === '') {
      errors.push('Location is required');
    }
  }

  // 2. Empty values validation (For PUT/POST - if fields are present, they must not be empty/whitespace)
  if (headline !== undefined && headline.trim() === '') {
    errors.push('Headline cannot be empty');
  }
  if (bio !== undefined && bio.trim() === '') {
    errors.push('Bio cannot be empty');
  }
  if (location !== undefined && location.trim() === '') {
    errors.push('Location cannot be empty');
  }

  // 3. Social URL validations
  const socialUrls = {
    profileImage,
    linkedin,
    github,
    leetcode,
    hackerrank,
    codechef,
    geeksforgeeks,
    portfolioWebsite,
  };

  for (const [key, value] of Object.entries(socialUrls)) {
    if (value && !isValidURL(value)) {
      errors.push(`${key.charAt(0).toUpperCase() + key.slice(1)} must be a valid URL starting with http:// or https://`);
    }
  }

  // 4. Skills array validations (Duplicates check)
  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      errors.push('Skills must be an array of objects');
    } else {
      const skillNames = new Set();
      skills.forEach((skill, index) => {
        const nameVal = skill.skillName || skill.name;
        if (!nameVal || nameVal.trim() === '') {
          errors.push(`Skill name at index ${index} is required`);
        } else {
          const lowerName = nameVal.trim().toLowerCase();
          if (skillNames.has(lowerName)) {
            errors.push(`Duplicate skill name found: '${nameVal.trim()}'`);
          }
          skillNames.add(lowerName);
        }

        if (!skill.level || skill.level.trim() === '') {
          errors.push(`Skill level for '${nameVal || index}' is required`);
        } else if (!['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(skill.level.trim())) {
          errors.push(`Invalid skill level for '${nameVal || index}'. Must be Beginner, Intermediate, Advanced, or Expert`);
        }
      });
    }
  }

  // 5. Projects array validations (Duplicates and nested URL check)
  if (projects !== undefined) {
    if (!Array.isArray(projects)) {
      errors.push('Projects must be an array of objects');
    } else {
      const projectTitles = new Set();
      projects.forEach((proj, index) => {
        if (!proj.title || proj.title.trim() === '') {
          errors.push(`Project title at index ${index} is required`);
        } else {
          const lowerTitle = proj.title.trim().toLowerCase();
          if (projectTitles.has(lowerTitle)) {
            errors.push(`Duplicate project title found: '${proj.title.trim()}'`);
          }
          projectTitles.add(lowerTitle);
        }

        if (!proj.description || proj.description.trim() === '') {
          errors.push(`Project description for '${proj.title || index}' is required`);
        }

        const gitUrl = proj.githubUrl || proj.githubLink;
        if (gitUrl && !isValidURL(gitUrl)) {
          errors.push(`GitHub URL for project '${proj.title || index}' must be a valid URL`);
        }

        const demoUrl = proj.liveDemoUrl || proj.liveDemo;
        if (demoUrl && !isValidURL(demoUrl)) {
          errors.push(`Live Demo URL for project '${proj.title || index}' must be a valid URL`);
        }
      });
    }
  }

  // 6. Certifications array validations (Duplicates and nested URL check)
  if (certifications !== undefined) {
    if (!Array.isArray(certifications)) {
      errors.push('Certifications must be an array of objects');
    } else {
      const certTitles = new Set();
      certifications.forEach((cert, index) => {
        if (!cert.title || cert.title.trim() === '') {
          errors.push(`Certification title at index ${index} is required`);
        } else {
          const lowerTitle = cert.title.trim().toLowerCase();
          if (certTitles.has(lowerTitle)) {
            errors.push(`Duplicate certification title found: '${cert.title.trim()}'`);
          }
          certTitles.add(lowerTitle);
        }

        if (!cert.issuer || cert.issuer.trim() === '') {
          errors.push(`Certification issuer for '${cert.title || index}' is required`);
        }

        if (cert.certificateLink && !isValidURL(cert.certificateLink)) {
          errors.push(`Certificate link for '${cert.title || index}' must be a valid URL`);
        }
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Validates username path parameter for GET /api/profile/:username.
 * Verifies characters and minimum length to protect lookup queries.
 */
const validateUsernameParam = (req, res, next) => {
  const { username } = req.params;
  const errors = [];

  if (!username || username.trim() === '') {
    errors.push('Username parameter is required');
  } else if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain alphanumeric characters and underscores');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

const SKILL_CATEGORIES = [
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
];

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

/**
 * Validates the request body for POST /me/skills and PUT /me/skills/:skillId.
 * Checks required fields, allowed enums, and numeric experience values.
 */
const validateSkill = (req, res, next) => {
  const errors = [];
  const { skillName, category, level, experience } = req.body;

  // 1. skillName — required, must not be empty after trimming
  if (!skillName || String(skillName).trim() === '') {
    errors.push('Skill name is required');
  }

  // 2. category — required and must be one of the allowed values
  if (!category || String(category).trim() === '') {
    errors.push('Skill category is required');
  } else if (!SKILL_CATEGORIES.includes(category.trim())) {
    errors.push(`Invalid category. Allowed: ${SKILL_CATEGORIES.join(', ')}`);
  }

  // 3. level — required and must be one of the allowed values
  if (!level || String(level).trim() === '') {
    errors.push('Skill level is required');
  } else if (!SKILL_LEVELS.includes(level.trim())) {
    errors.push(`Invalid level. Allowed: ${SKILL_LEVELS.join(', ')}`);
  }

  // 4. experience — optional block; if provided, validate fields
  if (experience !== undefined) {
    const { value, unit } = experience;

    if (value !== undefined && value !== null && value !== '') {
      const numVal = Number(value);
      if (isNaN(numVal) || numVal < 0) {
        errors.push('Experience value must be a non-negative number');
      }
    }

    if (unit !== undefined && unit !== null && unit !== '') {
      if (!['Months', 'Years'].includes(unit)) {
        errors.push('Experience unit must be either Months or Years');
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

const PROJECT_CATEGORIES = [
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
];

const PROJECT_STATUSES = ['Planning', 'In Progress', 'Completed', 'Archived'];

/**
 * Validates request payload for POST /me/projects and PUT /me/projects/:projectId
 */
const validateProject = (req, res, next) => {
  const errors = [];
  const {
    title,
    description,
    category,
    status,
    githubUrl,
    liveDemoUrl,
    thumbnailUrl,
    techStack,
    achievements,
  } = req.body;

  // 1. Title
  if (!title || String(title).trim() === '') {
    errors.push('Project title is required');
  }

  // 2. Description
  if (!description || String(description).trim() === '') {
    errors.push('Project description is required');
  }

  // 3. Category
  if (!category || String(category).trim() === '') {
    errors.push('Project category is required');
  } else if (!PROJECT_CATEGORIES.includes(category.trim())) {
    errors.push(`Invalid category. Allowed: ${PROJECT_CATEGORIES.join(', ')}`);
  }

  // 4. Status
  if (!status || String(status).trim() === '') {
    errors.push('Project status is required');
  } else if (!PROJECT_STATUSES.includes(status.trim())) {
    errors.push(`Invalid status. Allowed: ${PROJECT_STATUSES.join(', ')}`);
  }

  // 5. URLs
  if (githubUrl && !isValidURL(githubUrl)) {
    errors.push('GitHub URL must be a valid URL starting with http:// or https://');
  }
  if (liveDemoUrl && !isValidURL(liveDemoUrl)) {
    errors.push('Live Demo URL must be a valid URL starting with http:// or https://');
  }
  if (thumbnailUrl && !isValidURL(thumbnailUrl)) {
    errors.push('Thumbnail URL must be a valid URL starting with http:// or https://');
  }

  // 6. Arrays
  if (techStack !== undefined && !Array.isArray(techStack)) {
    errors.push('Tech Stack must be an array of strings');
  }
  if (achievements !== undefined && !Array.isArray(achievements)) {
    errors.push('Achievements must be an array of strings');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  validateProfile,
  validateUsernameParam,
  validateSkill,
  validateProject,
};

