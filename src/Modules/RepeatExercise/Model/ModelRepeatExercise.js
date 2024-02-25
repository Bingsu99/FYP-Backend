'use strict';
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  prompt: { type: String },
  recording: { type: String }
});

const repeatExerciseSchema = new mongoose.Schema({
  topic: { type: String },
  access: { type: [mongoose.Schema.Types.ObjectId] },
  exercises: {type: [exerciseSchema]}
});

const RepeatExerciseSchema = mongoose.model('RepeatExercise', repeatExerciseSchema);

module.exports = RepeatExerciseSchema;