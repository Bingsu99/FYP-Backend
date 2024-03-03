'use strict';
const express = require('express');
const router = express.Router();

var DecksController = require("../Controller/ControllerDecks")

// Creates a new CompleteSentenceDeck
router.post('/Access', DecksController.getAccessDecks);
router.post('/Creator', DecksController.getCreatorDecks);

module.exports = router;