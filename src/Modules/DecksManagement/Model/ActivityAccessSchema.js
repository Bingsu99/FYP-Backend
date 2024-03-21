'use strict';
const mongoose = require('mongoose');

// Need Change To Add New Activities
const ActivityAccessSchema = new mongoose.Schema({
    "0" : { type: [mongoose.Schema.Types.ObjectId]},
    "1" : { type: [mongoose.Schema.Types.ObjectId]},
  }, { _id: false });


module.exports = ActivityAccessSchema;