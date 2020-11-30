const router = require('expresss').Router();
let Answer = require('../models/answer_model');

exports.getAllAnswers = (req, res) => {
  Answer
    .find()
    .sort('time')
    .then(data => {
      let answers = [];
      data.forEach(doc => {
        answers.push({
          aid: doc._id,
          qid: doc.data().qid,
          content: doc.data().content,
          creatorId: doc.data().creatorId,
          creatorName: doc.data().creatorName,
          time: doc.data().time,
        });
        return res.json(answers);
      });
    })
    .catch(err => res.status(400).json({ error: err }));
};

exports.getAnswersForOneQuestion = (req, res) => {
  Answer
    .find({qid: req.params.id})
    .sort('time')
    .then(data => {
      let answers = [];
      data.forEach(doc => {
        answers.push({
          aid: doc._id,
          qid: doc.data().qid,
          content: doc.data().content,
          creatorId: doc.data().creatorId,
          creatorName: doc.data().creatorName,
          time: doc.data().time,
        });
        return res.json(answers);
      });
    })
    .catch(err => res.status(400).json({ error: err }));
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