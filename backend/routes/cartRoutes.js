const express = require('express');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

const router = express.Router();

// All cart routes should be protected with authentication
router.use(authenticate);

// Add item to cart
router.post('/add', cartController.addToCart);

// Get user's cart items
router.get('/my-cart', cartController.getUserCart);

// Update cart item quantity
router.put('/item/:id', cartController.updateQuantity);

// Remove item from cart
router.delete('/item/:id', cartController.removeItem);

// Clear entire cart
router.delete('/clear', cartController.clearCart);

module.exports = router;