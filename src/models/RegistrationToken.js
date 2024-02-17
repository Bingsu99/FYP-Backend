const mongoose = require('mongoose');

    const registrationTokenSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        token: { type: String, required: true},
        type: { type: String, enum: ['patient', 'caregiver'], required: true },
        therapist: { type: [mongoose.Schema.Types.ObjectId], required: function() { return this.type === 'patient'; }} ,
        patient: { type: [String], required: function() { return this.type === 'caregiver'; }} ,
    });

const registrationToken = mongoose.model('RegistrationToken', registrationTokenSchema);

module.exports = registrationToken;

