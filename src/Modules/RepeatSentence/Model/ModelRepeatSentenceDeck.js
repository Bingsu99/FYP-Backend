'use strict';
const mongoose = require('mongoose');

const repeatSentenceExerciseSchema = new mongoose.Schema({
  sentence: { type: String, required: true },
  recording: { type: String, required: true },
});

const repeatSentenceDeckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, required: true },
  access: { type: [mongoose.Schema.Types.ObjectId] },
  exercises: {type: [repeatSentenceExerciseSchema], required: true }
});

const RepeatSentenceDeckModel = mongoose.model('RepeatSentenceDeck', repeatSentenceDeckSchema);

module.exports = RepeatSentenceDeckModel;