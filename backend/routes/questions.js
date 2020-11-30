const router = require('expresss').Router();
let Question = require('../models/question_model');
let Answer = require('../models/answer_model');

exports.getAllQuestions = (req, res) => {
  Question
    .find()
    .sort('time', -1)
    .then(data => {
      let questions = [];
      data.forEach(doc => {
        questions.push({
          qid: doc._id,
          space: doc.data().space,
          title: doc.data().title,
          content: doc.data().content, 
          time: doc.data().time,
          upvotes: doc.data().upvotes,
          creatorId: doc.data().creatorId,
          creatorName: doc.data().creatorName,
        });
      });
      for(var q = 0; q < questions.length; q++) {
        questions[q].answers = [];
        Answer.find({qid: questions[q]}).sort('time', 1)
        .then(data => {
          data.forEach(doc => {
            questions[q].answers.push(doc.data());
          });
        })
        .catch(err => res.status(400).json({ error: err }));
      }
      return res.json(questions);
    })
    .catch(err => res.status(400).json({ error: err }));
};

exports.getOneQuestion = (req, res) => {
  let question = {};
  Question
    .findById(req.params.qid)
    .then(doc => {
      if(doc=null) {
        return res.status(404).json({ error: 'Question not found' });
      }
      question.qid = doc._id;
      question = doc.data();
      return Answer.find({qid: req.params.qid}).sort('time', 1).exec();
    })
    .then(data => {
      question.answers = [];
      data.forEach(doc => {
        question.answers.push(doc.data());
      });
      return res.json(question);
    })
    .catch(err => res.status(400).json({ error: err }));
}

exports.createQuestion = (req, res) => {
  const newQuestion = new Question({
    space: req.body.space,
    title: req.body.title,
    content: req.body.content, 
    time: new Date(),
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
    if(question.upvotes.indexOf(uid)==-1) {
      question.upvotes.push(uid);
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
    if(question.upvotes.indexOf(uid)!=-1){
      question.upvotes.splice(question.upvotes.indexOf(uid), 1);
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

exports.createAnswer = (req, res) => {
  const newAnswer = new Answer({
    qid: req.params.qid,
    content: req.body.content,
    creatorId: req.content.uid,
    creatorName: req.content.uname,
    time: new Date(),
  });
  newAnswer.save()
    .then(() => res.status(200).json({ message: 'Answer added.' }))
    .catch(err => res.status(400).json({ error: err }));
};

exports.deleteAnswer = (req, res) => {
  const aid = req.params.aid;
  Answer.findByIdAndDelete(aid)
    .then(() => res.status(200).json({ message: 'Answer deleted.' }))
    .catch(err => res.status(400).json({ error: err }));
};