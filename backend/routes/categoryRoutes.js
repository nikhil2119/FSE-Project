const express = require('express');
const router = express.Router();

const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

// Public routes
router.get('/', getAllCategories); // Allow public access to view categories

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

