const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const State = require('./State');

const City = sequelize.define('City', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  state_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Master_city',
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});

// Define relationship
City.belongsTo(State, { foreignKey: 'state_id' });
State.hasMany(City, { foreignKey: 'state_id' });

module.exports = City; 