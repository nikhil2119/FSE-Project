const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Public routes
router.get('/', getAllCategories); // Allow public access to view categories

// Protected admin routes
router.post('/', [authMiddleware, adminMiddleware], createCategory);
router.put('/:id', [authMiddleware, adminMiddleware], updateCategory);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteCategory);

module.exports = router;

