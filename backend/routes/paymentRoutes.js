const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Routes
router.get('/', authMiddleware, paymentController.getAllPayments);
router.get('/:id', authMiddleware, paymentController.getPaymentById);
router.post('/', authMiddleware, roleMiddleware(['admin']), paymentController.addPayment);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), paymentController.deletePayment);

module.exports = router; 