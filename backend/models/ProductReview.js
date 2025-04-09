const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const User = require('./User');

const ProductReview = sequelize.define('ProductReview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  review_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_verified_purchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Prod_reviews',
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});

// Define relationships
ProductReview.belongsTo(Product, { foreignKey: 'product_id' });
ProductReview.belongsTo(User, { foreignKey: 'user_id' });
Product.hasMany(ProductReview, { foreignKey: 'product_id' });
User.hasMany(ProductReview, { foreignKey: 'user_id' });

module.exports = ProductReview; 