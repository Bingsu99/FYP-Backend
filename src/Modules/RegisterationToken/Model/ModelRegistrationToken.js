'use strict';
const mongoose = require('mongoose');

const registrationTokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true},
  userObjectID: { type: mongoose.Schema.Types.ObjectId } ,
  type: { type: String, enum: ['patient', 'caregiver'], required: true },
  therapists: { type: [mongoose.Schema.Types.ObjectId], required: function() { return this.type === 'patient'; }} ,
  caregivers: { type: [String], required: function() { return this.type === 'patient'; }} ,
  patients: { type: [String], required: function() { return this.type === 'caregiver'; }} ,
});

const RegistrationTokenModel = mongoose.model('RegistrationToken', registrationTokenSchema);

module.exports = RegistrationTokenModel;
