const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../middleware/multer'); // Import multer middleware

const router = express.Router();

// Create a new user (with image upload)
router.post('/create', upload.single('image'), userController.create);

// Get all users
router.get('/all', userController.findAll);

// Get user by ID
router.get('/:id', userController.findOne);

// Update user's profile picture (image upload)
router.put('/:id/profile-picture', upload.single('image'), userController.updateProfilePicture);

// Update username
router.put('/:id/username', userController.updateUsername);

// Update password
router.put('/:id/password', userController.updatePassword);

// Update user details (full name, address, phone)
router.put('/:id/details', userController.updateUserDetails);

// Delete user by ID
router.delete('/:id', userController.delete);

module.exports = router;
