const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

// All cart routes require authentication
router.use(authenticateUser);

// Cart routes
router.post('/', cartController.addToCart);
router.get('/', cartController.getCartItems);
router.put('/', cartController.updateCartItem);
router.delete('/:product_id', cartController.deleteCartItem);

module.exports = router;