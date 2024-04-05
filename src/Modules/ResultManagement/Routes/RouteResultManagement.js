'use strict';
const express = require('express');
const router = express.Router();

var ResultManagementController = require("../Controller/ContollerResultManagement")

// router.post('/Result', ResultManagementController.getResults);
router.post('/Stats', ResultManagementController.getStatistics);
router.post('/TimeSpent', ResultManagementController.getTimeSpent);

module.exports = router;