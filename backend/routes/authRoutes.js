const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');    

// Public routes (no authentication required)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (require authentication)
router.get('/me', authController.getProfile);
router.post('/logout', authController.logout);
module.exports = router;
