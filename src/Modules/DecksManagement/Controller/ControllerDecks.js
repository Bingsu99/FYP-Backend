'use strict';
var completeSentenceDeckDAO = require("../../CompleteSentenceDeck/Dao/DaoCompleteSentenceDeck");
var therapistDAO = require("../../Therapist/Dao/DaoTherapist")
var caregiverDAO = require("../../Caregiver/Dao/DaoCaregiver")
var patientDAO = require("../../Patient/Dao/DaoPatient")
const Mongoose = require("../../Middlewares/Mongoose")
function DecksController() {}

// For patients. Not done yet
DecksController.prototype.getAccessDecks = async function (req, res) {
    const requestData = req.body;
    const params = { 
        access: requestData["_id"], 
    }

    try{
        var resp = []
        const docs = await completeSentenceDeckDAO.findAllAccess(params);
        docs.forEach((doc, indx) => {
            resp.push({
                _id: doc["_id"],
                name: doc["name"],
                numOfExercises: doc["exercises"].length,
                activity: "Complete The Sentence"
            })
        })
        res.status(200).json({data:resp})
    }catch (err) {
        console.log(err)
        res.status(500).json({error:err.message})
    }
}

// Need change to add support for different activities
DecksController.prototype.getCreatorDecks = async function (req, res) {
    const requestData = req.body;
    const params = { 
        creator: requestData["_id"], 
    }

    try{
        var resp = []
        const docs = await completeSentenceDeckDAO.findAllCreator(params);
        docs.forEach((doc, indx) => {
            resp.push({
                _id: doc["_id"],
                name: doc["name"],
                numOfExercises: doc["exercises"].length,
                activity: 0
            })
        })
        // Repeat for different exercises

        res.status(200).json({data:resp})
    }catch (err) {
        console.log(err)
        res.status(500).json({error:err.message})
    }
}

DecksController.prototype.createDeck = async function (req, res) {
    // Need name of deck, creatorID and userType, activity(in number)
    const requestData = req.body;
    const activityKey = requestData["activity"];
    const deckParams = {
        creator: requestData["creator"],
        name: requestData["name"]
    }

    var doc;
    try{
        if (activityKey == 0){
            doc = await completeSentenceDeckDAO.create(deckParams)
        } // Add more activities in future if needed
        const params = { _id: requestData["creator"] };
        const update = {
            $push: { [`creator.${activityKey}`]: doc["_id"] }
        };

        
        if (requestData["userType"] == "caregiver"){
            caregiverDAO.updateOne(params, update)
        }else{
            therapistDAO.updateOne(params, update)
        }

        const resp = {
            _id: doc["_id"]
        }

        res.status(200).json({status:"success", data:resp})

    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

DecksController.prototype.deleteDeck = async function (req, res) {
    // Need deckID, userID and userType, activity(in number)
    const requestData = req.body;
    const activityKey = requestData["activity"];

    var doc;
    try{
        if (activityKey == 0){
            doc = await completeSentenceDeckDAO.deleteOne({_id:requestData["_id"]});
        }else{
            res.status(400).json({status:"failed", error:"No activity type specified"})
            return;
        } // Add more activities in future if needed
        
        // Handle delete of ID from creator list in Therapist and Caregivers
        const params = { _id: doc["creator"] };
        const update = {
            $pull: { [`creator.${activityKey}`]: doc["_id"] }
        };
        
        if (requestData["userType"] == "caregiver"){
            caregiverDAO.updateOne(params, update)
        }else{
            therapistDAO.updateOne(params, update)
        }
        // Need handle removing access from patients too. (Search access list inside the completeSentenceDeckDAO's access and go to each patient and remove them)

        res.status(200).json({status:"success"})

    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

DecksController.prototype.readDeck = async function (req, res) {
    // Need deckID, userID, activity(in number)
    const requestData = req.body;
    const activityKey = requestData["activity"];

    var doc;

    try{
        if (activityKey == 0){
            doc = await completeSentenceDeckDAO.findOne({_id:requestData["_id"]});
        } // Add more activities in future if needed

        res.status(200).json({status:"success", data: doc})

    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

DecksController.prototype.updateDeck = async function (req, res) {
    // Need deckID, userID, activity(in number)
    const requestData = req.body;
    var { update, create , deleteData, addAccess, removeAccess} = requestData;
    const activityKey = requestData["activity"];

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

        for (const key in i) {
            if (key === '_id' || key === "exerciseID") {
                continue
            }
            exerciseParams[`exercises.$.${key}`] = i[key];
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

    try{
        var result
        if (activityKey == 0){
            result = await completeSentenceDeckDAO.updateMultipleExercises(bulkWriteOps)
        } // Add more activities in future if needed

        if (result !== null){
            res.status(200).json({status:"success"})
        }else{
            res.status(500).json({status:"failed", error:"Error with updating"})
        }

    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

var decksController = new DecksController()
module.exports = decksController
