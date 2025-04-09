const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authenticateUser, userController.getProfile);
router.put('/me', authenticateUser, userController.updateProfile);

module.exports = router;
