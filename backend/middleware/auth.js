const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

/**
 * Middleware to verify JWT token
 */
const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    if (decoded.role === 'user') {
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid token. User not found.' });
      }
      req.user = { id: user.id, role: 'user' };
    } else if (decoded.role === 'admin' || decoded.role === 'super_admin') {
      const admin = await Admin.findByPk(decoded.id);
      if (!admin || !admin.is_enabled) {
        return res.status(401).json({ message: 'Invalid token. Admin not found or disabled.' });
      }
      req.user = { id: admin.id, role: admin.role };
    } else {
      return res.status(401).json({ message: 'Invalid token. Unknown role.' });
    }
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

/**
 * Middleware to check if user is an admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'super_admin')) {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

/**
 * Middleware to check if user is a super admin
 */
const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
  }
  next();
};

module.exports = { authenticateToken, isAdmin, isSuperAdmin }; 