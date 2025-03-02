const db = require('../config/db');

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.user.id;

        // Enhanced input validation
        if (!product_id || !Number.isInteger(product_id) || product_id <= 0) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive integer' });
        }
        if (!user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Check if product exists in Products table
        const [product] = await db.query(
            'SELECT id, stock_quantity FROM Products WHERE id = ?',
            [product_id]
        );

        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if there's enough stock
        if (product[0].stock_quantity < quantity) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }

        // Check if the product already exists in the user's cart
        const [rows] = await db.query(
            'SELECT quantity FROM Cart WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );

        // Start transaction
        await db.query('START TRANSACTION');

        try {
            if (rows.length > 0) {
                const newQuantity = rows[0].quantity + quantity;
                
                // Check if new total quantity exceeds stock
                if (newQuantity > product[0].stock_quantity) {
                    await db.query('ROLLBACK');
                    return res.status(400).json({ message: 'Total quantity exceeds available stock' });
                }

                // Update quantity if the product already exists in the cart
                await db.query(
                    'UPDATE Cart SET quantity = ?, added_on = CURRENT_TIMESTAMP WHERE user_id = ? AND product_id = ?',
                    [newQuantity, user_id, product_id]
                );
            } else {
                // Add new item to the cart
                await db.query(
                    'INSERT INTO Cart (user_id, product_id, quantity, added_on) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
                    [user_id, product_id, quantity]
                );
            }

            await db.query('COMMIT');
            res.status(201).json({ message: 'Item added to cart successfully' });
        } catch (error) {
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user's cart
const getCart = async (req, res) => {
    try {
        const user_id = req.user.id;

        if (!user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Fetch all items in the user's cart with product details and stock information
        const [rows] = await db.query(
            `SELECT 
                Cart.*,
                Products.name,
                Products.price,
                Products.image_url,
                Products.stock_quantity,
                (Products.stock_quantity >= Cart.quantity) as is_available
            FROM Cart 
            JOIN Products ON Cart.product_id = Products.id 
            WHERE Cart.user_id = ?
            ORDER BY Cart.added_on DESC`,
            [user_id]
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { product_id } = req.body;
        const user_id = req.user.id;

        // Enhanced input validation
        if (!product_id || !Number.isInteger(product_id) || product_id <= 0) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        if (!user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Check if item exists before deletion
        const [existingItem] = await db.query(
            'SELECT id FROM Cart WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );

        if (existingItem.length === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Delete the item from the cart
        const [result] = await db.query(
            'DELETE FROM Cart WHERE user_id = ? AND product_id = ?',
            [user_id, product_id]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ message: 'Failed to remove item from cart' });
        }

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update cart item quantity
const updateCartItemQuantity = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const user_id = req.user.id;

        // Input validation
        if (!product_id || !Number.isInteger(product_id) || product_id <= 0) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive integer' });
        }
        if (!user_id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Check product stock
        const [product] = await db.query(
            'SELECT stock_quantity FROM Products WHERE id = ?',
            [product_id]
        );

        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (quantity > product[0].stock_quantity) {
            return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
        }

        // Update the quantity
        const [result] = await db.query(
            'UPDATE Cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [quantity, user_id, product_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.status(200).json({ message: 'Cart item quantity updated successfully' });
    } catch (error) {
        console.error('Error in updateCartItemQuantity:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItemQuantity
};