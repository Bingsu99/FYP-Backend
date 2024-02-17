'use strict';
const express = require('express');
const router = express.Router();

var RegistrationToken = require("../Controller/ControllerRegistrationToken")

// Creates a new Registration Token (Patient Only)
router.post('/', RegistrationToken.createToken);

// Creates a new Registration Token (Patient and Caregiver)
router.post('/Pair', RegistrationToken.createTokenPairs);

// Create account from Registration Token
router.get('/GetToken', RegistrationToken.getToken);

module.exports = router;
