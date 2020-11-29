const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  space: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  answer:  { 
    type : [Schema.Types.ObjectId] , 
    "default" : [] 
  },
  upvotes:  { 
    type : [Schema.Types.ObjectId], 
    "default" : [] 
  },
  time: { 
    type: Date
  }, //TODO
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  creatorName: {
    type: String,
    required: true
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;