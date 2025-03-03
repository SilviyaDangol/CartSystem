const express = require('express');
const productSoldController = require('../controllers/productSoldController');

const router = express.Router();

// Insert a new product sold record
router.post('/create', productSoldController.create);

// Get all products sold
router.get('/all', productSoldController.findAll);

// Get a single product sold record by ID
router.get('/:id', productSoldController.findOne);

// Update a product sold record
router.put('/:id', productSoldController.update);

// Delete a product sold record
router.delete('/:id', productSoldController.delete);

module.exports = router;
