const express = require('express');
const router = express.Router();
const cityController = require('../../controllers/address/cityController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Routes
router.get('/', cityController.getAllCities);
router.get('/:id', cityController.getCityById);
router.post('/', authMiddleware, roleMiddleware(['admin']), cityController.addCity);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), cityController.deleteCity);

module.exports = router; 