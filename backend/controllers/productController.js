const Product = require('../models/Product');
const { Op } = require('sequelize');

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

// Create new product
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: product
    });
  } catch (error) {
    next(error);
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

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
};

