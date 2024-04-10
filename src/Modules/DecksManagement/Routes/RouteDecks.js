'use strict';
const express = require('express');
const router = express.Router();

var DecksController = require("../Controller/ControllerDecks")

// Creates a new CompleteSentenceDeck
router.post('/Access', DecksController.getAccessDecks);
router.post('/Creator', DecksController.getCreatorDecks);
router.post('/Create', DecksController.createDeck);
router.post('/Read', DecksController.readDeck);
router.post('/Update', DecksController.updateDeck);
router.post('/Delete', DecksController.deleteDeck);
router.post('/AIGenerate', DecksController.AIGenerate);
router.post('/DailyAssignment', DecksController.getDailyAssignment);
router.put('/DailyAssignment', DecksController.updateDailyAssignment);
router.post('/ExecuteDailyAssignment', DecksController.executeDailyAssignment);

module.exports = router;