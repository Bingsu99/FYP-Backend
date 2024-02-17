const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  caregivers: { type: [mongoose.Schema.Types.ObjectId] },
  therapists: { type: [mongoose.Schema.Types.ObjectId] },
  exercise1_list: { type: [mongoose.Schema.Types.ObjectId] },
  exercise1_result: { type: [{}] },
  exercise1_result: [{
    accuracy: { type: String },
    lastName: { type: String }
  }]
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;