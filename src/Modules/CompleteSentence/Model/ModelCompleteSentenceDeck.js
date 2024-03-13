'use strict';
const mongoose = require('mongoose');

const completeSentenceExerciseSchema = new mongoose.Schema({
  sentence: { type: String, required: true },
  wordsToHide: { type: [String], required: true },
  incorrectWords: { type: [String], required: true }
});

const completeSentenceDeckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, required: true },
  access: { type: [mongoose.Schema.Types.ObjectId] },
  exercises: {type: [completeSentenceExerciseSchema], required: true }
});

const CompleteSentenceDeckModel = mongoose.model('CompleteSentenceDeck', completeSentenceDeckSchema);

module.exports = CompleteSentenceDeckModel;