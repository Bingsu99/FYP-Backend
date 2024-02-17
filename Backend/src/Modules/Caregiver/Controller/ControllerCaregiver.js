'use strict';
var Mongoose = require('../../Middlewares/Mongoose')
var CaregiverDao = require("../Dao/DaoCaregiver");
const patientDAO = require("../../Patient/Dao/DaoPatient");
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
    var data = await CaregiverDao.create(params);
    res.status(200).json({data:data})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

CaregiverController.prototype.createCaregiverWithToken = async function (req, res) {
  const requestData = req.body;
  var patients = [];

  requestData["patients"].forEach(async email => {
    var patientProfile = await patientDAO.findOne({email:email})
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
    var data = await CaregiverDao.create(params, session);
    for (const patientID of patients) {
      await patientDAO.addCaregiver({_id:patientID}, data["_id"], session)
    }
    await session.commitTransaction();
    res.status(200).json({data:data})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }finally{
    session.endSession();
  }
}
var caregiverController = new CaregiverController()
module.exports = caregiverController
