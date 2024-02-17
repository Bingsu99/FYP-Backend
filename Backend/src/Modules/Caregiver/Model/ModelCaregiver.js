'use strict';
const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  patients: { type: [mongoose.Schema.Types.ObjectId] },
  exerise1_deck: { type: [mongoose.Schema.Types.ObjectId] },
});

const CaregiverModel = mongoose.model('Caregiver', caregiverSchema);

module.exports = CaregiverModel;