'use strict';
const CaregiverModel = require("../Model/ModelCaregiver")

function CaregiverDAO() {}

CaregiverDAO.prototype.create = async function (params, session=null) {
  let caregiverDocument = new CaregiverModel(params)
  return await caregiverDocument.save({session:session})
}

CaregiverDAO.prototype.findOne = async function (params) {
    let doc = await CaregiverModel.findOne(params)
    return doc;
}

CaregiverDAO.prototype.deleteOne = async function (params) {
  try {
    let deletedDoc = await CaregiverModel.deleteOne(params);
    if (deletedDoc.deletedCount > 0) {
      console.log('Document deleted successfully');
    } else {
      console.log('Document not found (CaregiverDAO.deleteOne)');
    }
  } catch (err) {
    console.error('Error deleting document:', err);
    // Handle error
  }
}

CaregiverDAO.prototype.updateOne = async function (params, update) {
  let doc = await CaregiverModel.findOneAndUpdate(params, update, { new: true });
  if (doc) {
    console.log(doc)
    return doc;
  } else {
    console.log('Document not found (CaregiverDAO.updateOne)');
  }
}

CaregiverDAO.prototype.addPatient = async function (params, elementToAdd, session) {
  try {
      let doc = await CaregiverModel.findOneAndUpdate(params, { $push: { patients: elementToAdd } }, { new: true, session:session });
      if (doc) {
          return doc;
      } else {
          console.log('Document not found (CaregiverDAO.addPatient)');
      }
  } catch (err) {
      console.error('Error updating document:', err);
      // Handle error
  }
}

var caregiverDAO = new CaregiverDAO();
module.exports = caregiverDAO;