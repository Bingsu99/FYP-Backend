'use strict';
const express = require('express');
const router = express.Router();
const multer = require("../../../Utilities/multer");

var RepeatSentenceController = require("../Controller/ControllerRepeatSentence")

// Creates a new CompleteSentenceDeck
router.post('/Get', RepeatSentenceController.getTTSRecording);
router.post('/Save', multer.single("file"), RepeatSentenceController.saveToS3);
router.post('/Delete', RepeatSentenceController.delete);
router.post('/Access', RepeatSentenceController.access);
router.post('/Transcribe', multer.single("file"), RepeatSentenceController.saveAndTranscript);

module.exports = router;