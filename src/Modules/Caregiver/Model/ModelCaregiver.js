'use strict';
const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  patients: { type: [mongoose.Schema.Types.ObjectId] },
  // repeatSentence_deck: { type: [mongoose.Schema.Types.ObjectId] }, // Should save the ObjectID of decks that they created
  completeSentence_deck: { type: [mongoose.Schema.Types.ObjectId] }, // Should save the ObjectID of decks that they created
});

const CaregiverModel = mongoose.model('Caregiver', caregiverSchema);

module.exports = CaregiverModel;