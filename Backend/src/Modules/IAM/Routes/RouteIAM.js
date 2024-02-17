'use strict';
const express = require('express');
const router = express.Router();

var IAMController = require("../Controller/ControllerIAM")

router.post('/', IAMController.test);

module.exports = router;
