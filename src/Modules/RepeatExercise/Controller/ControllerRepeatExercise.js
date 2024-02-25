'use strict';
var RepeatExerciseDao = require("../Dao/DaoRepeatExercise");
const Mongoose = require("../../Middlewares/Mongoose")
function RepeatExerciseController() {}

RepeatExerciseController.prototype.createRepeatExercise = async function (req, res) {
  const requestData = req.body;

  // Decompose version if needed
  // var params = {
  //   topic: "TopicVariable",
  //   access: ["ObjectIDOfUserForAccess"],
  //   exercises: [
  //     { prompt: "exercise1PromptVariable", recording: "exercise1RecordingVariable" },
  //     { prompt: "exercise2PromptVariable", recording: "exercise2RecordingVariable" }
  //   ]
  // }

  try{
    const doc = await RepeatExerciseDao.create(requestData);
    res.status(200).json({data:doc})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

RepeatExerciseController.prototype.deleteRepeatExercises = async function (req, res) {
  const requestData = req.body;
  try{
    const doc = await RepeatExerciseDao.deleteOne({_id:requestData["_id"]});
    res.status(200).json({data:doc})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

RepeatExerciseController.prototype.updateRepeatExercises = async function (req, res) {
  const requestData = req.body;
  var { update, create , deleteData, addAccess, removeAccess} = requestData;
  // Add one more for access

  try{
    var bulkWriteOps = [];
    if (addAccess!=undefined){
      addAccess.forEach(i => {
        var params = { 
          updateOne: {
            filter: {
              _id: i["_id"],
            }, 
            update: { $push: { access: { $each: i["userID"] } } }
          }
        }
        bulkWriteOps.push(params)
      })
    }else if (removeAccess!=undefined){
      removeAccess.forEach(i => {
        var params = { 
          updateOne: {
            filter: {
              _id: i["_id"],
            }, 
            update: { $pull: { access: { $in: i["userID"] } } } 
          }
        }
        bulkWriteOps.push(params)
      })
    }else if (update!=undefined){
      update.forEach(i => {

        var exerciseParams = {}

        if (i["recording"] != null) {
          exerciseParams["exercises.$.recording"] = i["recording"];
        }

        if (i["prompt"] != null) {
          exerciseParams["exercises.$.prompt"] = i["prompt"];
        }

        var params = { 
          updateOne: {
            filter: {
              _id: i["_id"],
              "exercises._id": i["exerciseID"]
            }, 
            update: { 
              $set: exerciseParams
            } 
          }
        }
        bulkWriteOps.push(params)
      })
    }else if(create!=undefined){
      create.forEach(i => {
        console.log(i)
        var params = { 
          updateOne: {
            filter: {
              _id: i["_id"],
            },
            update: { $push: { exercises: { $each: i["exercises"] }} } 
          }
        }
        bulkWriteOps.push(params)
      })
    }else if(deleteData!=undefined){
      deleteData.forEach(i => {
        console.log(i)
        var params = {
          updateOne: {
            filter: { 
              _id: i["_id"],
            },
            update: { $pull: { exercises: { _id: { $in: i["exerciseID"] } } } } 
          }
        }
        bulkWriteOps.push(params)
      })
    }
    const doc = await RepeatExerciseDao.updateMultipleExercises(bulkWriteOps)
    res.status(200).json({data:doc})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

var repeatExerciseController = new RepeatExerciseController()
module.exports = repeatExerciseController
