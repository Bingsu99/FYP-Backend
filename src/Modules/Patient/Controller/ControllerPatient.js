'use strict';
var Mongoose = require('../../Middlewares/Mongoose')
var PatientDao = require("../Dao/DaoPatient");
var CaregiverDao = require("../../Caregiver/Dao/DaoCaregiver");
var TherapistDao = require("../../Therapist/Dao/DaoTherapist");
var RegistrationTokenDao = require("../../RegisterationToken/Dao/DaoRegistrationToken")
const bcrypt = require('bcrypt');

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

PatientController.prototype.createPatientWithToken = async function (req, res) {
  const requestData = req.body;
  var caregivers = [];

  requestData["caregivers"].forEach(async email => {
    var caregiverProfile = await CaregiverDao.findOne({email:email})
    if (caregiverProfile !== undefined){
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
    for (const caregivertID of caregivers) {
      await CaregiverDao.addPatient({_id:caregivertID}, data["_id"], session);
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
