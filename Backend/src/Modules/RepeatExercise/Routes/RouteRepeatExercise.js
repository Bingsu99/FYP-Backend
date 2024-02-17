'use strict';
const express = require('express');
const router = express.Router();

var RepeatExerciseController = require("../Controller/ControllerRepeatExercise")

// Creates a new RepeatExercise
router.post('/', RepeatExerciseController.createRepeatExercise);

module.exports = router;
