const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const SubCategory = sequelize.define('SubCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cate_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  },
  sub_cate_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  sub_cate_desc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  image_path: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Master_SubCat',
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});

// Define relationship
SubCategory.belongsTo(Category, { foreignKey: 'cate_id' });
Category.hasMany(SubCategory, { foreignKey: 'cate_id' });

module.exports = SubCategory; 