'use strict';
const mongoose = require('mongoose');

const repeatSentenceResultSchema = new mongoose.Schema({
  deckID: { type: mongoose.Schema.Types.ObjectId, required: true },
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  sentence: { type: String, required: true },
  response: { type: String, required: true },
  recording: { type: String, required: true },
  similarity: { type: Number, required: true },
  isCorrect: {type: Boolean, required: true },
  duration: { type: Number, required: true },
  datetime: {
      type: Date,
      default: Date.now // This sets the default value to the current date and time
  }
});

const RepeatSentenceResultModel = mongoose.model('RepeatSentenceResult', repeatSentenceResultSchema);

module.exports = RepeatSentenceResultModel;