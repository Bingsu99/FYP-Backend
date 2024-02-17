'use strict';
const RegistrationTokenModel = require("../Model/ModelRegistrationToken")

function RegistrationTokenDAO() {}

RegistrationTokenDAO.prototype.create = async function (params, session) {
  let registrationTokenDocument = new RegistrationTokenModel(params)
  return await registrationTokenDocument.save({session:session})
}

RegistrationTokenDAO.prototype.findOne = async function (params) {
  console.log(params)
  try{
    let doc = await RegistrationTokenModel.findOne(params)
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

// Idea was to use it for removing emails from the Caregiver list in Patient Document, to track who haven't created an account
// RegistrationTokenDAO.prototype.removeFromCaregiver = async function (params, elementToRemove) {
//   try {
//       let doc = await RegistrationTokenModel.findOneAndUpdate(params, { $pull: { caregiver: elementToRemove } }, { new: true });
//       if (doc) {
//           return doc;
//       } else {
//           console.log('Document not found');
//       }
//   } catch (err) {
//       console.error('Error updating document:', err);
//       // Handle error
//   }
// }

// Idea was to use it for removing emails from the Patient list in Caregiver Document, to track who haven't created an account
// RegistrationTokenDAO.prototype.removeFromPatient = async function (params, elementToRemove) {
//   try {
//     console.log("running inside reg")
//     console.log(params)
//     console.log(elementToRemove)
//       let doc = await RegistrationTokenModel.findOneAndUpdate(params, { $pull: { patient: elementToRemove } }, { new: true });
//       if (doc) {
//         console.log("have doc")
//         console.log(doc)
//           return doc;
//       } else {
//           console.log('Document not found');
//       }
//   } catch (err) {
//       console.error('Error updating document:', err);
//       // Handle error
//   }
// }

var registrationTokenDAO = new RegistrationTokenDAO();
module.exports = registrationTokenDAO;