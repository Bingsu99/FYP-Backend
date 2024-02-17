'use strict';
const RepeatExerciseModel = require("../Model/ModelRepeatExercise")

function RepeatExerciseDAO() {}

RepeatExerciseDAO.prototype.create = async function (params) {
  let repeatExerciseDocument = new RepeatExerciseModel(params)
  return await repeatExerciseDocument.save()
}

RepeatExerciseDAO.prototype.findOne = async function (params) {
  try{
    let doc = await RepeatExerciseModel.findOne(params)
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

RepeatExerciseDAO.prototype.deleteOne = async function (params) {
  try {
    let deletedDoc = await RepeatExerciseModel.deleteOne(params);
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

RepeatExerciseDAO.prototype.updateOne = async function (params, update) {
  try {
    let doc = await RepeatExerciseModel.findOneAndUpdate(params, update, { new: true });
    if (doc) {
      return doc;
    } else {
      console.log('Document not found');
    }
  } catch (err) {
    console.error('Error updating document:', err);
    // Handle error
  }
}

RepeatExerciseDAO.prototype.deleteOneExercise = async function (params, exerciseID) {
  try{
    let doc = await RepeatExerciseModel.findOneAndUpdate(params, { $pull: { exercises: { _id: exerciseID } } }, { new: true });
    if (doc) {
        return doc;
    } else {
        console.log('Document not found');
    }
  } catch (err) {
      console.error('Error updating document:', err);
      // Handle error
  }
}



RepeatExerciseDAO.prototype.updateOneExercise = async function (params, exerciseId, updateData) {
  try {
    let doc = await RepeatExerciseModel.findOneAndUpdate(
      { ...params, "exercises._id": exerciseId },
      { $set: { "exercises.$": updateData } }, // updateData {"fieldToChange, updateValue"}
      { new: true }
    );

    if (doc) {
      return doc;
    } else {
      console.log("Document or exercise not found");
    }
  } catch (err) {
    console.error("Error updating exercise:", err);
    // Handle error
  }
};

// BulkWrite format
// const bulkUpdates = [
//   { updateOne: { filter: { "exercises._id": exerciseId1 }, update: { $set: { "exercises.$.recording": "new-recording1.mp3" } } } },
//   { updateOne: { filter: { "exercises._id": exerciseId2 }, update: { $set: { "exercises.$.prompt": "New prompt" } } } },
//   // ... more update operations as needed
// ];
RepeatExerciseDAO.prototype.updateMultipleExercises = async function (bulkUpdates) {
  try {
    let doc = await RepeatExerciseModel.bulkWrite(bulkUpdates);

    if (doc) {
      return doc;
    } else {
      console.log("Document or exercise not found");
    }
  } catch (err) {
    console.error("Error updating exercise:", err);
    // Handle error
  }
};

var repeatExerciseDAO = new RepeatExerciseDAO();
module.exports = repeatExerciseDAO;