'use strict';
const PatientModel = require("../Model/ModelPatient")

function PatientDAO() {}

PatientDAO.prototype.create = async function (params, session=null) {
    let patientDocument = new PatientModel(params)
    let doc = await patientDocument.save({session:session})
    return doc;
}

PatientDAO.prototype.findOne = async function (params) {
  try{
    let doc = await PatientModel.findOne(params)
    if (doc) {
      return doc
    } else {
      console.log('Document not found (PatientDAO.findOne)');
    }
  } catch (err) {
    console.error('Error finding document:', err);
    // Handle error
  }
}

PatientDAO.prototype.findAll = async function (listOfPatientsObjIDs) {
    let docs = await PatientModel.find({_id: { $in: listOfPatientsObjIDs }});
    return docs;
}


PatientDAO.prototype.deleteOne = async function (params) {
  try {
    let deletedDoc = await PatientModel.deleteOne(params);
    if (deletedDoc.deletedCount > 0) {
      console.log('Document deleted successfully');
    } else {
      console.log('Document not found (PatientDAO.deleteOne)');
    }
  } catch (err) {
    console.error('Error deleting document:', err);
    // Handle error
  }
}

PatientDAO.prototype.updateOne = async function (params, update) {
  let doc = await PatientModel.findOneAndUpdate(params, update, { new: true });
  if (doc) {
    console.log(doc)
    return doc;
  } else {
    console.log('Document not found (PatientDAO.updateOne)');
  }
}

PatientDAO.prototype.addCaregiver = async function (params, elementToAdd, session) {
  try {
      let doc = await PatientModel.findOneAndUpdate(params, { $push: { caregivers: elementToAdd } }, { new: true, session:session });
      if (doc) {
          return doc;
      } else {
          console.log('Document not found (PatientDAO.addCaregiver)');
      }
  } catch (err) {
      console.error('Error updating document:', err);
      // Handle error
  }
}

var patientDAO = new PatientDAO();
module.exports = patientDAO;