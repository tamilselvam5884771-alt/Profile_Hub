/**
 * @file profile.routes.js
 * @description Declares endpoints related to user profiles, applying validation and authentication middleware where required.
 * @folder src/routes/ - Defines endpoint URLs and maps them to controllers.
 */

const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateProfile, validateUsernameParam, validateSkill, validateProject } = require('../validators/profile.validator');
const { handleUpload, handleProjectThumbnailUpload } = require('../middleware/uploadMiddleware');

// 1. Private Route: Create a new profile
router.post('/', protect, validateProfile, profileController.createProfile);

// 2. Private Route: Fetch current user's profile
router.get('/me', protect, profileController.getMyProfile);

// 3. Private Route: Update current user's profile
router.put('/me', protect, validateProfile, profileController.updateProfile);

// 4. Private Route: Delete current user's profile
router.delete('/me', protect, profileController.deleteProfile);

// 5. Private Route: Upload profile avatar
router.post('/avatar', protect, handleUpload, profileController.uploadAvatar);

// 6. Private Route: Delete profile avatar
router.delete('/avatar', protect, profileController.deleteAvatar);

// ── Skills Sub-Routes ──────────────────────────────────────────────────────
// 8. Private Route: Get all skills
router.get('/me/skills', protect, profileController.getSkills);

// 9. Private Route: Add a new skill
router.post('/me/skills', protect, validateSkill, profileController.addSkill);

// 10. Private Route: Update a skill by ID
router.put('/me/skills/:skillId', protect, validateSkill, profileController.updateSkill);

// 11. Private Route: Delete a skill by ID
router.delete('/me/skills/:skillId', protect, profileController.deleteSkill);

// ── Projects Sub-Routes ────────────────────────────────────────────────────
// 12. Private Route: Get all projects
router.get('/me/projects', protect, profileController.getProjects);

// 13. Private Route: Add a new project
router.post('/me/projects', protect, validateProject, profileController.addProject);

// 14. Private Route: Update a project by ID
router.put('/me/projects/:projectId', protect, validateProject, profileController.updateProject);

// 15. Private Route: Delete a project by ID
router.delete('/me/projects/:projectId', protect, profileController.deleteProject);

// 16. Private Route: Upload project thumbnail
router.post('/me/projects/thumbnail', protect, handleProjectThumbnailUpload, profileController.uploadProjectThumbnail);
// ──────────────────────────────────────────────────────────────────────────

// 7. Public Route: Fetch any user's profile by username
router.get('/:username', validateUsernameParam, profileController.getPublicProfile);

module.exports = router;

