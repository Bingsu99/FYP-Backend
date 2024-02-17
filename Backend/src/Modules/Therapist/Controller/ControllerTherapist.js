'use strict';
var TherapistDao = require("../Dao/DaoTherapist");
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

var therapistController = new TherapistController()
module.exports = therapistController
