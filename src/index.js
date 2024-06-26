'use strict';
require('dotenv').config();
require('./Modules/Middlewares/Mongoose')
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const verifyAccessToken = require("../src/Modules/Middlewares/Authentication")
const PatientRoutes = require('./Modules/Patient/Routes/RoutePatient');
const RegisterationTokenRoutes = require('./Modules/RegisterationToken/Routes/RouteRegistrationToken');
const CaregiverRoutes = require('./Modules/Caregiver/Routes/RouteCaregiver');
const TherapistRoutes = require('./Modules/Therapist/Routes/RouteTherapist');
const IAMRoutes = require('./Modules/IAM/Routes/RouteIAM');
const DecksRoute = require('./Modules/DecksManagement/Routes/RouteDecks');
const ResultRoute = require('./Modules/ActivityResult/Routes/RouteActivityResult');
const ResultManagementRoute = require('./Modules/ResultManagement/Routes/RouteResultManagement');
const RepeatSentenceRoute = require('./Modules/RepeatSentence/Routes/RouteRepeatSentence');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/Patient", PatientRoutes);
app.use("/RegistrationToken", RegisterationTokenRoutes);
app.use("/Caregiver", CaregiverRoutes);
app.use("/Therapist", TherapistRoutes);
app.use("/IAM", IAMRoutes);
app.use("/Decks", DecksRoute);
app.use("/ActivityResult", ResultRoute);
app.use("/ResultManagement", ResultManagementRoute);
app.use("/RepeatSentenceRoute", RepeatSentenceRoute);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
