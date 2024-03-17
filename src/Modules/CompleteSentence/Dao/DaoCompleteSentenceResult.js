'use strict';
const CompleteSentenceResultModel = require("../Model/ModelCompleteSentenceResult")

function CompleteSentenceResultDAO() {}

CompleteSentenceResultDAO.prototype.create = async function (params) {
  let CompleteSentenceResultDocument = new CompleteSentenceResultModel(params)
  let doc = await CompleteSentenceResultDocument.save()
  return doc;
}

CompleteSentenceResultDAO.prototype.getResultsByDay = async function (startDate, endDate) {
  
  const getDocumentsGroupedByDate = async () => {
    const startDateObj = new Date(parseInt(startDate));
    const endDateObj = new Date(parseInt(endDate));
  
    const results = await CompleteSentenceResultModel.aggregate([
        {$match: {
            datetime: {
            $gte: startDateObj,
            $lte: endDateObj
            }
        }},
        {$addFields: {
            date: {
            $dateToString: { format: "%Y-%m-%d", date: "$datetime" }
            }
        }},
        {$group: {
            _id: "$date",
            documents: { $push: "$$ROOT" }
        }},
        {$project: {
            _id: 0,
            date: "$_id",
            documents: 1
        }},
        {$sort: { date: 1 }}
    ]);
  
    // Convert array to an object with dates as keys
    const groupedByDate = {};
    results.forEach(result => {
        groupedByDate[result.date] = result.documents;
    });
  
    return groupedByDate;
  };
  
  return await getDocumentsGroupedByDate();
}

CompleteSentenceResultDAO.prototype.getResultsByWeek = async function (startDate, endDate) {
  const getDocumentsGroupedByWeek = async () => {
    const startDateObj = new Date(parseInt(startDate));
    const endDateObj = new Date(parseInt(endDate));
  
    const results = await CompleteSentenceResultModel.aggregate([
      {
        $match: {
          datetime: {
            $gte: startDateObj,
            $lte: endDateObj
          }
        }
      },
      {
        $addFields: {
          week: {
            $week: "$datetime"
          },
          year: {
            $year: "$datetime"
          }
        }
      },
      {
        $group: {
          _id: { week: "$week", year: "$year" },
          documents: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          _id: 0,
          week: "$_id.week",
          year: "$_id.year",
          documents: 1
        }
      },
      {
        $sort: { year: 1, week: 1 }
      }
    ]);
  
    // Convert array to an object with 'year-week' as keys
    const groupedByWeek = {};
    results.forEach(result => {
        const weekYearKey = `${result.year}-W${result.week}`;
        groupedByWeek[weekYearKey] = result.documents;
    });
  
    return groupedByWeek;
  };
  
  return await getDocumentsGroupedByWeek();
};

CompleteSentenceResultDAO.prototype.getStatisticByDay = async function (startDate, endDate) {
  const getDocumentsGroupedByDate = async () => {
    const startDateObj = new Date(parseInt(startDate));
    const endDateObj = new Date(parseInt(endDate));
  
    const results = await CompleteSentenceResultModel.aggregate([
      {
        $match: {
          datetime: {
            $gte: startDateObj,
            $lte: endDateObj
          }
        }
      },
      {
        $addFields: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$datetime" }
          }
        }
      },
      {
        $group: {
          _id: "$date",
          correctCount: {
            $sum: {
              $cond: ["$isCorrect", 1, 0]
            }
          },
          incorrectCount: {
            $sum: {
              $cond: ["$isCorrect", 0, 1]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          correctCount: 1,
          incorrectCount: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);
  
    // Convert array to an object with dates as keys and correct/incorrect counts
    const groupedByDate = {};
    results.forEach(result => {
        groupedByDate[result.date] = {
          correctCount: result.correctCount,
          incorrectCount: result.incorrectCount
        };
    });
  
    return groupedByDate;
  };
  
  return await getDocumentsGroupedByDate();
}

CompleteSentenceResultDAO.prototype.getStatisticByWeek = async function (startDate, endDate) {
  const getDocumentsGroupedByWeek = async () => {
    const startDateObj = new Date(parseInt(startDate));
    const endDateObj = new Date(parseInt(endDate));

    const results = await CompleteSentenceResultModel.aggregate([
      {
        $match: {
          datetime: {
            $gte: startDateObj,
            $lte: endDateObj
          }
        }
      },
      {
        $addFields: {
          week: {
            $week: "$datetime"
          },
          year: {
            $year: "$datetime"
          }
        }
      },
      {
        $group: {
          _id: { week: "$week", year: "$year" },
          correctCount: {
            $sum: {
              $cond: ["$isCorrect", 1, 0]
            }
          },
          incorrectCount: {
            $sum: {
              $cond: ["$isCorrect", 0, 1]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          week: "$_id.week",
          year: "$_id.year",
          correctCount: 1,
          incorrectCount: 1
        }
      },
      {
        $sort: { year: 1, week: 1 }
      }
    ]);

    // Convert array to an object with 'year-week' as keys and correct/incorrect counts
    const groupedByWeek = {};
    results.forEach(result => {
        const weekYearKey = `${result.year}-W${result.week}`;
        groupedByWeek[weekYearKey] = {
          correctCount: result.correctCount,
          incorrectCount: result.incorrectCount
        };
    });

    return groupedByWeek;
  };

  return await getDocumentsGroupedByWeek();
};

CompleteSentenceResultDAO.prototype.getTimeSpentByDay = async function (startDate, endDate) {
  const getDocumentsGroupedByDate = async () => {
    const startDateObj = new Date(parseInt(startDate));
    const endDateObj = new Date(parseInt(endDate));

    const results = await CompleteSentenceResultModel.aggregate([
      {
        $match: {
          datetime: {
            $gte: startDateObj,
            $lte: endDateObj
          }
        }
      },
      {
        $addFields: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$datetime" }
          }
        }
      },
      {
        $group: {
          _id: "$date",
          totalDuration: {
            $sum: "$duration"
          },
          documentCount: {
            $sum: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalDuration: 1,
          documentCount: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    // Convert array to an object with dates as keys and sums of durations and document counts
    const groupedByDate = {};
    results.forEach(result => {
        groupedByDate[result.date] = {
          totalDuration: result.totalDuration,
          documentCount: result.documentCount
        };
    });

    return groupedByDate;
  };

  return await getDocumentsGroupedByDate();
}


CompleteSentenceResultDAO.prototype.getTimeSpentByWeek = async function (startDate, endDate) {
  const getDocumentsGroupedByWeek = async () => {
    const startDateObj = new Date(parseInt(startDate));
    const endDateObj = new Date(parseInt(endDate));

    const results = await CompleteSentenceResultModel.aggregate([
      {
        $match: {
          datetime: {
            $gte: startDateObj,
            $lte: endDateObj
          }
        }
      },
      {
        $addFields: {
          week: {
            $week: "$datetime"
          },
          year: {
            $year: "$datetime"
          }
        }
      },
      {
        $group: {
          _id: { week: "$week", year: "$year" },
          totalDuration: {
            $sum: "$duration"
          },
          documentCount: {
            $sum: 1
          }
        }
      },
      {
        $project: {
          _id: 0,
          week: "$_id.week",
          year: "$_id.year",
          totalDuration: 1,
          documentCount: 1
        }
      },
      {
        $sort: { year: 1, week: 1 }
      }
    ]);

    // Convert array to an object with 'year-week' as keys and total durations and document counts
    const groupedByWeek = {};
    results.forEach(result => {
        const weekYearKey = `${result.year}-W${result.week}`;
        groupedByWeek[weekYearKey] = {
          totalDuration: result.totalDuration,
          documentCount: result.documentCount
        };
    });

    return groupedByWeek;
  };

  return await getDocumentsGroupedByWeek();
};


var CompleteSentenceResultDAO = new CompleteSentenceResultDAO();
module.exports = CompleteSentenceResultDAO;