'use strict';
const CompleteSentenceDeckModel = require("../Model/ModelCompleteSentenceDeck")

function CompleteSentenceDeckDAO() {}

CompleteSentenceDeckDAO.prototype.create = async function (params) {
  try {
    let completeSentenceDeckDocument = new CompleteSentenceDeckModel(params)
    return await completeSentenceDeckDocument.save()
  } catch (err) {
    console.error('Error finding document:', err);
    // Handle error
  }
}

CompleteSentenceDeckDAO.prototype.findOne = async function (params) {
  try{
    let doc = await CompleteSentenceDeckModel.findOne(params)
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
  try {
    let deletedDoc = await CompleteSentenceDeckModel.deleteOne(params);
    if (deletedDoc.deletedCount > 0) {
      console.log('Document deleted successfully');
    } else {
      console.log('Document not found');
    }
  } catch (err) {
    console.error('Error deleting document:', err);
    // Handle error
  }
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
  try {
    let doc = await CompleteSentenceDeckModel.bulkWrite(bulkUpdates, {session:session});
    if (doc) {
      return doc;
    } else {
      console.log("Document or exercise not found");
    }
  } catch (err) {
    console.error("Error updating CompleteSentenceDeck:", err);
    // Handle error
  }
};

var completeSentenceDeckDAO = new CompleteSentenceDeckDAO();
module.exports = completeSentenceDeckDAO;