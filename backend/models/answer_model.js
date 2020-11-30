const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = new Schema({
  qid: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  creatorName: {
    type: String,
    required: true
  },
  time: { 
    type: Date
  }, //TODO
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;