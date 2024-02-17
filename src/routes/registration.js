const express = require('express');
const router = express.Router();
const emailClient = require('../util/emailService')
const { v4: uuidv4 } = require('uuid');
const registrationTokenController = require('../controllers/RegistrationTokenController')


// Endpoint send email for account registration 
// Client Data
// {
//     patientName: "",
//     patientEmail: "",
//     caregiverName: "",
//     caregiverEmail: "",
//     therapistID: ""
// }
router.get('/sendCode', (req, res) => { 
    const patientToken = uuidv4();
    const caregiverToken = uuidv4();

    print(patientToken)
  
    emailClient.sendRegisterEmail("bingsu.lim@gmail.com", token);
    const caregiver = {
      name: "a",
      email: "a",
      token: uuidv4(),
      type: "caregiver",
      patient: [patientToken],
    };
  
    const patient = {
      name: "b",
      email: "b",
      token: [caregiverToken],
      type: "patient",
      therapist: "b",
    };

    // tokenController.createToken
  });

  module.exports = router;
