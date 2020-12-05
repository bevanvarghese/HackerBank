const router = require('express').Router();
let Question = require('../models/question_model');
let Answer = require('../models/answer_model');

exports.getAllQuestions = (req, res) => {
  let questionData = [];
  Question.find()
    .sort('-time')
    .exec()
    .then((data) => {
      data.forEach((doc) => {
        questionData.push({
          qid: doc._id,
          space: doc.space,
          title: doc.title,
          content: doc.content,
          time: doc.time,
          upvotes: doc.upvotes,
          creatorId: doc.creatorId,
          creatorName: doc.creatorName,
          answers: [],
        });
      });
      return Answer.find().sort('time').exec();
    })
    .then((answers) => {
      answers.forEach((ans) => {
        for (var i = 0; i < questionData.length; i++) {
          if (questionData[i].qid == ans.qid.toString()) {
            questionData[i].answers.push({
              aid: ans._id,
              content: ans.content,
              creatorId: ans.creatorId,
              creatorName: ans.creatorName,
              time: ans.time,
            });
            break;
          }
        }
      });
      return res.status(200).json(questionData);
    })
    .catch((err) => res.status(400).json({ error: err }));
};

exports.getOneQuestion = (req, res) => {
  let question = {};
  Question.findById(req.params.qid)
    .then((doc) => {
      if (doc == null) {
        return res.status(404).json({ error: 'Question not found' });
      }
      question = {
        qid: doc._id,
        space: doc.space,
        title: doc.title,
        content: doc.content,
        time: doc.time,
        upvotes: doc.upvotes,
        creatorId: doc.creatorId,
        creatorName: doc.creatorName,
        answers: [],
      };
      return Answer.find({ qid: req.params.qid }).sort('time').exec();
    })
    .then((data) => {
      data.forEach((ans) => {
        question.answers.push({
          aid: ans._id,
          content: ans.content,
          creatorId: ans.creatorId,
          creatorName: ans.creatorName,
          time: ans.time,
        });
      });
      return res.status(200).json(question);
    })
    .catch((err) => res.status(400).json({ error: err }));
};

exports.createQuestion = (req, res) => {
  const newQuestion = new Question({
    space: req.body.space,
    title: req.body.title,
    content: req.body.content,
    time: new Date(),
    upvotes: [],
    creatorId: req.body.creatorId,
    creatorName: req.body.creatorName,
  });
  newQuestion
    .save()
    .then(() => res.status(200).json({ message: 'Question added.' }))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.editQuestion = (req, res) => {
  const qid = req.params.qid;
  const newTitle = req.body.title;
  const newSpace = req.body.space;
  const newContent = req.body.content;
  Question.findByIdAndUpdate(qid, {
    title: newTitle,
    space: newSpace,
    content: newContent,
  })
    .then(() => res.status(200).json({ message: 'Question edited.' }))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.deleteQuestion = (req, res) => {
  const qid = req.params.qid;
  Question.findByIdAndDelete(qid)
    .then(() => Answer.deleteMany({ qid: qid }).exec())
    .then(() => res.status(200).json({ message: 'Question deleted.' }))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.likeQuestion = async (req, res) => {
  const qid = req.params.qid;
  const uid = req.body.uid;
  var question = await Question.findById(qid).exec();
  if (question != null) {
    if (question.upvotes.indexOf(uid) == -1) {
      question.upvotes.push(uid);
      question.save();
      return res.status(200).json({ message: 'Question upvoted.' });
    } else {
      return res.status(400).json({ error: 'Question already upvoted.' });
    }
  } else {
    return res.status(400).json({ error: 'Question not found.' });
  }
};

exports.unlikeQuestion = async (req, res) => {
  const qid = req.params.qid;
  const uid = req.body.uid;
  var question = await Question.findById(qid).exec();
  if (question != null) {
    if (question.upvotes.indexOf(uid) != -1) {
      question.upvotes.splice(question.upvotes.indexOf(uid), 1);
      question.save();
      return res.status(200).json({ message: 'Question unvoted.' });
    } else {
      return res.status(400).json({ error: 'Question already unvoted.' });
    }
  } else {
    return res.status(400).json({ error: 'Question not found.' });
  }
};

exports.createAnswer = (req, res) => {
  const newAnswer = new Answer({
    qid: req.params.qid,
    content: req.body.content,
    creatorId: req.body.creatorId,
    creatorName: req.body.creatorName,
    time: new Date(),
  });
  newAnswer
    .save()
    .then((doc) =>
      res.status(200).json({ message: 'Answer added.', aid: doc._id })
    )
    .catch((err) => res.status(400).json({ error: err }));
};

exports.deleteAnswer = (req, res) => {
  const aid = req.params.aid;
  Answer.findByIdAndDelete(aid)
    .then(() => res.status(200).json({ message: 'Answer deleted.' }))
    .catch((err) => res.status(400).json({ error: err }));
};
