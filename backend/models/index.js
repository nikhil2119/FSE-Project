const sequelize = require('../config/database');
const User = require('./User');
const State = require('./State');
const City = require('./City');
const UserAddress = require('./UserAddress');
const Category = require('./Category');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const ProductImage = require('./ProductImage');
const Payment = require('./Payment');

// State - City relationship
State.hasMany(City, { foreignKey: 'state_id' });
City.belongsTo(State, { foreignKey: 'state_id' });

// User - UserAddress relationship
User.hasMany(UserAddress, { foreignKey: 'user_id' });
UserAddress.belongsTo(User, { foreignKey: 'user_id' });

// State - UserAddress relationship
State.hasMany(UserAddress, { foreignKey: 'state_id' });
UserAddress.belongsTo(State, { foreignKey: 'state_id' });

// City - UserAddress relationship
City.hasMany(UserAddress, { foreignKey: 'city_id' });
UserAddress.belongsTo(City, { foreignKey: 'city_id' });

// User - Category relationship (for created_by)
User.hasMany(Category, { foreignKey: 'created_by', as: 'categories' });
Category.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Order - User relationship
Order.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Order, { foreignKey: 'user_id' });

// Order - OrderItem relationship
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

// Product - ProductImage relationship
Product.hasMany(ProductImage, { foreignKey: 'product_id' });
ProductImage.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
    sequelize,
    User,
    State,
    City,
    UserAddress,
    Category,
    Product,
    Cart,
    Order,
    OrderItem,
    ProductImage,
    Payment
}; 