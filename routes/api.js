const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

router.get('/dashboard', apiController.getDashboardData);
router.get('/devices', apiController.getDevices);
router.post('/device/toggle', apiController.toggleDevice);
router.post('/energy/manual', apiController.addManualEnergy);
router.get('/predictions', apiController.getPredictions);

module.exports = router;
