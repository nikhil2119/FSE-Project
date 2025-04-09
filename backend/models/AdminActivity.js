const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Admin = require('./Admin');

const AdminActivity = sequelize.define('AdminActivity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Admin,
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  entity_type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  entity_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'AdminActivities',
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_at'
});

// Define relationship with Admin model
AdminActivity.belongsTo(Admin, {
  foreignKey: 'admin_id',
  as: 'admin'
});

Admin.hasMany(AdminActivity, {
  foreignKey: 'admin_id',
  as: 'activities'
});

module.exports = AdminActivity; 