const express = require('express');
const router = express.Router();
const productImageController = require('../controllers/productImageController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');
const { uploadProductImage, uploadMultipleProductImages } = require('../utils/fileUpload');

// Get all images for a product
router.get('/product/:product_id', productImageController.getProductImages);

// Protected routes (admin only)
router.post('/upload', authenticateUser, isAdmin, uploadProductImage, productImageController.uploadImage);
router.post('/upload/multiple', authenticateUser, isAdmin, uploadMultipleProductImages, productImageController.uploadMultipleImages);
router.post('/primary', authenticateUser, isAdmin, productImageController.setPrimaryImage);
router.delete('/:id', authenticateUser, isAdmin, productImageController.deleteImage);

module.exports = router; 