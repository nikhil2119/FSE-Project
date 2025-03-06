const db = require("../config/db");

// Utility function for sending error responses
const sendErrorResponse = (res, status, message) => {
    res.status(status).json({ message });
};

// Get all discounts
const getAllDiscounts = async (req, res) => {
    try {
        const [discounts] = await db.query("SELECT * FROM Discounts WHERE is_active = true");
        res.status(200).json({ discounts });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

// Create a new discount
const createDiscount = async (req, res) => {
    const { code, description, discount_type, discount_value, start_date, end_date } = req.body;

    if (!code || !discount_type || !discount_value || !start_date || !end_date) {
        return sendErrorResponse(res, 400, "All fields are required");
    }

    try {
        const [result] = await db.query(
            "INSERT INTO Discounts (code, description, discount_type, discount_value, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [code, description, discount_type, discount_value, start_date, end_date, req.user.id]
        );

        res.status(201).json({
            id: result.insertId,
            message: "Discount created successfully",
            discount: {
                id: result.insertId,
                code,
                description,
                discount_type,
                discount_value,
                start_date,
                end_date
            }
        });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

// Apply a discount
const applyDiscount = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return sendErrorResponse(res, 400, "Discount code is required");
    }

    try {
        const [discount] = await db.query("SELECT * FROM Discounts WHERE code = ? AND is_active = true", [code]);

        if (discount.length === 0) {
            return sendErrorResponse(res, 404, "Discount not found or inactive");
        }

        res.status(200).json({ discount: discount[0] });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

// Delete a discount (admin/seller only)
const deleteDiscount = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return sendErrorResponse(res, 400, "Discount ID is required");
    }

    try {
        const [result] = await db.query("UPDATE Discounts SET is_active = false WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return sendErrorResponse(res, 404, "Discount not found");
        }

        res.status(200).json({ message: "Discount deleted successfully" });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

module.exports = {
    getAllDiscounts,
    createDiscount,
    applyDiscount,
    deleteDiscount,
}; 