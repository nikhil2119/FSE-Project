const express = require('express');
const router = express.Router();
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');
const categoryController = require('../controllers/categoryController');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected admin routes
router.post('/', authenticateUser, isAdmin, categoryController.createCategory);
router.put('/:id', authenticateUser, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateUser, isAdmin, categoryController.deleteCategory);

module.exports = router;

