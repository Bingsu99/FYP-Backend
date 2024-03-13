'use strict';
const express = require('express');
const router = express.Router();

var ActivityResultController = require("../Controller/ControllerActivityResult")

router.post('/Add', ActivityResultController.create);
router.post('/Read', ActivityResultController.read);

module.exports = router;
