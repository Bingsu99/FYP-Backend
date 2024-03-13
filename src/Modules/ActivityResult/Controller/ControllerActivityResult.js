'use strict';
var completeSentenceResultDAO = require("../../CompleteSentence/Dao/DaoCompleteSentenceResult")

function ActivityResultController() {}

ActivityResultController.prototype.create = async function (req, res) {
  const { activity, params } = req.body;

  var doc;
  if (activity == 0){
    doc = await completeSentenceResultDAO.create(params);
  }else{
    res.status(400).json({status:"failed", error:"No activity type specified"})
    return;
  } // Add more activities if needed
  res.status(200).json({status:"success", data:doc})
}

ActivityResultController.prototype.read = async function (req, res) {
  const {  } = req.body;
  
}

var activityResultController = new ActivityResultController()
module.exports = activityResultController
