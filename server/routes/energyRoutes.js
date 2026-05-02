const express = require('express');
const router = express.Router();
const { addEnergyData, getEnergyData } = require('../controllers/energyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addEnergyData).get(protect, getEnergyData);

module.exports = router;
