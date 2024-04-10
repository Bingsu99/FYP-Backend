'use strict';
var getRecording = require("../../../Utilities/tts")
var S3 = require("../../../Utilities/S3")
const multer = require("../../../Utilities/multer")


function RepeatSentenceController() {}

RepeatSentenceController.prototype.getTTSRecording = async function (req, res) {
    const requestData = req.body;

    try{
        const audioData = await getRecording(requestData["sentence"])

        res.set('Content-Type', 'audio/mp3');
        res.send(audioData);
    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

RepeatSentenceController.prototype.saveToS3 = async function (req, res) {
    const file = req.file;

    try{
        const response = await S3.uploadFile(file.buffer, "audio/mpeg")

        res.status(200).json({status:"success", data:{"key":response}})
    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

RepeatSentenceController.prototype.access = async function (req, res) {
    const requestData = req.body;
    try{
        const response = await S3.getObjectSignedUrl(requestData["key"])

        res.status(200).json({status:"success", data:{"url":response}})
    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

RepeatSentenceController.prototype.delete = async function (req, res) {
    const requestData = req.body;
    try{
        const response = await S3.deleteFile(requestData["key"])

        res.status(200).json({status:"success"})
    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

RepeatSentenceController.prototype.saveAndTranscript = async function (req, res) {
    const file = req.file;

    try{
        const result = await S3.saveToS3andTranscript(file.buffer, "audio/mpeg")
        console.log(result)

        res.status(200).json({status:"success", data:result})
    }catch (err) {
        console.log(err)
        res.status(500).json({status:"failed", error:err.message})
    }
}

var repeatSentence = new RepeatSentenceController()
module.exports = repeatSentence