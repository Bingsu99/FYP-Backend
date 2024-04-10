'use strict';
var CaregiverDao = require("../../Caregiver/Dao/DaoCaregiver");
var TherapistDao = require("../../Therapist/Dao/DaoTherapist");
var PatientDao = require("../../Patient/Dao/DaoPatient");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function IAMController() {}

IAMController.prototype.login = async function (req, res) {
  const { type, email, password } = req.body;
  try{
    var doc;
    if (type === "patient"){
      doc = await PatientDao.findPatientByEmail(email);
    }else if (type === "therapist"){
      doc = await TherapistDao.findOne({ email:email });
    }else if (type === "caregiver"){
      doc = await CaregiverDao.findOne({ email:email });
    }else{
      return res.status(400).json({ status:"failed", message: 'Bad Request: Invalid User Type ' + type });
    }

    const passwordMatch = await bcrypt.compare(password, doc.password);
    if (!passwordMatch) {
      return res.status(401).json({ status:"failed", message: 'Authentication failed' });
    }else if(type === "patient" &&  passwordMatch){
      doc = doc.toObject();

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
        doc = await PatientDao.updateOne({"_id":doc["_id"]}, updateData);
      }
     
    }

    // Generate JWT tokens
    const accessToken = jwt.sign({ _id: doc._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '60m', // Change this to desired expiration time
    });
    const refreshToken = jwt.sign({ _id: doc._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '90d', // Change this to desired expiration time
    });

    const cookieOptions = {
      httpOnly: true,
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({status:"success", accessToken, data:{ "_id": doc["_id"], name:doc["name"], ...(doc["dailyStreak"]&&{dailyStreak:doc["dailyStreak"]["completed"]}) } });
  } catch (error) {
    console.log(error)
    res.status(500).json({status:"failed", message: 'Internal Server error' });
  }
}

IAMController.prototype.register = async function (req, res) {
  const { name, email, password, type } = req.body;
  try{
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    var doc;
    var params = {
      name: name,
      email: email,
      password: hashedPassword,
    }

    if (type==="patient"){
      doc = await PatientDao.create(params)
    }else if(type==="caregiver"){
      doc = await CaregiverDao.create(params)
    }else if(type==="therapist"){
      doc = await TherapistDao.create(params)
    }else{
      res.status(400).json({status:"failed", message: 'Bad Request: Invalid User Type ' + type})
    }

    res.status(200).json({ status:"success", data:{"_id": doc["_id"], name:doc["name"]}});
  } catch (error) {
    console.log(error)
    res.status(500).json({status:"failed", message: 'Internal Server error' });
  }
}

var iamController = new IAMController()
module.exports = iamController
