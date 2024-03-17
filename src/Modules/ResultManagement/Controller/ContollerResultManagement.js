'use strict';
var CompleteSentenceResultDAO = require("../../CompleteSentence/Dao/DaoCompleteSentenceResult");

function ResultManagementController() {}

ResultManagementController.prototype.getResultsByDay = async function (req, res) {
    const requestData = req.body;
    const activityKey = requestData["activity"]
    try{
        if (activityKey === 0){
            const resultsByDay = await CompleteSentenceResultDAO.getResultsByDay(requestData["startDate"], requestData["endDate"])
            res.status(200).json({status:"success", data:resultsByDay});
            return;
        } else{
            const resultsByDay = await CompleteSentenceResultDAO.getResultsByDay(requestData["startDate"], requestData["endDate"])
            // To modify and fit all activity DAOs here
            res.status(200).json({status:"success", data:resultsByDay});
            return;
        }// To add more Activities as needed
    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

ResultManagementController.prototype.getResultsByWeek = async function (req, res) {
    const requestData = req.body;
    const activityKey = requestData["activity"]

    try{
        if (activityKey === 0){
            const resultsByWeek = await CompleteSentenceResultDAO.getResultsByWeek(requestData["startDate"], requestData["endDate"])
            res.status(200).json({status:"success", data:resultsByWeek});
            return;
        } else{
            const resultsByWeek = await CompleteSentenceResultDAO.getResultsByWeek(requestData["startDate"], requestData["endDate"])
            // To modify and fit all activity DAOs here
            res.status(200).json({status:"success", data:resultsByWeek});
            return;
        }// To add more Activities as needed
    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

var resultManagementController = new ResultManagementController()
module.exports = resultManagementController
