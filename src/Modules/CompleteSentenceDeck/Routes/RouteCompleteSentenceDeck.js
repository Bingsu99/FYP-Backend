'use strict';
const express = require('express');
const router = express.Router();

var CompleteSentenceDeckController = require("../Controller/ControllerCompleteSentenceDeck")

// Should Migrate to DecksManagement
// Creates a new CompleteSentenceDeck
router.post('/Create', CompleteSentenceDeckController.createCompleteSentenceDeck);
router.post('/Read', CompleteSentenceDeckController.readCompleteSentenceDeck);
router.post('/Exercise', CompleteSentenceDeckController.findOneExercise);
router.post('/Update', CompleteSentenceDeckController.updateCompleteSentenceDeck);
router.post('/Delete', CompleteSentenceDeckController.deleteCompleteSentenceDeck);

module.exports = router;