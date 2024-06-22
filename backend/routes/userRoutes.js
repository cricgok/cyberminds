const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/user-statistics/:userId', userController.getUserStatistics);

module.exports = router;
