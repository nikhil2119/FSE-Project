const express = require('express');
const router = express.Router();
const productImageController = require('../controllers/productImageController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Routes
router.get('/product/:product_id', productImageController.getAllImagesForProduct); // Get all images for a specific product
router.post('/', authMiddleware, roleMiddleware(['admin', 'seller']), productImageController.addImageForProduct); // Only admin/seller can add images
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'seller']), productImageController.deleteImage); // Only admin/seller can delete images

module.exports = router; 