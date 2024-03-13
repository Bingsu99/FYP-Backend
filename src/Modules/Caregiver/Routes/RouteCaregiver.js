'use strict';
const express = require('express');
const router = express.Router();

var CaregiverController = require("../Controller/ControllerCaregiver")

// Creates a new Caregiver
router.post('/', CaregiverController.createCaregiver);

router.post('/GetPatients', CaregiverController.getPatients);

router.post('/token', CaregiverController.createCaregiverWithToken);

module.exports = router;
