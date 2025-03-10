const db = require("../config/db");

// Utility function for sending error responses
const sendErrorResponse = (res, status, message) => {
    res.status(status).json({ message });
};

// Get all images for a product
const getAllImagesForProduct = async (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
        return sendErrorResponse(res, 400, "Product ID is required");
    }

    try {
        const [images] = await db.query("SELECT * FROM Product_images WHERE product_id = ?", [product_id]);
        res.status(200).json({ images });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

// Add a new image for a product
const addImageForProduct = async (req, res) => {
    const { product_id, image_path } = req.body;

    if (!product_id || !image_path) {
        return sendErrorResponse(res, 400, "Product ID and Image Path are required");
    }

    const date = new Date();
    const formattedDate = date.toISOString().split('T')[0];

    try {
        const [result] = await db.query("INSERT INTO Product_images (product_id, image_path, created_on) VALUES (?, ?, ?)", [product_id, image_path, formattedDate]);
        res.status(201).json({
            id: result.insertId,
            message: "Image added successfully",
            image: {
                id: result.insertId,
                product_id,
                image_path,
                created_on: formattedDate
            }
        });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

// Delete an image
const deleteImage = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return sendErrorResponse(res, 400, "Image ID is required");
    }

    try {
        const [result] = await db.query("DELETE FROM Product_images WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return sendErrorResponse(res, 404, "Image not found");
        }
        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        sendErrorResponse(res, 500, error.message);
    }
};

module.exports = {
    getAllImagesForProduct,
    addImageForProduct,
    deleteImage,
}; 