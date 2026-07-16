/**
 * @file profile.routes.js
 * @description Declares endpoints related to user profiles, applying validation and authentication middleware where required.
 * @folder src/routes/ - Defines endpoint URLs and maps them to controllers.
 */

const express = require('express');
const router = express.Router();

const profileController = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateProfile, validateUsernameParam } = require('../validators/profile.validator');
const { handleUpload } = require('../middleware/uploadMiddleware');

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

// 7. Public Route: Fetch any user's profile by username
router.get('/:username', validateUsernameParam, profileController.getPublicProfile);

module.exports = router;
