'use strict';
const express = require('express');
const router = express.Router();

var ResultManagementController = require("../Controller/ContollerResultManagement")

// router.post('/Result', ResultManagementController.getResults);
router.post('/Stats', ResultManagementController.getStatistics);
router.post('/TimeSpent', ResultManagementController.getTimeSpent);
router.post('/Add', ResultManagementController.create);
router.post('/Read', ResultManagementController.read);

module.exports = router;