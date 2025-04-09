const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  user_email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  user_pwd: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  user_age: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'seller', 'user'),
    defaultValue: 'user'
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Users',
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});

// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.user_pwd) {
    user.user_pwd = await bcrypt.hash(user.user_pwd, 10);
  }
});

// Instance method to check password
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.user_pwd);
};

module.exports = User; 