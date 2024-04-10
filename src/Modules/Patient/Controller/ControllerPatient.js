'use strict';
var Mongoose = require('../../Middlewares/Mongoose')
var PatientDao = require("../Dao/DaoPatient");
var CaregiverDao = require("../../Caregiver/Dao/DaoCaregiver");
var TherapistDao = require("../../Therapist/Dao/DaoTherapist");
var RegistrationTokenDao = require("../../RegisterationToken/Dao/DaoRegistrationToken")
const bcrypt = require('bcryptjs');

function PatientController() {}

PatientController.prototype.createPatient = async function (req, res) {
  const requestData = req.body;

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(requestData["password"], saltRounds);

  var params = {
    name: requestData["name"],
    email: requestData["email"],
    password: hashedPassword,
  }

  try{
    var data = await PatientDao.create(params);
    res.status(200).json({data:data})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

PatientController.prototype.getPatientDetails = async function (req, res) {
  const requestData = req.body;

  try{
    var patientDetails = await PatientDao.findPatientByID(requestData["_id"])

    var doc = patientDetails.toObject();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const lastUpdatedDailyStreak = new Date(doc["dailyStreak"]["lastUpdated"]);
    lastUpdatedDailyStreak.setHours(0, 0, 0, 0);

    const lastUpdatedAssignmentRecord = new Date(doc["dailyAssignmentRecord"]["lastUpdated"]);
    lastUpdatedAssignmentRecord.setHours(0, 0, 0, 0);

    let updateData = {
      $set: {}
    };

    var isModified = false;

    if (lastUpdatedAssignmentRecord.getTime() !== today.getTime()) {
      console.log("running in not today")
      Object.keys(doc["dailyAssignmentRecord"]["completed"]).forEach((key) => {
        updateData.$set[`dailyAssignmentRecord.completed.${key}`] = [];
        updateData.$set[`dailyAssignmentRecord.lastUpdated`] = new Date();
      });
      isModified=true;
    }

    if(lastUpdatedDailyStreak.getTime() !== today.getTime() && lastUpdatedDailyStreak.getTime() !== yesterday.getTime()){
      updateData.$set[`dailyStreak.completed`] = 0;
      updateData.$set[`dailyStreak.lastUpdated`] = new Date();
      isModified=true;
    }
    if (isModified===true){
      patientDetails = await PatientDao.updateOne({"_id":doc["_id"]}, updateData);
    }

    console.log(patientDetails);
  
    var resp = {
      "_id": patientDetails["_id"],
      "name": patientDetails["name"],
      "email": patientDetails["email"],
      "access": patientDetails["access"],
      "dailyAssignment": patientDetails["dailyAssignment"],
      "dailyStreak": patientDetails["dailyStreak"],
      "dailyAssignmentRecord": patientDetails["dailyAssignmentRecord"],
    }
    
    if (patientDetails["caregivers"] !== null){
      const caregiverDetails = await CaregiverDao.findOne({"_id": patientDetails["caregivers"][0]})  // Assume one caregiver for now
      resp["caregiverName"] = caregiverDetails['name']
      resp["caregiverEmail"] = caregiverDetails['email']
    }

    res.status(200).json({status:"success", data:resp});
  }catch(err){
    res.status(500).json({status:"failed", error:err.message})
  }
}

PatientController.prototype.createPatientWithToken = async function (req, res) {
  const requestData = req.body;
  var caregivers = [];

  requestData["caregivers"].forEach(async email => {
    var caregiverProfile = await CaregiverDao.findOne({email:email})
    console.log(caregiverProfile)
    if (caregiverProfile !== null){
      caregivers.push(caregiverProfile["_id"])
    }
  });

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(requestData["password"], saltRounds);

  var params = {
    name: requestData["name"],
    email: requestData["email"],
    password: hashedPassword,
    caregivers: caregivers,
    therapists: [requestData["therapistID"]],
  }

  const session = await Mongoose.client.startSession();
  session.startTransaction();

  try{
    var data = await PatientDao.create(params, session);
    await RegistrationTokenDao.updateOne({email:requestData["email"]}, {userObjectID: data["_id"]});
    await TherapistDao.addPatient({_id:requestData["therapistID"]}, data["_id"], session);
    for (const caregiverID of caregivers) {
      await CaregiverDao.addPatient({_id:caregiverID}, data["_id"], session);
    }
    await session.commitTransaction();
    const resp = {
      _id: data["_id"]
    }
    res.status(200).json({status:"success", data:resp});
  }catch (err) {
    console.log(err)
    res.status(500).json({status:"failed", error:err.message})
  }finally{
    session.endSession();
  }
}

var patientController = new PatientController()
module.exports = patientController
