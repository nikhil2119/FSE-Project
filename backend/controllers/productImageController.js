const { Product, ProductImage } = require('../models');
const fs = require('fs');
const path = require('path');

// Utility function for sending error responses
const sendErrorResponse = (res, status, message) => {
    res.status(status).json({ message });
};

// Upload single product image
const uploadImage = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded' });
        }

        const { product_id } = req.body;

        // Validate product_id
        if (!product_id) {
            // Remove the uploaded file if product_id is missing
            if (req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            // Remove the uploaded file if product doesn't exist
            if (req.file.path) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create relative path for database storage
        const relativePath = path.relative(
            path.join(__dirname, '..'),
            req.file.path
        ).replace(/\\/g, '/'); // Convert Windows backslashes to forward slashes

        // Create product image record
        const productImage = await ProductImage.create({
            product_id,
            image_path: relativePath,
            is_primary: false // Default to false, can be updated later
        });

        res.status(201).json({
            message: 'Product image uploaded successfully',
            productImage
        });
    } catch (error) {
        // Clean up uploaded file in case of error
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: error.message });
    }
};

// Upload multiple product images
const uploadMultipleImages = async (req, res) => {
    try {
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No image files uploaded' });
        }

        const { product_id } = req.body;

        // Validate product_id
        if (!product_id) {
            // Remove all uploaded files if product_id is missing
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    if (file.path) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            // Remove all uploaded files if product doesn't exist
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                    if (file.path) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
            return res.status(404).json({ message: 'Product not found' });
        }

        // Create product image records
        const productImages = [];
        for (const file of req.files) {
            // Create relative path for database storage
            const relativePath = path.relative(
                path.join(__dirname, '..'),
                file.path
            ).replace(/\\/g, '/'); // Convert Windows backslashes to forward slashes

            const productImage = await ProductImage.create({
                product_id,
                image_path: relativePath,
                is_primary: false // Default to false, can be updated later
            });

            productImages.push(productImage);
        }

        res.status(201).json({
            message: 'Product images uploaded successfully',
            productImages
        });
    } catch (error) {
        // Clean up uploaded files in case of error
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (file.path) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// Set primary image
const setPrimaryImage = async (req, res) => {
    try {
        const { image_id, product_id } = req.body;

        // Validate input
        if (!image_id || !product_id) {
            return res.status(400).json({ message: 'Image ID and Product ID are required' });
        }

        // Check if product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if image exists and belongs to product
        const image = await ProductImage.findOne({
            where: { id: image_id, product_id }
        });

        if (!image) {
            return res.status(404).json({ message: 'Image not found or does not belong to product' });
        }

        // Reset all images for this product
        await ProductImage.update(
            { is_primary: false },
            { where: { product_id } }
        );

        // Set the selected image as primary
        image.is_primary = true;
        await image.save();

        // Update product image path
        product.image_path = image.image_path;
        await product.save();

        res.status(200).json({
            message: 'Primary image set successfully',
            image
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete product image
const deleteImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await ProductImage.findByPk(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // Get file path
        const filePath = path.join(__dirname, '..', image.image_path);

        // Delete from filesystem if the file exists
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // If this is the primary image, update the product
        if (image.is_primary) {
            const product = await Product.findByPk(image.product_id);
            if (product) {
                product.image_path = null;
                await product.save();
            }
        }

        // Delete from database
        await image.destroy();

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all images for a product
const getProductImages = async (req, res) => {
    try {
        const { product_id } = req.params;

        const images = await ProductImage.findAll({
            where: { product_id },
            order: [['is_primary', 'DESC']]
        });

        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadImage,
    uploadMultipleImages,
    setPrimaryImage,
    deleteImage,
    getProductImages
}; 