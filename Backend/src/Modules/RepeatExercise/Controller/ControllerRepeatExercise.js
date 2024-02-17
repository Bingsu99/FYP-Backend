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
      for (var i in update){
        var params = { 
          updateOne: {
            filter: {
              _id: "repeatExerciseId",
              "exercises._id": "exercise_id_variable" 
            }, 
            update: { 
              $set: { "exercises.$.recording": "new_recording_variable",  "exercises.$.prompt": "new_prompt_variable"} 
            } 
          }
        }
        bulkWriteOps.push(params)
      }
    }else if(create!=undefined){
      for (var i in create){
        var params = { 
          updateOne: {
            filter: {
              _id: "repeatExerciseId",
            }, 
            update: { $push: { exercises: ["array of exercise schema"] } }    // {prompt: "", recording: ""}
          }
        }
        bulkWriteOps.push(params)
      }
    }else if(deleteData!=undefined){
      for (var i in deleteData){
        var params = {
          updateOne: {
            filter: { 
              _id: "repeatExerciseId", 
            },
            update: { $pull: { exercises: { _id: "exercises._id" } } }
          }
        }
        bulkWriteOps.push(params)
      }
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
