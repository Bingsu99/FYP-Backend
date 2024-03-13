'use strict';
const mongoose = require('mongoose');

const completeSentenceResultSchema = new mongoose.Schema({
  deckID: { type: mongoose.Schema.Types.ObjectId, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  sentence: { type: String, required: true },
  wordsToHide: { type: [String], required: true },
  incorrectWords: { type: [String], required: true },
  response: { type: String, required: true },
  isCorrect: {type: Boolean, required: true },
  duration: { type: Number, required: true },
  datetime: {
      type: Date,
      default: Date.now // This sets the default value to the current date and time
  }
});

const CompleteSentenceResultModel = mongoose.model('CompleteSentenceResult', completeSentenceResultSchema);

module.exports = CompleteSentenceResultModel;