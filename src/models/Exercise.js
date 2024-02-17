const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  label: { type: String, required: true },
  data: { type: String, required: true, unique: true },
});

const Exercise = mongoose.model('Patient', exerciseSchema);

module.exports = Exercise;