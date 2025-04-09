const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateUser, isAdmin, isSeller } = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/category/:categoryId', productController.getProductsByCategory);

// Seller routes
router.get('/seller', authenticateUser, isSeller, productController.getSellerProducts);

// Get product by ID (must come after other specific routes)
router.get('/:id', productController.getProductById);

// Protected routes for product management
router.post('/', authenticateUser, productController.createProduct); // Allow any authenticated user to create a product
// Update routes to allow both admins and sellers to manage their products
router.put('/:id', authenticateUser, productController.updateProduct);
router.delete('/:id', authenticateUser, productController.deleteProduct);
router.patch('/:id/stock', authenticateUser, productController.updateStock);

module.exports = router;

