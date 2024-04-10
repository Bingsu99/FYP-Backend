'use strict';
var completeSentenceDeckDAO = require("../../CompleteSentence/Dao/DaoCompleteSentenceDeck");
var repeatSentenceDeckDAO = require("../../RepeatSentence/Dao/DaoRepeatSentenceDeck");
var therapistDAO = require("../../Therapist/Dao/DaoTherapist")
var caregiverDAO = require("../../Caregiver/Dao/DaoCaregiver")
var patientDAO = require("../../Patient/Dao/DaoPatient")
var Constants = require("../../../Constants")
var S3 = require("../../../Utilities/S3")
var getRecording = require("../../../Utilities/tts")
const Mongoose = require("../../Middlewares/Mongoose")
var generateContent = require("../../../Utilities/OpenAI")

function DecksController() {}

// Change this to get ID of patient then use their access list to query.
DecksController.prototype.getAccessDecks = async function (req, res) {
    const requestData = req.body;
    const requestedActivityKey = requestData["activity"] ? parseInt(requestData["activity"]) : requestData["activity"];

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
                        activity: activityKey
                    })
                })
            }else if (activityKey === 1){
                const arrayOfDecks = await repeatSentenceDeckDAO.findAllDecksByID(patientAccess[activityKey]);
                arrayOfDecks.forEach((deck, indx) => {
                    resp.push({
                        _id: deck["_id"],
                        name: deck["name"],
                        numOfExercises: deck["exercises"].length,
                        activity: activityKey
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
    const requestedActivityKey = requestData["activity"] ? parseInt(requestData["activity"]) : requestData["activity"];
    const params = { 
        creator: requestData["_id"], 
    }

    const activitiesKeys = Object.keys(Constants.numsToActivity);

    try{
        var resp = []
        // Add for loop and if-else inside to handle. Should have a single foreach to push

        for (let activityKey in activitiesKeys) {
            activityKey = parseInt(activityKey)
            if (requestedActivityKey!==undefined){
                if (activityKey!==requestedActivityKey){
                    continue;
                }
            }

            if (activityKey === 0){
                const docs = await completeSentenceDeckDAO.findAllCreator(params);
                docs.forEach((doc, indx) => {
                    resp.push({
                        _id: doc["_id"],
                        name: doc["name"],
                        numOfExercises: doc["exercises"].length,
                        activity: activityKey
                    })
                })
            }else if (activityKey === 1){
                const docs = await repeatSentenceDeckDAO.findAllCreator(params);
                docs.forEach((doc, indx) => {
                    resp.push({
                        _id: doc["_id"],
                        name: doc["name"],
                        numOfExercises: doc["exercises"].length,
                        activity: activityKey
                    })
                })
            } // Repeat for different exercises
        }

        res.status(200).json({"status":"success", data:resp})
    }catch (err) {
        console.log(err)
        res.status(500).json({"status":"failed", error:err.message})
    }
}

DecksController.prototype.createDeck = async function (req, res) {
    // Need name of deck, creatorID and userType, activity(in number)
    const requestData = req.body;
    const activityKey = requestData["activity"] ? parseInt(requestData["activity"]) : requestData["activity"];
    const deckParams = {
        creator: requestData["creator"],
        name: requestData["name"]
    }

    var doc;
    try{
        if (activityKey === 0){
            doc = await completeSentenceDeckDAO.create(deckParams)
        }else if (activityKey === 1){
            doc = await repeatSentenceDeckDAO.create(deckParams)
        }else{
            res.status(400).json({status:"failed", error:"Invalid Activity Type"})
            return;
        } // Add more activities in future if needed

        const params = { _id: requestData["creator"] };
        const update = {
            $push: { [`creator.${activityKey}`]: doc["_id"] }
        };

        // To depreciate the keying in from frontend.
        if (requestData["userType"] === "caregiver"){
            caregiverDAO.updateOne(params, update)
        }else if (requestData["userType"] === "therapist"){
            therapistDAO.updateOne(params, update)
        }else{
            res.status(400).json({status:"failed", error:"Invalid UserType"})
            return;
        }

        const resp = {
            _id: doc["_id"]
        }

        res.status(200).json({status:"success", data:resp})
        return;

    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

DecksController.prototype.deleteDeck = async function (req, res) {
    // Need deckID, userID and userType, activity(in number)
    const requestData = req.body;
    const activityKey = requestData["activity"] ? parseInt(requestData["activity"]) : requestData["activity"];

    var doc;
    try{
        if (activityKey === 0){
            doc = await completeSentenceDeckDAO.deleteOne({_id:requestData["_id"]});
        }else if (activityKey === 1){
            doc = await repeatSentenceDeckDAO.deleteOne({_id:requestData["_id"]});
            console.log(doc)
            doc["exercises"].forEach(async(exercise)=>{
                await S3.deleteFile(exercise["recording"]);
            });
        }else{
            res.status(400).json({status:"failed", error:"No activity type specified"})
            return;
        } // Add more activities in future if needed
        
        // Handle delete of ID from creator list in Therapist and Caregivers
        const params = { _id: doc["creator"] };
        const update = {
            $pull: { [`creator.${activityKey}`]: doc["_id"] }
        };
        
        if (requestData["userType"] === "caregiver"){
            caregiverDAO.updateOne(params, update)
        }else if (requestData["userType"] === "therapist"){
            therapistDAO.updateOne(params, update)
        }else{
            res.status(500).json({status:"failed", error:"Invalid userType"})
            return;
        }
        
        // Handle removing of deckID from patient's access list and daily assignment
        for (const userID of doc["access"]) {
            const searchParams = { _id: userID };
            const updateParams = {
                $pull: {
                    [`access.${activityKey}`]: doc["_id"],
                    [`dailyAssignment.decks.${activityKey}`]: doc["_id"]
                }
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
    const activityKey = requestData["activity"] ? parseInt(requestData["activity"]) : requestData["activity"];

    var doc;

    try{
        if (activityKey === 0){
            doc = await completeSentenceDeckDAO.findOne({_id:requestData["_id"]});
            if (doc===null){
                res.status(400).json({status:"failed", error:"No decks found"})
                return;
            }
        }else if (activityKey === 1){
            doc = await repeatSentenceDeckDAO.findOne({_id:requestData["_id"]});
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

DecksController.prototype.AIGenerate = async function (req, res) {
    const requestData = req.body;
    const activityKey = requestData["activity"] ? parseInt(requestData["activity"]) : requestData["activity"];

    try{
        const deckParams = {
            creator: requestData["creator"],
            name: requestData["name"]
        }
    
        var deckDocument;
        var generatedContent=[];
        var bulkWriteOps = [];
        if (activityKey === 0){
            deckDocument = await completeSentenceDeckDAO.create(deckParams)
            const response = JSON.parse(await generateContent(activityKey, requestData["numOfExercises"], requestData["content"]));
            generatedContent = response["data"]
            
        }else if (activityKey === 1){
            deckDocument = await repeatSentenceDeckDAO.create(deckParams)
            const response = JSON.parse(await generateContent(activityKey, requestData["numOfExercises"], requestData["content"]));
            for (const exercise of response["data"]) {
                const recording = await getRecording(exercise["sentence"]);
                const recordingKey = await S3.uploadFile(recording);
                generatedContent.push({"sentence": exercise["sentence"], "recording": recordingKey});
            }
        } else{
            res.status(400).json({status:"failed", error:"Invalid activityType"})
            return;
        } // Add more activities in future if needed

        // Saving Exercises to deck
        var updateParams = { 
            updateOne: {
                filter: {
                    _id: deckDocument["_id"],
                },
                update: { $push: { exercises: { $each: generatedContent }} } 
            }
        }

        if (activityKey === 0){
            await completeSentenceDeckDAO.updateMultipleExercises([updateParams])
        }else if (activityKey === 1){
            await repeatSentenceDeckDAO.updateMultipleExercises([updateParams])
        } // Add more activities in future if needed
    
        // Saving to access list of creator
        const params = { _id: requestData["creator"] };
        const update = {
            $push: { [`creator.${activityKey}`]: deckDocument["_id"] }
        };
        // To depreciate the keying in from frontend.
        if (requestData["userType"] === "caregiver"){
            caregiverDAO.updateOne(params, update)
        }else if (requestData["userType"] === "therapist"){
            therapistDAO.updateOne(params, update)
        }else{
            res.status(400).json({status:"failed", error:"Invalid UserType"})
            return;
        }
            
        res.status(200).json({"status":"success", data:{"_id" : deckDocument["_id"]}})
    }catch (err) {
        console.log(err)
        res.status(500).json({"status":"failed", error:err.message})
    }
}

// Better to add session and manage transaction here
DecksController.prototype.updateDeck = async function (req, res) {
    const requestData = req.body;
    var { update, create , deleteData, addAccess, removeAccess} = requestData;
    const activityKey = requestData["activity"] ? parseInt(requestData["activity"]) : requestData["activity"];

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
                const searchParams = { _id: new Mongoose.client.Types.ObjectId(userID) };
                const updateParams = {
                    $push: { [`access.${activityKey}`]: new Mongoose.client.Types.ObjectId(i["_id"]) },
                };
                const response = await patientDAO.updateOne(searchParams, updateParams)
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
        if (activityKey === 0){
            result = await completeSentenceDeckDAO.updateMultipleExercises(bulkWriteOps)
        }else if (activityKey === 1){
            result = await repeatSentenceDeckDAO.updateMultipleExercises(bulkWriteOps)
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

DecksController.prototype.getDailyAssignment = async function (req, res) {
    const requestData = req.body;
    
    try{
        const patientData = await patientDAO.findPatientByID(requestData["_id"]);
        res.status(200).json({"status":"success", data:{"dailyAssignment": patientData["dailyAssignment"]}})
    }catch (err) {
        console.log(err)
        res.status(500).json({"status":"failed", error:err.message})
    }
}

DecksController.prototype.updateDailyAssignment = async function (req, res) {
    const requestData = req.body;
    const objectIdDecks = requestData["decks"].map(id => new Mongoose.client.Types.ObjectId(id));
    try{
        const patientData = await patientDAO.updateDailyAssignment(requestData["_id"], requestData["activity"], objectIdDecks, requestData["numExercises"]);
        res.status(200).json({"status":"success", data:patientData})
    }catch (err) {
        console.log(err)
        res.status(500).json({"status":"failed", error:err.message})
    }
}

function allocateExercises(decks, remainingExercises, deckLimits) {
    if (decks.length === 0){
        return {};
    }

    let allocation = {};

    for (let i = 0; i < decks.length - 1; i++) {
        let maxPossible = remainingExercises - (decks.length - i - 1);
        let deckLimit = deckLimits[decks[i]] !== undefined ? deckLimits[decks[i]] : maxPossible;
        let allocationForDeck = Math.floor(Math.random() * (Math.min(maxPossible, deckLimit) + 1));

        allocation[decks[i]] = allocationForDeck;
        remainingExercises -= allocationForDeck;
    }

    // Ensure the last deck's allocation does not exceed its limit or the remaining exercises
    let lastDeckLimit = deckLimits[decks[decks.length - 1]] !== undefined ? deckLimits[decks[decks.length - 1]] : remainingExercises;
    allocation[decks[decks.length - 1]] = Math.min(remainingExercises, lastDeckLimit);

    return allocation;
}

function getRandomElementsFromArray(deckDetails, numberOfElements, activityKey) {
    var exerciseArray = deckDetails["exercises"];
    var exerciseArrayCopy = JSON.parse(JSON.stringify(exerciseArray))
    let arrayCopy = [...exerciseArrayCopy];
    let result = [];
  
    for (let i = 0; i < numberOfElements; i++) {
      let index = Math.floor(Math.random() * arrayCopy.length);
      arrayCopy[index]["deckID"] = deckDetails["_id"];
      arrayCopy[index]["activity"] = activityKey;
      arrayCopy[index]["dailyAssignment"] = true;

      result.push(arrayCopy[index]);
      arrayCopy.splice(index, 1);
    }
  
    return result;
}

DecksController.prototype.executeDailyAssignment = async function (req, res) {
    const requestData = req.body;

    try{
        const rawData = await patientDAO.findPatientByID(requestData["_id"]);
        const patientData = rawData.toObject();
        var completedNumbers = {}
        var activities = []

        Object.keys(patientData["dailyAssignmentRecord"]["completed"]).forEach((key) => {
            completedNumbers[key] = patientData["dailyAssignmentRecord"]["completed"][key].length;
        });

        const keys = Object.keys(Constants.numsToActivity);

        for (let activityKey of keys) {
            let exercisesLengthMap = {};
            for (let deckID of patientData["dailyAssignment"]["decks"][activityKey]) {
                let deck;
                if (activityKey === '0'){
                    deck = await completeSentenceDeckDAO.findOne({ "_id": deckID });
                }else{
                    deck = await repeatSentenceDeckDAO.findOne({ "_id": deckID });
                }

                if (deck) {
                    exercisesLengthMap[deckID] = deck.exercises.length;
                } else {
                    exercisesLengthMap[deckID] = 0;
                    console.log(`Deck with ID ${deckID} was not found.`);
                }
            }
            const numExerciseLeft = patientData["dailyAssignment"]["exerciseRequirements"][activityKey] - completedNumbers[activityKey];
            const allocation = allocateExercises(patientData["dailyAssignment"]["decks"][activityKey], numExerciseLeft, exercisesLengthMap);

            console.log(allocation)

            for (let [deckID, numberOfExercise] of Object.entries(allocation)) {
                if (activityKey === '0'){
                    var deckDetails = await completeSentenceDeckDAO.findOne({"_id": deckID});
                    var exercisesSelected = getRandomElementsFromArray(deckDetails, numberOfExercise, activityKey);
                    activities.push(...exercisesSelected);
                } 
                else if (activityKey === '1'){
                    var deckDetails  = await repeatSentenceDeckDAO.findOne({"_id": deckID});
                    console.log(deckDetails)
                    var exercisesSelected = getRandomElementsFromArray(deckDetails, numberOfExercise, activityKey);
                    activities.push(...exercisesSelected);
                }
            }
        }

        res.status(200).json({"status":"success", data:activities})
    }catch (err) {
        console.log(err)
        res.status(500).json({"status":"failed", error:err.message})
    }
}

var decksController = new DecksController()
module.exports = decksController