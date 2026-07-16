# Sprint 3 - Part 2: Cloudinary Avatar Photo Upload Checklist

- [x] Configure Cloudinary credentials in backend `.env`
- [x] Configure Cloudinary credentials in backend `.env.example`
- [x] Install Multer and Cloudinary in backend
- [x] Create Cloudinary configuration file (`src/config/cloudinary.js`)
- [x] Create Multer memory storage middleware (`src/middleware/uploadMiddleware.js`)
- [x] Update Profile mongoose schema (`src/models/profile.model.js`)
- [x] Implement upload/delete avatar service handlers (`src/services/profile.service.js`)
- [x] Implement controller handlers (`src/controllers/profile.controller.js`)
- [x] Add routes in router (`src/routes/profile.routes.js`)
- [x] Start backend and verify it connects successfully
- [x] Add `uploadAvatar` and `removeAvatar` API helpers to `profileService.js`
- [x] Add Circular Avatar preview & actions UI to `ProfilePage.jsx`
- [x] Connect `Navbar.jsx` to dynamically render user profile image or initials
- [x] Wire `profile` prop to `Navbar` inside `Dashboard.jsx` and `ProfilePage.jsx`
- [x] Verify frontend build passes successfully
- [ ] Manual test: Profile avatar uploading, replacement, deletion, and initials fallback sync
