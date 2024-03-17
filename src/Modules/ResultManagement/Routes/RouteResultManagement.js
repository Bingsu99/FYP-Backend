'use strict';
const express = require('express');
const router = express.Router();

var ResultManagementController = require("../Controller/ContollerResultManagement")

router.post('/Day', ResultManagementController.getResultsByDay);
router.post('/Week', ResultManagementController.getResultsByWeek);

module.exports = router;