const Category = require('../models/Category');
const { Op } = require('sequelize');

// Get all categories
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { is_enabled: true },
      order: [['name', 'ASC']]
    });
    
    res.json({
      status: 'success',
      categories: categories
    });
  } catch (error) {
    next(error);
  }
};

// Get category by ID
const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findOne({
      where: {
        id: id,
        is_enabled: true
      }
    });

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }

    res.json({
      status: 'success',
      category: category
    });
  } catch (error) {
    next(error);
  }
};

// Create new category
const createCategory = async (req, res, next) => {
  try {
    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({
      where: { name: req.body.name }
    });

    if (existingCategory) {
      return res.status(400).json({
        status: 'error',
        message: 'A category with this name already exists'
      });
    }

    const category = await Category.create({
      ...req.body,
      is_enabled: true
    });
    
    res.status(201).json({
      status: 'success',
      category: category
    });
  } catch (error) {
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: error.errors.map(err => err.message)
      });
    }
    
    // Handle other Sequelize errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        status: 'error',
        message: 'A category with this name already exists'
      });
    }
    
    // Log the error for debugging
    console.error('Category creation error:', error);
    
    // Pass to error handler
    next(error);
  }
};

// Update category
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }

    await category.update(req.body);

    res.json({
      status: 'success',
      category: category
    });
  } catch (error) {
    next(error);
  }
};

// Delete category
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }

    // Soft delete
    await category.update({ is_enabled: false });

    res.json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Seed categories if none exist
const seedCategories = async () => {
  const count = await Category.count();
  if (count === 0) {
    console.log('Seeding initial categories...');
    const defaultCategories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets', is_featured: true },
      { name: 'Clothing', description: 'Apparel and fashion items', is_featured: true },
      { name: 'Home & Kitchen', description: 'Products for your home', is_featured: true },
      { name: 'Books', description: 'Books and e-books', is_featured: false },
      { name: 'Beauty', description: 'Beauty and personal care products', is_featured: false },
      { name: 'Sports', description: 'Sports equipment and accessories', is_featured: false }
    ];
    
    try {
      await Category.bulkCreate(defaultCategories);
      console.log('Categories seeded successfully');
    } catch (error) {
      console.error('Error seeding categories:', error);
    }
  }
};

// Call the seed function when this module is loaded
seedCategories();

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
