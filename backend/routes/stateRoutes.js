const express = require('express');
const router = express.Router();

const stateController = require('../controllers/stateController');

//routes
router.get('/', stateController.getAllStates);
router.get('/:id', stateController.getStateById);
router.post('/', stateController.addState);
router.delete('/:id', stateController.deleteState);

module.exports = router;