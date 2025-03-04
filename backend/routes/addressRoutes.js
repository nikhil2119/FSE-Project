const express = require('express');
const router = express.Router();

const addressController = require('../controllers/addressController');

//routes
router.get('/', addressController.getAllAddress);
router.get('/:id', addressController.getAddressById);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;