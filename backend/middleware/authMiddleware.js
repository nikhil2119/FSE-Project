const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    
    // Check if user exists
    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_enabled) {
      return res.status(401).json({ message: 'Invalid token. User not found or disabled.' });
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Middleware to check if user is a seller
const isSeller = (req, res, next) => {
  if (!req.user || req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Access denied. Seller privileges required.' });
  }
  next();
};

module.exports = { authenticateUser, isAdmin, isSeller };

