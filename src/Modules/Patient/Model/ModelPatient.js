'use strict';
const mongoose = require('mongoose');
const ActivityAccessSchema = require("../../DecksManagement/Model/ActivityAccessSchema")

const ExerciseRequirementSchema = new mongoose.Schema({
  "0" : { type: Number, default: 0},
  "1" : { type: Number, default: 0},
}, { _id: false });

const dailyAssignmentSchema = new mongoose.Schema({
  decks: { type: ActivityAccessSchema },
  exerciseRequirements: { type: ExerciseRequirementSchema },
}, { _id: false });

const dailyAssignmentRecordSchema = new mongoose.Schema({
  completed: { type: ActivityAccessSchema },
  lastUpdated: { type: Date }
}, { _id: false });

const dailyStreak = new mongoose.Schema({
  completed: { type: Number, default: 0 },
  lastUpdated: { type: Date }
}, { _id: false });

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  caregivers: { type: [mongoose.Schema.Types.ObjectId] },
  therapists: { type: [mongoose.Schema.Types.ObjectId] },
  access: { type: ActivityAccessSchema},
  dailyAssignment: { type: dailyAssignmentSchema, default: () => ({ decks: {}, exerciseRequirements: {} })},
  dailyAssignmentRecord: { type: dailyAssignmentRecordSchema, default: () => ({ completed: {}, lastUpdated: new Date() }) },
  dailyStreak: { type: dailyStreak, default: () => ({ completed: 0, lastUpdated: new Date() })}
});

const PatientModel = mongoose.model('Patient', patientSchema);

module.exports = PatientModel;