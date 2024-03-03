'use strict';
var completeSentenceDeckDAO = require("../Dao/DaoCompleteSentenceDeck");
var caregiverDAO = require("../../Caregiver/Dao/DaoCaregiver")
const Mongoose = require("../../Middlewares/Mongoose")
function CompleteSentenceController() {}

CompleteSentenceController.prototype.createCompleteSentenceDeck = async function (req, res) {
  const requestData = req.body;
  const deckParams = {
    creator: requestData["creator"],
    name: requestData["name"]
  }
  try{
    const doc = await completeSentenceDeckDAO.create(deckParams);

    const params = { _id: requestData["creator"] };
    const update = { $push: { completeSentence_deck: doc["_id"] }};

    caregiverDAO.updateOne(params, update)

    const resp = {
      _id: doc["_id"]
    }
    res.status(200).json({data:resp})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

CompleteSentenceController.prototype.deleteCompleteSentenceDeck = async function (req, res) {
  const requestData = req.body;
  try{
    const doc = await completeSentenceDeckDAO.deleteOne({_id:requestData["_id"]});
    res.status(200).json({data:doc})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

CompleteSentenceController.prototype.readCompleteSentenceDeck = async function (req, res) {
  const requestData = req.body;
  try{
    const doc = await completeSentenceDeckDAO.findOne({_id:requestData["_id"]});
    var resp = {
      "_id": doc["_id"],
      "name": doc["name"],
      "exercises": doc["exercises"]
    }
    res.status(200).json({data:resp})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

CompleteSentenceController.prototype.findOneExercise = async function (req, res) {
  const requestData = req.body;
  const params = { 
    _id: requestData["_id"], 
    "exercises._id": requestData["exerciseID"]
  }
  try{
    const doc = await completeSentenceDeckDAO.findOneExercise(params);
    res.status(200).json({data:doc})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

CompleteSentenceController.prototype.updateCompleteSentenceDeck = async function (req, res) {
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

        if (i["sentence"] != null) {
          exerciseParams["exercises.$.sentence"] = i["sentence"];
        }

        if (i["wordsToHide"] != null) {
          exerciseParams["exercises.$.wordsToHide"] = i["wordsToHide"];
        }

        if (i["incorrectWords"] != null) {
          exerciseParams["exercises.$.incorrectWords"] = i["incorrectWords"];
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
    const doc = await completeSentenceDeckDAO.updateMultipleExercises(bulkWriteOps)
    res.status(200).json({data:doc})
  }catch (err) {
    console.log(err)
    res.status(500).json({error:err.message})
  }
}

var completeSentenceDeckController = new CompleteSentenceController()
module.exports = completeSentenceDeckController
