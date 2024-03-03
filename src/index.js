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
const RepeatExerciseRoutes = require('./Modules/RepeatExercise/Routes/RouteRepeatExercise');
const CompleteSentenceDeckRoutes = require('./Modules/CompleteSentenceDeck/Routes/RouteCompleteSentenceDeck');
const DecksRoute = require('./Modules/Decks/Routes/RouteDecks');

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
app.use("/RepeatExercise", RepeatExerciseRoutes);
app.use("/Decks", DecksRoute);
app.use("/CompleteSentenceDeck", CompleteSentenceDeckRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
