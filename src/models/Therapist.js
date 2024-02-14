const mongoose = require('mongoose');

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  patients: { type: [mongoose.Schema.Types.ObjectId] },
  exerise1_deck: { type: [mongoose.Schema.Types.ObjectId], required: false },
});

const Therapist = mongoose.model('Therapist', therapistSchema);

module.exports = Therapist;