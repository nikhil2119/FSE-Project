const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateUser, isSeller } = require('../middleware/authMiddleware');

// Seller product management routes
router.get('/', authenticateUser, isSeller, productController.getSellerProducts);
router.post('/', authenticateUser, isSeller, async (req, res, next) => {
  // Ensure the seller_id in the request is the authenticated user's ID
  req.body.seller_id = req.user.id;
  return productController.createProduct(req, res, next);
});

router.put('/:id', authenticateUser, isSeller, async (req, res, next) => {
  try {
    // Check if the product belongs to the seller
    const product = await productController.getProductForSeller(req.params.id, req.user.id);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or you do not have permission to modify it'
      });
    }
    
    // Update the product
    req.body.seller_id = req.user.id; // Ensure seller cannot change the seller_id
    return productController.updateProduct(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateUser, isSeller, async (req, res, next) => {
  try {
    // Check if the product belongs to the seller
    const product = await productController.getProductForSeller(req.params.id, req.user.id);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or you do not have permission to delete it'
      });
    }
    
    // Delete the product
    return productController.deleteProduct(req, res, next);
  } catch (error) {
    next(error);
  }
});

module.exports = router; 