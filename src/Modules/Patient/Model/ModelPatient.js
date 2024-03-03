'use strict';
const mongoose = require('mongoose');

// const exerciseRecordSchema = new mongoose.Schema({
//   deckID: { type: mongoose.Schema.Types.ObjectId },
//   datetime: {
//     type: Date,
//     default: Date.now // This sets the default value to the current date and time
//   }
// });

// const dailyAssignmentRecordSchema = new mongoose.Schema({
//   repeatSentenceDecks: { type: [mongoose.Schema.Types.ObjectId] },
//   repeatSentenceRequirements: { type: Number },
//   completeSentenceDecks: { type: [mongoose.Schema.Types.ObjectId] },
//   completeSentenceRequirements: { type: Number },
//   lastUpdated: {
//       type: Date,
//       default: Date.now // This sets the default value to the current date and time
//   }
// });

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  caregivers: { type: [mongoose.Schema.Types.ObjectId] },
  therapists: { type: [mongoose.Schema.Types.ObjectId] },
  // repeatSentence_deck: { type: [mongoose.Schema.Types.ObjectId] }, // Should save the ObjectID of decks that they have access to
  // completeSentence_deck: { type: [mongoose.Schema.Types.ObjectId] }, // Should save the ObjectID of decks that they have access to
  // repeatSentence_result: {type: [exerciseRecordSchema]},
  // completeSentence_result: {type: [exerciseRecordSchema]},
  // dailyAssignment_result: {type: [{assignmentRecordID : mongoose.Schema.Types.ObjectId, datetime: {type: Date,}}]}
});

const PatientModel = mongoose.model('Patient', patientSchema);

module.exports = PatientModel;