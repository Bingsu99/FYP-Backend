'use strict';
const RepeatSentenceDeckModel = require("../Model/ModelRepeatSentenceDeck")

function RepeatSentenceDeckDAO() {}

RepeatSentenceDeckDAO.prototype.create = async function (params) {
    let repeatSentenceDeckDocument = new RepeatSentenceDeckModel(params)
    let doc = await repeatSentenceDeckDocument.save()
    return doc;
}

RepeatSentenceDeckDAO.prototype.findOne = async function (params) {
  let doc = await RepeatSentenceDeckModel.findOne(params)
  if (doc) {
    return doc
  } else {
    console.log('Document not found');
    return doc
  }
}

RepeatSentenceDeckDAO.prototype.findOneExercise = async function (params) {
  try{
    let doc = await RepeatSentenceDeckModel.findOne(params, { 'exercises.$': 1})
    if (doc) {
      return doc
    } else {
      console.log('Document not found');
    }
  } catch (err) {
    console.error('Error finding document:', err);
    // Handle error
  }
}

RepeatSentenceDeckDAO.prototype.deleteOne = async function (params) {
  let deletedDoc = await RepeatSentenceDeckModel.findOneAndDelete(params);
  return deletedDoc;
}

RepeatSentenceDeckDAO.prototype.findAllAccess = async function (params) {
  try{
    let doc = await RepeatSentenceDeckModel.find(params)
    if (doc) {
      return doc
    } else {
      console.log('Document not found');
    }
  } catch (err) {
    console.error('Error finding document:', err);
    // Handle error
  }
}

RepeatSentenceDeckDAO.prototype.findAllDecksByID = async function (deckIDs) {
    let doc = await RepeatSentenceDeckModel.find({_id: { $in: deckIDs }})
    return doc;
}

RepeatSentenceDeckDAO.prototype.findAllCreator = async function (params) {
  try{
    let doc = await RepeatSentenceDeckModel.find(params)
    if (doc) {
      return doc
    } else {
      console.log('Document not found');
    }
  } catch (err) {
    console.error('Error finding document:', err);
    // Handle error
  }
}

// BulkWrite format
// const bulkUpdates = [
//   { updateOne: { filter: { "exercises._id": exerciseId1 }, update: { $set: { "exercises.$.recording": "new-recording1.mp3" } } } },
//   { updateOne: { filter: { "exercises._id": exerciseId2 }, update: { $set: { "exercises.$.prompt": "New prompt" } } } },
//   // ... more update operations as needed
// ];
RepeatSentenceDeckDAO.prototype.updateMultipleExercises = async function (bulkUpdates, session) {
  let doc = await RepeatSentenceDeckModel.bulkWrite(bulkUpdates, {session:session});
  return doc;
};

var repeatSentenceDeckDAO = new RepeatSentenceDeckDAO();
module.exports = repeatSentenceDeckDAO;