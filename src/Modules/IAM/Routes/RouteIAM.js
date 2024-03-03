'use strict';
const express = require('express');
const router = express.Router();

var IAMController = require("../Controller/ControllerIAM")

router.post('/Login', IAMController.login);
router.post('/Register', IAMController.register);

module.exports = router;
