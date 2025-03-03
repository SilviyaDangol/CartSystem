const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new order
router.post('/create', orderController.create);

// Get user's orders
router.get('/my-orders', orderController.getUserOrders);

// Get a single order by ID
router.get('/:id', orderController.getOrderById);

// Update order status (admin only)
router.put('/:id/status', orderController.updateOrderStatus);

// Get all orders (admin only)
router.get('/', orderController.getAllOrders);

module.exports = router;