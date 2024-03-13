'use strict';
const TherapistModel = require("../Model/ModelTherapist")

function TherapistDAO() {}

TherapistDAO.prototype.create = async function (params) {
  let therapistDocument = new TherapistModel(params)
  return await therapistDocument.save()
}

TherapistDAO.prototype.findOne = async function (params) {
    let doc = await TherapistModel.findOne(params)
    return doc
}

TherapistDAO.prototype.deleteOne = async function (params) {
  try {
    let deletedDoc = await TherapistModel.deleteOne(params);
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

TherapistDAO.prototype.updateOne = async function (params, update) {
  let doc = await TherapistModel.findOneAndUpdate(params, update, { new: true });
  if (doc) {
    console.log(doc)
    return doc;
  } else {
    console.log('Document not found');
  }
}

TherapistDAO.prototype.addPatient = async function (params, elementToAdd, session) {
  try {
      let doc = await TherapistModel.findOneAndUpdate(params, { $push: { patients: elementToAdd } }, { new: true, session:session });
      if (doc) {
          return doc;
      } else {
          console.log('Document not found (TherapistDAO.addPatient)');
      }
  } catch (err) {
      console.error('Error updating document:', err);
      // Handle error
  }
}

var therapistDAO = new TherapistDAO();
module.exports = therapistDAO;