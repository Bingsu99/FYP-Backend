'use strict';
const RegistrationTokenModel = require("../Model/ModelRegistrationToken")

function RegistrationTokenDAO() {}

RegistrationTokenDAO.prototype.create = async function (params, session) {
  let registrationTokenDocument = new RegistrationTokenModel(params)
  return await registrationTokenDocument.save({session:session})
}

RegistrationTokenDAO.prototype.findOne = async function (params) {
  try{
    let doc = await RegistrationTokenModel.findOne(params)
    console.log('Document not found');
    return doc;
  } catch (err) {
    console.error('Error finding document:', err);
    return null;
  }
}

RegistrationTokenDAO.prototype.deleteOne = async function (params) {
  try {
    let deletedDoc = await RegistrationTokenModel.deleteOne(params);
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

RegistrationTokenDAO.prototype.updateOne = async function (params, update) {
  try {
    let doc = await RegistrationTokenModel.findOneAndUpdate(params, update, { new: true });
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

var registrationTokenDAO = new RegistrationTokenDAO();
module.exports = registrationTokenDAO;