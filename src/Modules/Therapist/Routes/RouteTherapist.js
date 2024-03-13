'use strict';
const express = require('express');
const router = express.Router();

var TherapistController = require("../Controller/ControllerTherapist")

// Creates a new Therapist
router.post('/', TherapistController.createTherapist);
router.post('/GetPatients', TherapistController.getPatients);

module.exports = router;
