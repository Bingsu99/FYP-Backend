const repeatSentenceRecordSchema = new mongoose.Schema({
    deckID: { type: mongoose.Schema.Types.ObjectId },
    sentence: { type: String },
    accuracy: {type: Number},
    duration: { type: Number },
    datetime: {
      type: Date,
      default: Date.now // This sets the default value to the current date and time
    }
  });
  
const completeSentenceRecordSchema = new mongoose.Schema({
    deckID: { type: mongoose.Schema.Types.ObjectId },
    sentence: { type: String },
    correctWords: {type: [String]},
    incorrectWords: {type: [String]},
    user_answer: { type: String },
    duration: { type: Number },
    datetime: {
        type: Date,
        default: Date.now // This sets the default value to the current date and time
    }
});

const dailyAssignmentRecordSchema = new mongoose.Schema({
    repeatSentenceDecks: { type: [mongoose.Schema.Types.ObjectId] },
    repeatSentenceRequirements: { type: Number },
    repeatSentenceCompleted: {type: [mongoose.Schema.Types.ObjectId]},
    completeSentenceDecks: { type: [mongoose.Schema.Types.ObjectId] },
    completeSentenceRequirements: { type: Number },
    completeSentenceCompleted: {type: [mongoose.Schema.Types.ObjectId]},
    datetime: {
        type: Date,
        default: Date.now // This sets the default value to the current date and time
    }
});

const RepeatSentenceRecord = mongoose.model('RepeatSentenceRecord', repeatSentenceRecordSchema);
const CompleteSentenceRecord = mongoose.model('CompleteSentenceRecord', completeSentenceRecordSchema);

module.exports = {
    RepeatSentenceRecord: RepeatSentenceRecord,
    CompleteSentenceRecord: CompleteSentenceRecord
};