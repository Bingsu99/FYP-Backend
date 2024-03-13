'use strict';
const CompleteSentenceResultModel = require("../Model/ModelCompleteSentenceResult")

function CompleteSentenceResultDAO() {}

CompleteSentenceResultDAO.prototype.create = async function (params) {
  let CompleteSentenceResultDocument = new CompleteSentenceResultModel(params)
  let doc = await CompleteSentenceResultDocument.save()
  return doc;
}

CompleteSentenceResultDAO.prototype.findOne = async function (params) {
  // let doc = await CompleteSentenceResultModel.findOne(params)
  // if (doc) {
  //   return doc
  // } else {
  //   console.log('Document not found');
  //   return doc
  // }
}

var CompleteSentenceResultDAO = new CompleteSentenceResultDAO();
module.exports = CompleteSentenceResultDAO;