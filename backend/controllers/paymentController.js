const db = require("../config/db");

// Utility function for sending error responses
const sendErrorResponse = (res, status, message) => {
    res.status(status).json({ message });
};

// Get all payments
const getAllPayments = async (req, res) => {
    try {
        const [payments] = await db.query("SELECT * FROM Payments");
        res.status(200).json({ payments });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return sendErrorResponse(res, 400, "Payment ID is required");
    }

    try {
        const [payment] = await db.query("SELECT * FROM Payments WHERE id = ?", [id]);
        if (payment.length === 0) {
            return sendErrorResponse(res, 404, "Payment not found");
        }
        res.status(200).json({ payment: payment[0] });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

// Add payment
const addPayment = async (req, res) => {
    const { order_id, user_id, payment_method, status } = req.body;

    if (!order_id || !user_id || !payment_method || !status) {
        return sendErrorResponse(res, 400, "Order ID, User ID, Payment Method, and Status are required");
    }

    try {
        const [result] = await db.query("INSERT INTO Payments (order_id, user_id, payment_method, status) VALUES (?, ?, ?, ?)", [order_id, user_id, payment_method, status]);
        res.status(201).json({
            id: result.insertId,
            message: "Payment created successfully",
            payment: {
                id: result.insertId,
                order_id,
                user_id,
                payment_method,
                status
            }
        });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

// Delete payment
const deletePayment = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return sendErrorResponse(res, 400, "Payment ID is required");
    }

    try {
        const [result] = await db.query("DELETE FROM Payments WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return sendErrorResponse(res, 404, "Payment not found");
        }
        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

module.exports = {
    getAllPayments,
    getPaymentById,
    addPayment,
    deletePayment,
}; 