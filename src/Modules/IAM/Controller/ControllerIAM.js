'use strict';
var CaregiverDao = require("../../Caregiver/Dao/DaoCaregiver");
var TherapistDao = require("../../Therapist/Dao/DaoTherapist");
var PatientDao = require("../../Patient/Dao/DaoPatient");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function IAMController() {}

IAMController.prototype.login = async function (req, res) {
  const { type, email, password } = req.body;
  try{
    var user = undefined;
    if (type === "patient"){
      user = await PatientDao.findOne({ email:email });
    }else if (type === "therapist"){
      user = await TherapistDao.findOne({ email:email });
    }else if (type === "caregiver"){
      user = await CaregiverDao.findOne({ email:email });
    }else{
      return res.status(400).json({ message: 'Invalid user type: ' + type });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '60m', // Change this to desired expiration time
    });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '90d', // Change this to desired expiration time
    });

    const cookieOptions = {
      httpOnly: true,
      maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.json({ accessToken });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error' });
  }
}

var iamController = new IAMController()
module.exports = iamController
