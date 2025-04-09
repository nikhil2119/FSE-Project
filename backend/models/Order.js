const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const UserAddress = require('./UserAddress');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  shipping_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  final_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'),
    defaultValue: 'Pending'
  },
  payment_status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded'),
    defaultValue: 'Pending'
  },
  shipping_address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserAddress,
      key: 'id'
    }
  },
  billing_address_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserAddress,
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Orders',
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});

// Define relationships
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(UserAddress, { foreignKey: 'shipping_address_id', as: 'shippingAddress' });
Order.belongsTo(UserAddress, { foreignKey: 'billing_address_id', as: 'billingAddress' });
User.hasMany(Order, { foreignKey: 'user_id' });
UserAddress.hasMany(Order, { foreignKey: 'shipping_address_id', as: 'shippingOrders' });
UserAddress.hasMany(Order, { foreignKey: 'billing_address_id', as: 'billingOrders' });

module.exports = Order; 