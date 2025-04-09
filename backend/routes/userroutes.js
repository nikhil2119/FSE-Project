const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', authenticateUser, userController.getProfile);
router.put('/me', authenticateUser, userController.updateProfile);

// Admin routes
router.get('/', authenticateUser, isAdmin, userController.getAllUsers);
router.get('/search', authenticateUser, isAdmin, userController.searchUsers);
router.get('/:id', authenticateUser, isAdmin, userController.getUserById);
router.put('/:id', authenticateUser, isAdmin, userController.updateUser);
router.delete('/:id', authenticateUser, isAdmin, userController.deleteUser);

module.exports = router;
