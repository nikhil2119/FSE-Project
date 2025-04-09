const Product = require('../models/Product');
const { Op } = require('sequelize');
const Category = require('../models/Category');

// Get all products with pagination and filters
const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      subcategory,
      minPrice,
      maxPrice,
      featured,
      sort = 'created_on',
      order = 'DESC'
    } = req.query;

    const where = { is_enabled: true };
    
    if (search) {
      where[Op.or] = [
        { prod_name: { [Op.like]: `%${search}%` } },
        { prod_desc: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category) where.cate_id = category;
    if (subcategory) where.sub_cate_id = subcategory;
    if (minPrice) where.prod_price = { [Op.gte]: minPrice };
    if (maxPrice) where.prod_price = { ...where.prod_price, [Op.lte]: maxPrice };
    if (featured) where.is_featured = featured === 'true';

    const products = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [[sort, order]],
      paranoid: false
    });

    res.json({
      status: 'success',
      data: {
        products: products.rows,
        total: products.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(products.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID or slug
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        [Op.or]: [
          { id: id },
          { slug: id }
        ],
        is_enabled: true
      },
      paranoid: false
    });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.json({
      status: 'success',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Get single product by ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id: id,
        is_enabled: true
      },
      paranoid: false
    });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.json({
      status: 'success',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category
const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = 'created_on',
      order = 'DESC'
    } = req.query;

    const products = await Product.findAndCountAll({
      where: {
        cate_id: categoryId,
        is_enabled: true
      },
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [[sort, order]],
      paranoid: false
    });

    res.json({
      status: 'success',
      data: {
        products: products.rows,
        total: products.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(products.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new product
const createProduct = async (req, res, next) => {
  try {
    // Make sure seller_id is set for authorization
    if (!req.body.seller_id && req.user && req.user.id) {
      req.body.seller_id = req.user.id;
    } else if (!req.body.seller_id) {
      // Admin creating a product without seller_id
      req.body.seller_id = 1; // Default to the first seller or admin
    }
    
    // Validate required fields
    const requiredFields = ['prod_name', 'prod_price', 'cate_id', 'sub_cate_id', 'sku'];
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if SKU already exists
    const existingProduct = await Product.findOne({ where: { sku: req.body.sku } });
    if (existingProduct) {
      return res.status(400).json({
        status: 'error',
        message: 'A product with this SKU already exists'
      });
    }
    
    // Generate slug if not provided
    if (!req.body.slug && req.body.prod_name) {
      req.body.slug = req.body.prod_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    // Check if slug already exists
    const existingSlug = await Product.findOne({ where: { slug: req.body.slug } });
    if (existingSlug) {
      req.body.slug = `${req.body.slug}-${Date.now()}`;
    }
    
    // Validate category exists
    const category = await Category.findByPk(req.body.cate_id);
    if (!category) {
      return res.status(400).json({
        status: 'error',
        message: `Category with ID ${req.body.cate_id} does not exist`
      });
    }
    
    // Validate subcategory exists and belongs to the selected category
    const subcategory = await Category.findOne({
      where: {
        id: req.body.sub_cate_id,
        parent_id: req.body.cate_id
      }
    });
    
    if (!subcategory) {
      return res.status(400).json({
        status: 'error',
        message: `Subcategory with ID ${req.body.sub_cate_id} does not exist or does not belong to the selected category`
      });
    }
    
    console.log('Creating product with data:', req.body);
    
    const product = await Product.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    
    // Check for validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation error',
        errors: validationErrors
      });
    }
    
    // Check for unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      const value = error.errors[0].value;
      return res.status(400).json({
        status: 'error',
        message: `The ${field} "${value}" is already in use.`
      });
    }
    
    // Check for foreign key constraint errors
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid category or subcategory ID. Please make sure both exist in the database.'
      });
    }
    
    // For other database errors
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(500).json({
        status: 'error',
        message: 'Database error: ' + error.message
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: 'Failed to create product: ' + error.message
    });
  }
};

// Update product
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    await product.update(req.body);

    res.json({
      status: 'success',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    await product.destroy();

    res.json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Update product stock
const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    const newStock = product.stock + parseInt(quantity);
    if (newStock < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient stock'
      });
    }

    await product.update({ stock: newStock });

    res.json({
      status: 'success',
      data: {
        product,
        isLowStock: newStock <= product.low_stock_threshold
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all products for a seller
const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: { seller_id: sellerId },
      limit,
      offset,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Helper function to get a product for a specific seller
const getProductForSeller = async (productId, sellerId) => {
  try {
    const product = await Product.findOne({
      where: {
        id: productId,
        seller_id: sellerId
      }
    });
    return product;
  } catch (error) {
    console.error('Error finding product for seller:', error);
    return null;
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  getSellerProducts,
  getProductForSeller
};

