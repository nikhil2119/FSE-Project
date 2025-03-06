const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Routes
router.get('/', discountController.getAllDiscounts); // Users can view all active discounts
router.post('/', authMiddleware, roleMiddleware(['admin', 'seller']), discountController.createDiscount); // Only admin/seller can create discounts
router.post('/apply', discountController.applyDiscount); // Users can apply discounts
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'seller']), discountController.deleteDiscount); // Only admin/seller can delete discounts

module.exports = router; 