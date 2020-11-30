const router = require('expresss').Router();
let Question = require('../models/question_model');

exports.getQuestions = (req, res) => {
  Question
    .find()
    .then(data => {
      let questions = [];
      data.forEach(doc => {
        questions.push({
          qid: doc._id,
          space: doc.data().space,
          title: doc.data().title,
          content: doc.data().content, 
          answers: doc.data().answers,
          time: doc.data().time,
          upvotes: doc.data().upvotes,
          creatorId: doc.data().creatorId,
          creatorName: doc.data().creatorName,
        });
      });
      return res.json(questions);
    })
    .catch(err => res.status(400).json({ error: err }));
};

exports.createQuestion = (req, res) => {
  const newQuestion = new Question({
    space: req.body.space,
    title: req.body.title,
    content: req.body.content, 
    time: new Date(),
    answers: [],
    upvotes: [],
    creatorId: req.body.uid,
    creatorName: req.body.uname,
  });
  newQuestion.save()
    .then(() => res.status(200).json({ message: 'Question added.' }))
    .catch(err => res.status(400).json({ error: err }));
};

exports.editQuestion = (req, res) => {
  const qid = req.params.qid;
  const newTitle = req.body.title;
  const newSpace = req.body.space;
  const newContent = req.body.content;
  Question.findByIdAndUpdate(qid, 
    {
      title: newTitle,
      space: newSpace,
      content: newContent
    })
    .then(() => res.status(200).json({ message: 'Question edited.' }))
    .catch(err => res.status(400).json({ error: err }));
};

exports.deleteQuestion = (req, res) => {
  const qid = req.params.qid;
  Question.findByIdAndDelete(qid)
    .then(() => res.status(200).json({ message: 'Question deleted.' }))
    .catch(err => res.status(400).json({ error: err }));
  //TODO Delete answers
};

exports.likeQuestion = (req, res) => {
  const qid = req.params.qid;
  const uid = req.body.uid;
  var question = await Question.findById(qid).exec();
  if(question != null) {
    if(question.answers.indexOf(uid)==-1) {
      question.answers.push(uid);
      question.save();
      return res.status(200).json({ message: 'Question upvoted.'});
    } 
    else {
      return res.status(400).json({ error: 'Question already upvoted.'});
    }
  } 
  else {
    return res.status(400).json({ error: 'Question not found.'});
  }
};

exports.unlikeQuestion = (req, res) => {
  const qid = req.params.qid;
  const uid = req.body.uid;
  var question = await Question.findById(qid).exec();
  if(question != null) {
    if(question.answers.indexOf(uid)!=-1){
      question.answers.splice(question.answers.indexOf(uid), 1);
      question.save();
      return res.status(200).json({ message: 'Question unvoted.'});
    } 
    else {
      return res.status(400).json({ error: 'Question already unvoted.'});
    }
  } 
  else {
    return res.status(400).json({ error: 'Question not found.'});
  }
};
