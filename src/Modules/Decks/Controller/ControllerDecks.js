'use strict';
var completeSentenceDeckDAO = require("../../CompleteSentenceDeck/Dao/DaoCompleteSentenceDeck");
const Mongoose = require("../../Middlewares/Mongoose")
function DecksController() {}

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
                activity: "Complete The Sentence"
            })
        })
        res.status(200).json({data:resp})
    }catch (err) {
        console.log(err)
        res.status(500).json({error:err.message})
    }
}


var decksController = new DecksController()
module.exports = decksController
