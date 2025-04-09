const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Protected routes (admin only)
router.post('/', authenticateUser, isAdmin, productController.createProduct);
router.put('/:id', authenticateUser, isAdmin, productController.updateProduct);
router.delete('/:id', authenticateUser, isAdmin, productController.deleteProduct);
router.patch('/:id/stock', authenticateUser, isAdmin, productController.updateStock);

module.exports = router;

