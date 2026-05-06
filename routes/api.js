const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/dashboard', apiController.getDashboardData);
router.get('/devices', apiController.getDevices);
router.post('/device/toggle', apiController.toggleDevice);
router.post('/energy/manual', apiController.addManualEnergy);
router.get('/predictions', apiController.getPredictions);

// New Specific Endpoints
router.get('/analytics', apiController.getAnalytics);
router.get('/bill', apiController.getBill);
router.get('/ai-insights', apiController.getAIInsights);
router.post('/chat', apiController.postChat);

module.exports = router;
