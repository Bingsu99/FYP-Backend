'use strict';
var Mongoose = require('../../Middlewares/Mongoose')
const emailClient = require('../../../Utilities/email')
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
    params.patients = requestData["patientToken"];
  }else if (requestData["type"] === "patient"){
    params.therapists = requestData["therapistObjectID"];
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
    name: requestData["caregiver"]["name"],
    email: requestData["caregiver"]["email"],
    token: caregiverToken,
    type: "caregiver",
    patients: [requestData["patient"]["email"]],
  };
  
  const patient = {
    name: requestData["patient"]["name"],
    email: requestData["patient"]["email"],
    token: patientToken,
    type: "patient",
    therapists: requestData["therapist"],
    caregivers: [requestData["caregiver"]["email"]],
  };

  try{
    var patientData = await registrationTokenDAO.create(patient, session);
    var caregiverData = await registrationTokenDAO.create(caregiver, session);
    await session.commitTransaction();
    res.status(200).json({status:"success"})
    emailClient.sendRegisterEmail(requestData["patient"]["email"], patientToken);
    emailClient.sendRegisterEmail(requestData["caregiver"]["email"], caregiverToken);
  }catch (err) {
    console.log(err)
    res.status(500).json({status:"failed", error:err.message})
  }finally{
    session.endSession();
  }
}

RegistrationToken.prototype.getToken = async function (req, res) {
  const requestData = req.body;
  var params = {token : requestData["token"]}
  var data = await registrationTokenDAO.findOne(params);

  console.log(data)

  if (data === undefined || data === null){
    res.status(400).json({status:"failed", error:"Token does not exist"})
    return;
  }

  if (data["userObjectID"] !== undefined){
    res.status(400).json({status:"failed", error:"Token have been consumed"})
    return;
  }

  var resp = {
    name: data["name"],
    email: data["email"],
    type: data["type"]
  }
  
  if (data["type"] == "patient"){
    resp["caregivers"] = data["caregivers"];
    resp["therapistID"] = data["therapists"][0];
  } else{
    resp["patients"] = data["patients"];
  }
  
  res.status(200).json({status:"success", data:resp})
}

var registrationTokenController = new RegistrationToken()
module.exports = registrationTokenController
