const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { 
    addToCart, 
    getCart, 
    removeFromCart, 
    updateCartItemQuantity 
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(authMiddleware);

// Cart routes
router.post('/add', addToCart);
router.get('/', getCart);
router.delete('/remove', removeFromCart);
router.put('/update', updateCartItemQuantity);

module.exports = router; 