const express = require('express');
const router = express.Router();


const emailClient = require('../util/emailService')
const { v4: uuidv4 } = require('uuid');
const RegistrationTokenController = require('../controllers/RegistrationTokenController')

const tokenController = new RegistrationTokenController();

// Endpoint send email for account registration 
// Client Data
// {
//     patientName: "",
//     patientEmail: "",
//     caregiverName: "",
//     caregiverEmail: "",
//     therapistOBJECTID: ""
// }
router.post('/sendCode', (req, res) => { 
  const requestData = req.body;
  const patientToken = uuidv4();
  const caregiverToken = uuidv4();

  const caregiver = {
    name: requestData["patientName"],
    email: requestData["patientEmail"],
    token: caregiverToken,
    type: "caregiver",
    patient: [patientToken],
  };

  const patient = {
    name: requestData["caregiverName"],
    email: requestData["caregiverEmail"],
    token: patientToken,
    type: "patient",
    therapist: requestData["therapistOBJECTID"],
  };

  tokenController.createToken(caregiver);
  tokenController.createToken(patient);
  
  // emailClient.sendRegisterEmail("bingsu.lim@gmail.com", token);
  // emailClient.sendRegisterEmail("bingsu.lim@gmail.com", token);
  res.status(201).json("allgood")
  });

module.exports = router;
