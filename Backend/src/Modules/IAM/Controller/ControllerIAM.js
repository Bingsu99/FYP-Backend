'use strict';
var CaregiverDao = require("../../Caregiver/Dao/DaoCaregiver");
var TherapistDao = require("../../Therapist/Dao/DaoTherapist");
var PatientDao = require("../../Patient/Dao/DaoPatient");
const bcrypt = require('bcrypt');

function IAMController() {}

IAMController.prototype.createTherapist = async function (req, res) {
  const requestData = req.body;

}

var iamController = new IAMController()
module.exports = iamController
