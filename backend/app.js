const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hackerbank', (err) => {
  if (err)
    console.log("MongoDB connection error: "+err);
  else 
    console.log("Connected to MongoDB");
});

const { register, login } = require('./routes/users');
const { getAllQuestions, getOneQuestion, createQuestion, editQuestion, deleteQuestion, likeQuestion, unlikeQuestion, createAnswer, deleteAnswer } = require('./routes/qAndA');

//user routes
app.post('/register', register);
app.post('/login', login);
//QnA routes
app.get('/questions', getAllQuestions);
app.get('/questions/:qid', getOneQuestion);
app.post('/questions/create', createQuestion);
app.post('/questions/edit/:qid', editQuestion);
app.delete('/questions/delete/:qid', deleteQuestion);
app.post('/questions/like/:qid', likeQuestion);
app.post('/questions/unlike/:qid', unlikeQuestion);
app.post('/answers/create', createAnswer);
app.delete('/questions/delete/:aid', deleteAnswer);

app.listen(8000, () => {
  console.log('Server listening on port 8000.');
});