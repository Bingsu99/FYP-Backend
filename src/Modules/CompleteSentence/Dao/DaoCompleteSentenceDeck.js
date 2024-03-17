'use strict';
const CompleteSentenceDeckModel = require("../Model/ModelCompleteSentenceDeck")

function CompleteSentenceDeckDAO() {}

CompleteSentenceDeckDAO.prototype.create = async function (params) {
    let completeSentenceDeckDocument = new CompleteSentenceDeckModel(params)
    let doc = await completeSentenceDeckDocument.save()
    return doc;
}

CompleteSentenceDeckDAO.prototype.findOne = async function (params) {
  let doc = await CompleteSentenceDeckModel.findOne(params)
  if (doc) {
    return doc
  } else {
    console.log('Document not found');
    return doc
  }
}

CompleteSentenceDeckDAO.prototype.findOneExercise = async function (params) {
  try{
    let doc = await CompleteSentenceDeckModel.findOne(params, { 'exercises.$': 1})
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

CompleteSentenceDeckDAO.prototype.deleteOne = async function (params) {
  let deletedDoc = await CompleteSentenceDeckModel.findOneAndDelete(params);
  return deletedDoc;
}

CompleteSentenceDeckDAO.prototype.findAllAccess = async function (params) {
  try{
    let doc = await CompleteSentenceDeckModel.find(params)
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

CompleteSentenceDeckDAO.prototype.findAllDecksByID = async function (deckIDs) {
    let doc = await CompleteSentenceDeckModel.find({_id: { $in: deckIDs }})
    return doc;
}

CompleteSentenceDeckDAO.prototype.findAllCreator = async function (params) {
  try{
    let doc = await CompleteSentenceDeckModel.find(params)
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
CompleteSentenceDeckDAO.prototype.updateMultipleExercises = async function (bulkUpdates, session) {
  let doc = await CompleteSentenceDeckModel.bulkWrite(bulkUpdates, {session:session});
  return doc;
};

var completeSentenceDeckDAO = new CompleteSentenceDeckDAO();
module.exports = completeSentenceDeckDAO;