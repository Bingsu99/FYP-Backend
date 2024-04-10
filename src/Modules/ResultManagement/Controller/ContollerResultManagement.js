'use strict';
var CompleteSentenceResultDAO = require("../../CompleteSentence/Dao/DaoCompleteSentenceResult");
var RepeatSentenceResultDAO = require("../../RepeatSentence/Dao/DaoRepeatSentenceResult");
var PatientDao = require("../../Patient/Dao/DaoPatient");

function ResultManagementController() {}

ResultManagementController.prototype.getResults = async function (req, res) {
    const requestData = req.body;
    const activityKey = requestData["activity"];
    const patientID = requestData["_id"];
    const timeIndicator = requestData["timeIndicator"]; // Expecting "day" or "week"

    try {
        let results;
        if (activityKey === 0) {
            if (timeIndicator === "day") {
                results = await CompleteSentenceResultDAO.getResultsByDay(requestData["startDate"], requestData["endDate"], patientID);
            } else if (timeIndicator === "week") {
                results = await CompleteSentenceResultDAO.getResultsByWeek(requestData["startDate"], requestData["endDate"], patientID);
            } else {
                return res.status(400).json({status: "failed", error: "Invalid time indicator"});
            }
            res.status(200).json({status: "success", data: results});
            return;
        } else {
            if (timeIndicator === "day") {
                results = await CompleteSentenceResultDAO.getResultsByDay(requestData["startDate"], requestData["endDate"], patientID);
                // Add more activities as  needed
            } else if (timeIndicator === "week") {
                results = await CompleteSentenceResultDAO.getResultsByWeek(requestData["startDate"], requestData["endDate"], patientID);
                // Add more activities as  needed
            } else {
                return res.status(400).json({status: "failed", error: "Invalid time indicator"});
            }
            res.status(200).json({status: "success", data: results});
            return;
        }
        // Add more else if for different activity keys

    } catch (err) {
        console.log(err);
        res.status(500).json({status: "failed", error: err.message});
    }
};


ResultManagementController.prototype.getStatistics = async function (req, res) {
    const requestData = req.body;
    const activityKey = requestData["activity"];
    const patientID = requestData["_id"];
    const timeIndicator = requestData["timeIndicator"]; // This will be "day" or "week"

    try {
        let results;
        if (activityKey === 0) {
            if (timeIndicator === "day") {
                results = await CompleteSentenceResultDAO.getStatisticByDay(requestData["startDate"], requestData["endDate"], patientID);
                // Add more activities as  needed
            } else if (timeIndicator === "week") {
                results = await CompleteSentenceResultDAO.getStatisticByWeek(requestData["startDate"], requestData["endDate"], patientID);
                // Add more activities as  needed
            } else {
                return res.status(400).json({status: "failed", error: "Invalid time indicator"});
            }
            res.status(200).json({status: "success", data: results});
            return;
        } else {
            // Future logic for other activityKeys
            if (timeIndicator === "day") {
                results = await CompleteSentenceResultDAO.getStatisticByDay(requestData["startDate"], requestData["endDate"], patientID);
                // Add more activities as  needed
            } else if (timeIndicator === "week") {
                results = await CompleteSentenceResultDAO.getStatisticByWeek(requestData["startDate"], requestData["endDate"], patientID);
                // Add more activities as  needed
            } else {
                return res.status(400).json({status: "failed", error: "Invalid time indicator"});
            }
            res.status(200).json({status: "success", data: results});
            return;
        } // Add more else if for different activity keys
    } catch (err) {
        console.log(err);
        res.status(500).json({status: "failed", error: err.message});
    }
};

ResultManagementController.prototype.getTimeSpent = async function (req, res) {
    const requestData = req.body;
    const activityKey = requestData["activity"];
    const patientID = requestData["_id"];
    const timeIndicator = requestData["timeIndicator"]; // Expecting "day" or "week"

    try {
        let results;
        if (activityKey === 0) {
            if (timeIndicator === "day") {
                results = await CompleteSentenceResultDAO.getTimeSpentByDay(requestData["startDate"], requestData["endDate"], patientID);
            } else if (timeIndicator === "week") {
                results = await CompleteSentenceResultDAO.getTimeSpentByWeek(requestData["startDate"], requestData["endDate"], patientID);
            } else {
                return res.status(400).json({status: "failed", error: "Invalid time indicator"});
            }
            res.status(200).json({status: "success", data: results});
            return;
        } else {
            if (timeIndicator === "day") {
                results = await CompleteSentenceResultDAO.getTimeSpentByDay(requestData["startDate"], requestData["endDate"], patientID);
                // Add more activities as  needed
            } else if (timeIndicator === "week") {
                results = await CompleteSentenceResultDAO.getTimeSpentByWeek(requestData["startDate"], requestData["endDate"], patientID);
                // Add more activities as  needed
            } else {
                return res.status(400).json({status: "failed", error: "Invalid time indicator"});
            }
            res.status(200).json({status: "success", data: results});
            return;
        }
        // Add more else if for different activity keys

    } catch (err) {
        console.log(err);
        res.status(500).json({status: "failed", error: err.message});
    }
};

ResultManagementController.prototype.create = async function (req, res) {
  const { activity, params, dailyAssignment } = req.body;

  var doc;
  if (activity == 0){
    doc = await CompleteSentenceResultDAO.create(params);
  }else if (activity == 1){
    doc = await RepeatSentenceResultDAO.create(params);
  }else{
    res.status(400).json({status:"failed", error:"No activity type specified"})
    return;
  } // Add more activities if needed

  if (dailyAssignment){
    await PatientDao.updateDailyAssignmentRecord(activity, doc["_id"], params["userID"]);
  }

  res.status(200).json({status:"success", data:doc})
}

ResultManagementController.prototype.read = async function (req, res) {
  const {  } = req.body;
  
}

var resultManagementController = new ResultManagementController()
module.exports = resultManagementController
