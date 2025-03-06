const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protected routes (require authentication)
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);

// Admin only routes
router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), userController.getUserById);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);

module.exports = router;
