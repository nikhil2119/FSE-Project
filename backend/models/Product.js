const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cate_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sub_cate_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  prod_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  prod_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  compare_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  prod_desc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  low_stock_threshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Master_products',
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});

// Instance method to check if stock is low
Product.prototype.isLowStock = function() {
  return this.stock <= this.low_stock_threshold;
};

module.exports = Product; 