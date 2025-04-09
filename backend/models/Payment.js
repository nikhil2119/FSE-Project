const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./Order');
const User = require('./User');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
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
  payment_method: {
    type: DataTypes.ENUM('Credit Card', 'Debit Card', 'PayPal', 'COD', 'UPI', 'Net Banking'),
    defaultValue: 'COD'
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Completed', 'Failed', 'Refunded'),
    defaultValue: 'Pending'
  },
  payment_details: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'Payments',
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_at',
  deletedAt: false
});

// Define relationships
Payment.belongsTo(Order, { foreignKey: 'order_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });
Order.hasMany(Payment, { foreignKey: 'order_id' });
User.hasMany(Payment, { foreignKey: 'user_id' });

module.exports = Payment; 