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
        if (!skill.name || skill.name.trim() === '') {
          errors.push(`Skill name at index ${index} is required`);
        } else {
          const lowerName = skill.name.trim().toLowerCase();
          if (skillNames.has(lowerName)) {
            errors.push(`Duplicate skill name found: '${skill.name.trim()}'`);
          }
          skillNames.add(lowerName);
        }

        if (!skill.level || skill.level.trim() === '') {
          errors.push(`Skill level for '${skill.name || index}' is required`);
        } else if (!['Beginner', 'Intermediate', 'Expert'].includes(skill.level.trim())) {
          errors.push(`Invalid skill level for '${skill.name || index}'. Must be Beginner, Intermediate, or Expert`);
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

        if (proj.githubLink && !isValidURL(proj.githubLink)) {
          errors.push(`GitHub Link for project '${proj.title || index}' must be a valid URL`);
        }

        if (proj.liveDemo && !isValidURL(proj.liveDemo)) {
          errors.push(`Live Demo link for project '${proj.title || index}' must be a valid URL`);
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

module.exports = {
  validateProfile,
  validateUsernameParam,
};
