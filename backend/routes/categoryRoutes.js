const express = require('express');
const categoryController = require('../controllers/categoryController'); // Corrected import

const router = express.Router();

// Create a new category
router.post('/create', categoryController.create);

// Get all categories
router.get('/all', categoryController.findAll);

// Get category by ID
router.get('/:id', categoryController.findOne);

// Update a category
router.put('/:id', categoryController.update);

// Delete category by ID
router.delete('/:id', categoryController.delete);

module.exports = router;