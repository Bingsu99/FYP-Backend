'use strict';
const mongoose = require('mongoose');

const ActivityAccessSchema = new mongoose.Schema({
    "0" : { type: [mongoose.Schema.Types.ObjectId]},
  });


module.exports = ActivityAccessSchema;