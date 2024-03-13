'use strict';
var TherapistDao = require("../Dao/DaoTherapist");
const patientDAO = require("../../Patient/Dao/DaoPatient");
const bcrypt = require('bcrypt');

function TherapistController() {}

TherapistController.prototype.createTherapist = async function (req, res) {
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
    var data = await TherapistDao.create(params);
    res.status(200).json({data:data})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

TherapistController.prototype.getPatients = async function (req, res) {
  const requestData = req.body;
  
  const therapistDetails = await TherapistDao.findOne({"_id": requestData["_id"]})
  if (therapistDetails !== null){
    const patientDetails = await patientDAO.findAll(therapistDetails["patients"])

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
    res.status(404).json({error:"Therapist ID not found in database"})
  }
}

var therapistController = new TherapistController()
module.exports = therapistController
