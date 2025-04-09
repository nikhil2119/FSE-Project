const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

// User routes
router.post('/', authenticateUser, orderController.createOrder);
router.get('/', authenticateUser, orderController.getUserOrders);
router.get('/:id', authenticateUser, orderController.getOrderDetails);
router.post('/:id/cancel', authenticateUser, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', authenticateUser, isAdmin, orderController.getAllOrders);
router.put('/:id/status', authenticateUser, isAdmin, orderController.updateOrderStatus);

module.exports = router; 