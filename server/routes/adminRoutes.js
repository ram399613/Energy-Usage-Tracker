const express = require('express');
const router = express.Router();
const { getAllUsersData } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/users').get(protect, admin, getAllUsersData);

module.exports = router;
