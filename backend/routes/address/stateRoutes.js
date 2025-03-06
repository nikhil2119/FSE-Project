const express = require('express');
const router = express.Router();

const stateController = require('../../controllers/address/stateController');
const { authMiddleware } = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

//routes
router.get('/', stateController.getAllStates);
router.get('/:id', stateController.getStateById);
router.post('/', authMiddleware, roleMiddleware(['admin']), stateController.addState);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), stateController.deleteState);

module.exports = router;