'use strict';
const mongoose = require('mongoose');
const ActivityAccessSchema = require("../../DecksManagement/Model/ActivityAccessSchema")

const caregiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  patients: { type: [mongoose.Schema.Types.ObjectId] },
  creator: { type: ActivityAccessSchema }
});

const CaregiverModel = mongoose.model('Caregiver', caregiverSchema);

module.exports = CaregiverModel;