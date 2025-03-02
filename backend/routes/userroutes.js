const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Protected routes (require authentication)
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Admin only routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
