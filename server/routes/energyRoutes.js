const express = require('express');
const router = express.Router();
const { addEnergyData, getEnergyData, getAiInsights, resetEnergyData } = require('../controllers/energyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/ai-insights').get(protect, getAiInsights);
router.route('/reset').delete(protect, resetEnergyData);
router.route('/').post(protect, addEnergyData).get(protect, getEnergyData);

module.exports = router;
