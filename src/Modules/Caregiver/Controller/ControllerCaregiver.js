'use strict';
var Mongoose = require('../../Middlewares/Mongoose')
var caregiverDao = require("../Dao/DaoCaregiver");
const patientDAO = require("../../Patient/Dao/DaoPatient");
const registrationTokenDao = require("../../RegisterationToken/Dao/DaoRegistrationToken");
const bcrypt = require('bcrypt');

function CaregiverController() {}

CaregiverController.prototype.createCaregiver = async function (req, res) {
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
    var data = await caregiverDao.create(params);
    res.status(200).json({data:data})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

CaregiverController.prototype.getPatients = async function (req, res) {
  const requestData = req.body;
  
  const caregiverDetails = await caregiverDao.findOne({"_id": requestData["_id"]})
  if (caregiverDetails !== null){
    const patientDetails = await patientDAO.findAll(caregiverDetails["patients"])

    var resp = []
    patientDetails.forEach((patient)=>{
      var params = {
        "_id" : patient["_id"],
        "name" : patient["name"],
      }
      resp.push(params)
    })

    res.status(200).json({status:"success", data:resp})
  }else{
    res.status(404).json({error:"Caregiver ID not found in database"})
  }
}

CaregiverController.prototype.createCaregiverWithToken = async function (req, res) {
  const requestData = req.body;
  var patients = [];

  requestData["patients"].forEach(async email => {
    var patientProfile = await patientDAO.findPatientByEmail(email)
    if (patientProfile !== undefined){
      patients.push(patientProfile["_id"])
    }
  });

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(requestData["password"], saltRounds);

  var params = {
    name: requestData["name"],
    email: requestData["email"],
    password: hashedPassword,
    patients: patients,
  }

  const session = await Mongoose.client.startSession();
  session.startTransaction();

  try{
    var data = await caregiverDao.create(params, session);
    await registrationTokenDao.updateOne({email:requestData["email"]}, {userObjectID: data["_id"]});
    for (const patientID of patients) {
      await patientDAO.addCaregiver({_id:patientID}, data["_id"], session)
    }
    await session.commitTransaction();
    const resp = {
      _id: data["_id"]
    }
    res.status(200).json({status:"success", data:resp})
  }catch (err) {
    console.log(err)
    res.status(500).json({status:"failed",error:err.message})
  }finally{
    session.endSession();
  }
}
var caregiverController = new CaregiverController()
module.exports = caregiverController
