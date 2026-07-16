/**
 * @file uploadMiddleware.js
 * @description Configures Multer storage, size limits, and filters for incoming files.
 * @folder src/middleware/ - Pre-processes and validates incoming requests.
 */

const multer = require('multer');

// Configure memory storage to receive file buffers without saving to disk
const storage = multer.memoryStorage();

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Filter uploaded files by type
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'), false);
  }
};

// Configure Multer instances
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB size limit
  },
  fileFilter: fileFilter,
}).single('avatar'); // Field name must match the frontend payload

/**
 * Express wrapper middleware to parse multer upload and handle its errors gracefully
 */
const handleUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      // Catch Multer errors (e.g. file size exceeded) or custom filter errors
      let errorMessage = err.message;
      if (err.code === 'LIMIT_FILE_SIZE') {
        errorMessage = 'File is too large. Maximum allowed size is 5 MB.';
      }
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
    next();
  });
};

module.exports = {
  handleUpload,
};
