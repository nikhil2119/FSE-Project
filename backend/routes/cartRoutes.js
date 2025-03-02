const express = require('express');
const router = express.Router();
const { addToCart, getCartItems, updateCartItem, deleteCartItem } = require('../controllers/cartController');

//add to cart
router.post('/add', addToCart);

//get cart items
router.get('/:user_id', getCartItems);

//update cart item
router.put('/update', updateCartItem);

//delete cart item
router.delete('/delete', deleteCartItem);

module.exports = router;