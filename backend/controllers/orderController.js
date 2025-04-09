const { Order, OrderItem, Product, UserAddress, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Create a new order
const createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { 
            shipping_address_id, 
            billing_address_id,
            cart_items,
            payment_method,
            notes
        } = req.body;
        
        const user_id = req.user.id;
        
        // Validation
        if (!shipping_address_id || !billing_address_id || !cart_items || !cart_items.length) {
            return res.status(400).json({ 
                message: 'Shipping address, billing address, and cart items are required' 
            });
        }
        
        // Check if addresses exist and belong to the user
        const shippingAddress = await UserAddress.findOne({ 
            where: { id: shipping_address_id, user_id }
        });
        
        const billingAddress = await UserAddress.findOne({ 
            where: { id: billing_address_id, user_id }
        });
        
        if (!shippingAddress || !billingAddress) {
            return res.status(404).json({ message: 'Address not found or does not belong to user' });
        }
        
        // Calculate order totals
        let total_price = 0;
        let discount_amount = 0;
        let tax_amount = 0;
        let shipping_amount = 5.99; // Default shipping fee
        
        // Generate order items and calculate totals
        const orderItems = [];
        for (const item of cart_items) {
            const product = await Product.findByPk(item.product_id);
            
            if (!product) {
                await transaction.rollback();
                return res.status(404).json({ 
                    message: `Product with ID ${item.product_id} not found` 
                });
            }
            
            const price = product.prod_price;
            const quantity = item.quantity;
            const item_total = price * quantity;
            
            // For simplicity, calculating tax as 7% of the price
            const item_tax = item_total * 0.07; 
            
            total_price += item_total;
            tax_amount += item_tax;
            
            orderItems.push({
                product_id: product.id,
                quantity: quantity,
                price: price,
                discount_amount: 0, // No discounts in this basic version
                tax_amount: item_tax,
                final_price: item_total + item_tax
            });
        }
        
        const final_price = total_price + tax_amount + shipping_amount - discount_amount;
        
        // Create the order
        const order = await Order.create({
            user_id,
            order_number: `ORD-${Date.now()}-${uuidv4().substring(0, 8)}`,
            total_price,
            discount_amount,
            shipping_amount,
            tax_amount,
            final_price,
            status: 'Pending',
            payment_status: 'Pending',
            shipping_address_id,
            billing_address_id,
            notes
        }, { transaction });
        
        // Create order items
        for (const item of orderItems) {
            await OrderItem.create({
                order_id: order.id,
                ...item
            }, { transaction });
        }
        
        await transaction.commit();
        
        res.status(201).json({
            message: 'Order created successfully',
            order_id: order.id,
            order_number: order.order_number
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: error.message });
    }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
    try {
        const user_id = req.user.id;
        
        const orders = await Order.findAll({
            where: { user_id },
            attributes: ['id', 'order_number', 'final_price', 'status', 'payment_status', 'created_on'],
            order: [['created_on', 'DESC']]
        });
        
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order details by ID
const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        
        const order = await Order.findOne({
            where: { id, user_id },
            include: [
                {
                    model: OrderItem,
                    include: [{
                        model: Product,
                        attributes: ['id', 'prod_name', 'prod_price', 'image_path']
                    }]
                },
                {
                    model: UserAddress,
                    as: 'shippingAddress',
                    attributes: ['id', 'address_line1', 'address_line2', 'city_id', 'state_id', 'zipcode']
                },
                {
                    model: UserAddress,
                    as: 'billingAddress',
                    attributes: ['id', 'address_line1', 'address_line2', 'city_id', 'state_id', 'zipcode']
                }
            ]
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (for admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, payment_status } = req.body;
        
        const order = await Order.findByPk(id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        if (status) {
            if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }
            order.status = status;
        }
        
        if (payment_status) {
            if (!['Pending', 'Paid', 'Failed', 'Refunded'].includes(payment_status)) {
                return res.status(400).json({ message: 'Invalid payment status value' });
            }
            order.payment_status = payment_status;
        }
        
        await order.save();
        
        res.status(200).json({
            message: 'Order updated successfully',
            order: {
                id: order.id,
                status: order.status,
                payment_status: order.payment_status
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel an order
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        
        const order = await Order.findOne({
            where: { id, user_id }
        });
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Only allow cancellation if order is in Pending or Processing state
        if (order.status !== 'Pending' && order.status !== 'Processing') {
            return res.status(400).json({ 
                message: 'Cannot cancel order. Order must be in Pending or Processing state' 
            });
        }
        
        order.status = 'Cancelled';
        await order.save();
        
        res.status(200).json({
            message: 'Order cancelled successfully',
            order_id: order.id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        
        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        
        const { count, rows: orders } = await Order.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_on', 'DESC']],
            include: [{
                model: User,
                attributes: ['id', 'user_name', 'user_email']
            }]
        });
        
        res.status(200).json({
            orders,
            totalOrders: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderDetails,
    updateOrderStatus,
    cancelOrder,
    getAllOrders
}; 