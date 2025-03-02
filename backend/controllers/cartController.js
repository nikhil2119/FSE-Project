const db = require('../config/db');

//add to cart
const addToCart = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    const query = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
    const result = await db.query(query, [user_id, product_id, quantity]);
    res.status(200).json({ message: 'Product added to cart' });
};

//get cart items
const getCartItems = async (req, res) => {
    const { user_id } = req.params;
    const query = `SELECT * FROM cart WHERE user_id = ?`;
    const result = await db.query(query, [user_id]);
    res.status(200).json(result.rows);
};     

//update cart item
const updateCartItem = async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    const query = `UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?`;
    const result = await db.query(query, [quantity, user_id, product_id]);
    res.status(200).json({ message: 'Cart item updated' });
};

//delete cart item
const deleteCartItem = async (req, res) => {
    const { user_id, product_id } = req.params;
    const query = `DELETE FROM cart WHERE user_id = ? AND product_id = ?`;
    const result = await db.query(query, [user_id, product_id]);
    res.status(200).json({ message: 'Cart item deleted' });
};

module.exports = { addToCart, getCartItems, updateCartItem, deleteCartItem };