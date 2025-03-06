const express = require('express');
const router = express.Router();
const addressController = require('../../controllers/address/addressController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protected routes
router.get('/', authMiddleware, addressController.getAllAddress);
router.get('/:id', authMiddleware, addressController.getAddressById);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), addressController.deleteAddress);

module.exports = router;