const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserAddress = sequelize.define('UserAddress', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address_type: {
        type: DataTypes.ENUM('Home', 'Office', 'Other'),
        defaultValue: 'Home'
    },
    primary_addr: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    landmark: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    pin_code: {
        type: DataTypes.CHAR(6),
        allowNull: false
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    state_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'User_address',
    timestamps: true,
    createdAt: 'created_on',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    paranoid: true
});

module.exports = UserAddress; 