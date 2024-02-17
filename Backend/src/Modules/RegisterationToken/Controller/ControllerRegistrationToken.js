'use strict';
var Mongoose = require('../../Middlewares/Mongoose')
const emailClient = require('../../../Utilities/Email')
var registrationTokenDAO = require("../Dao/DaoRegistrationToken");
const { v4: uuidv4 } = require('uuid');


function RegistrationToken() {}

RegistrationToken.prototype.createToken = async function (req, res) {
  const requestData = req.body;
  const token = uuidv4();
  const params = {
    name: requestData["name"],
    email: requestData["email"],
    token: token,
    type: requestData["type"],
  };

  if (requestData["type"] === "caregiver") {
    params.patient = requestData["patientToken"];
  }else if (requestData["type"] === "patient"){
    params.therapist = requestData["therapistObjectID"];
  }else{
    res.status(404).json("Invalid type")
    return;
  }

  try{
    var data = await registrationTokenDAO.create(params);
    res.status(200).json({data:data})
    // emailClient.sendRegisterEmail(requestData["email"], token);
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

RegistrationToken.prototype.createTokenPairs = async function (req, res) {
  const session = await Mongoose.client.startSession();
  session.startTransaction();
  const requestData = req.body;
  const patientToken = uuidv4();
  const caregiverToken = uuidv4();

  const caregiver= {
    name: requestData["caregiverName"],
    email: requestData["caregiverEmail"],
    token: caregiverToken,
    type: "caregiver",
    patient: [requestData["patientEmail"]],
  };
  
  const patient = {
    name: requestData["patientName"],
    email: requestData["patientEmail"],
    token: patientToken,
    type: "patient",
    therapist: requestData["therapistOBJECTID"],
    caregiver: [requestData["caregiverEmail"]],
  };

  try{
    var patientData = await registrationTokenDAO.create(patient, session);
    var caregiverData = await registrationTokenDAO.create(caregiver, session);
    await session.commitTransaction();
    res.status(200).json({patientData:patientData, caregiverData:caregiverData})
    // emailClient.sendRegisterEmail(requestData["patientEmail"], token);
    // emailClient.sendRegisterEmail(requestData["caregiverEmail"], token);
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }finally{
    session.endSession();
  }
}

RegistrationToken.prototype.getToken = async function (req, res) {
  var params = {token : req.query.token}
  try{
    var data = await registrationTokenDAO.findOne(params);
    res.status(200).json({data:data})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

var registrationTokenController = new RegistrationToken()
module.exports = registrationTokenController
