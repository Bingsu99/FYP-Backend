'use strict';
var RepeatExerciseDao = require("../Dao/DaoRepeatExercise");

function RepeatExerciseController() {}

RepeatExerciseController.prototype.createRepeatExercise = async function (req, res) {
  const requestData = req.body;

  try{
    await RepeatExerciseDao.deleteOneExercise({_id:requestData["_id"]}, requestData["exerciseID"]);
    res.status(200).json({data:data})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

var repeatExerciseController = new RepeatExerciseController()
module.exports = repeatExerciseController
