'use strict';
require('dotenv').config();
require('./Modules/Middlewares/Mongoose')
const express = require('express');
const cookieParser = require('cookie-parser');
const PatientRoutes = require('./Modules/Patient/Routes/RoutePatient');
const RegisterationTokenRoutes = require('./Modules/RegisterationToken/Routes/RouteRegistrationToken');
const CaregiverRoutes = require('./Modules/Caregiver/Routes/RouteCaregiver');
const TherapistRoutes = require('./Modules/Therapist/Routes/RouteTherapist');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/Patient", PatientRoutes);
app.use("/RegistrationToken", RegisterationTokenRoutes);
app.use("/Caregiver", CaregiverRoutes);
app.use("/Therapist", TherapistRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
