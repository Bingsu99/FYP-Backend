'use strict';
var completeSentenceDeckDAO = require("../../CompleteSentence/Dao/DaoCompleteSentenceDeck");
var therapistDAO = require("../../Therapist/Dao/DaoTherapist")
var caregiverDAO = require("../../Caregiver/Dao/DaoCaregiver")
var patientDAO = require("../../Patient/Dao/DaoPatient")
const Mongoose = require("../../Middlewares/Mongoose")
function DecksController() {}

// Change this to get ID of patient then use their access list to query.
DecksController.prototype.getAccessDecks = async function (req, res) {
    const requestData = req.body;
    const requestedActivityKey = requestData["activity"];

    try{
        const patientDetails = await patientDAO.findPatientByID(requestData["_id"]);

        if (patientDetails===null){
            res.status(400).json({status:"failed", error:"No patient found"})
            return;
        }
    
        const patientAccess = patientDetails["access"].toObject();;
    
        var resp = [];
    
        for (let activityKey in patientAccess) {
            activityKey = parseInt(activityKey)
            if (requestedActivityKey!==undefined){
                if (activityKey!==requestedActivityKey){
                    continue;
                }
            }

            if (activityKey === 0){
                const arrayOfDecks = await completeSentenceDeckDAO.findAllDecksByID(patientAccess[activityKey]);
                arrayOfDecks.forEach((deck, indx) => {
                    resp.push({
                        _id: deck["_id"],
                        name: deck["name"],
                        numOfExercises: deck["exercises"].length,
                        activity: 0
                    })
                })
            } // To add more Activities as needed
        }
            
        res.status(200).json({"status":"success", data:resp})
    }catch (err) {
        console.log(err)
        res.status(500).json({"status":"failed", error:err.message})
    }
}

// Need change to add support for different activities
DecksController.prototype.getCreatorDecks = async function (req, res) {
    const requestData = req.body;
    const activity = requestData["activity"];
    const params = { 
        creator: requestData["_id"], 
    }

    try{
        var resp = []
        // Add for loop and if-else inside to handle. Should have a single foreach to push
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

        res.status(200).json({"status":"success", data:resp})
    }catch (err) {
        console.log(err)
        res.status(500).json({"status":"failed", error:err.message})
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
        }else{
            res.status(400).json({status:"failed", error:"Invalid Activity Type"})
        } // Add more activities in future if needed

        const params = { _id: requestData["creator"] };
        const update = {
            $push: { [`creator.${activityKey}`]: doc["_id"] }
        };

        // To depreciate the keying in from frontend.
        if (requestData["userType"] == "caregiver"){
            caregiverDAO.updateOne(params, update)
        }else if (requestData["userType"] == "therapist"){
            therapistDAO.updateOne(params, update)
        }else{
            res.status(400).json({status:"failed", error:"Invalid UserType"})
            return;
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
        }else if (requestData["userType"] == "therapist"){
            therapistDAO.updateOne(params, update)
        }else{
            res.status(500).json({status:"failed", error:"Invalid userType"})
            return;
        }
        
        // Handle removing of deckID from patient's access list
        for (const userID of doc["access"]) {
            const searchParams = { _id: userID };
            const updateParams = {
                $pull: { [`access.${activityKey}`]: doc["_id"] }
            };
            await patientDAO.updateOne(searchParams, updateParams);
        }

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
            if (doc===null){
                res.status(400).json({status:"failed", error:"No decks found"})
                return;
            }
        } else{
            res.status(400).json({status:"failed", error:"Invalid activityType"})
            return;
        } // Add more activities in future if needed

        let modifiedExercises = doc["exercises"].map(exercise => {
            let plainExercise = exercise.toObject();
            return { ...plainExercise, activity: activityKey,  deckID: doc["_id"]};
        });

        var resp={
            name: doc["name"],
            _id: doc["_id"],
            exercises: modifiedExercises     
        }

        res.status(200).json({status:"success", data: resp})

    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

// Better to add session and manage transaction here
DecksController.prototype.updateDeck = async function (req, res) {
    const requestData = req.body;
    var { update, create , deleteData, addAccess, removeAccess} = requestData;
    const activityKey = requestData["activity"];

    var bulkWriteOps = [];
    if (addAccess!=undefined){
        addAccess.forEach(async (i) => {
            // For updating the access list in Activity
            var params = { 
                updateOne: {
                filter: {
                    _id: i["_id"],
                }, 
                update: { $push: { access: { $each: i["userID"] } } }
                }
            }
            bulkWriteOps.push(params)

            // For updating the patient access list
            i["userID"].forEach(async (userID)=>{
                const searchParams = { _id: userID };
                const updateParams = {
                    $push: { [`access.${activityKey}`]: new Mongoose.client.Types.ObjectId(i["_id"]) }
                };
                await patientDAO.updateOne(searchParams, updateParams)
            })
        })
    }else if (removeAccess!=undefined){
        // For updating the access list in Activity
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

            // For updating the patient access list
            i["userID"].forEach(async (userID)=>{
                const searchParams = { _id: new Mongoose.client.Types.ObjectId(userID) };
                const updateParams = {
                    $pull: { [`access.${activityKey}`]: new Mongoose.client.Types.ObjectId(i["_id"]) }
                };
                await patientDAO.updateOne(searchParams, updateParams)
            })
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
                _id: new Mongoose.client.Types.ObjectId(i["_id"]),
                "exercises._id": new Mongoose.client.Types.ObjectId(i["exerciseID"])
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
            res.status(200).json({status:"success", data:result})
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
