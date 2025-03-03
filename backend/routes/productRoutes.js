const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middleware/multer'); // Import multer middleware
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware'); // Import authentication middleware

const router = express.Router();

// Create a new product (with image upload) - Admin only
router.post('/create', authenticate, authorizeAdmin, upload.single('image'), productController.create);

// Get all products - Accessible by anyone
router.get('/all', productController.findAll);

// Get a single product by ID - Accessible by anyone
router.get('/:id', productController.findOne);

// Update a product (with optional image upload) - Admin only
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), productController.update);

// Delete a product by ID - Admin only
router.delete('/:id', authenticate, authorizeAdmin, productController.delete);

module.exports = router;
