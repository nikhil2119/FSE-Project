const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Public routes
router.get('/', getAllCategories); // Allow public access to view categories

// Protected admin routes
router.post('/', authMiddleware, roleMiddleware(['admin']), createCategory);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateCategory);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteCategory);

module.exports = router;

