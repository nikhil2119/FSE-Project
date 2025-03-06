const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Get all products
router.get("/", productController.getAllProducts);

// Get product by ID
router.get("/:id", productController.getProductById);

// Add product (admin only)
router.post("/", authMiddleware, roleMiddleware(['admin']), productController.addProduct);

// Update product (admin only)
router.put("/:id", authMiddleware, roleMiddleware(['admin']), productController.updateProduct);

// Delete product (admin only)
router.delete("/:id", authMiddleware, roleMiddleware(['admin']), productController.deleteProduct);

module.exports = router;

