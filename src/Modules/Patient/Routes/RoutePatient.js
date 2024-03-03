'use strict';
const express = require('express');
const router = express.Router();

var PatientController = require("../Controller/ControllerPatient")

// Creates a new Patient
router.post('/', PatientController.createPatient);

// Planning to depreciate it.
router.post('/token', PatientController.createPatientWithToken);

module.exports = router;
