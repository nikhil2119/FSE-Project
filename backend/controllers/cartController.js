const { Cart, Product } = require('../models');

// Add to cart
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.user.id;

        // Check if product exists in cart
        let cartItem = await Cart.findOne({
            where: { user_id, product_id }
        });

        if (cartItem) {
            // Update quantity if product already in cart
            cartItem.quantity += parseInt(quantity);
            await cartItem.save();
        } else {
            // Create new cart item
            cartItem = await Cart.create({
                user_id,
                product_id,
                quantity
            });
        }

        res.status(200).json({
            message: 'Product added to cart',
            cartItem
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get cart items
const getCartItems = async (req, res) => {
    try {
        const user_id = req.user.id;
        const cartItems = await Cart.findAll({
            where: { user_id },
            include: [{
                model: Product,
                attributes: ['id', 'prod_name', 'prod_price', 'image_path']
            }]
        });

        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update cart item
const updateCartItem = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.user.id;

        const cartItem = await Cart.findOne({
            where: { user_id, product_id }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({
            message: 'Cart item updated',
            cartItem
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete cart item
const deleteCartItem = async (req, res) => {
    try {
        const { product_id } = req.params;
        const user_id = req.user.id;

        const cartItem = await Cart.findOne({
            where: { user_id, product_id }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartItem.destroy();

        res.status(200).json({ message: 'Cart item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToCart, getCartItems, updateCartItem, deleteCartItem };