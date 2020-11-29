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

app.get('/', (req,res) => {
  res.send('<h1>Hello World!</h1>');
});

const { register, login } = require('./routes/users');
// const questionRouter = require('./routes/questions');
// const answerRouter = require('./routes/answers');

//user routes
app.post('/register', register);
app.post('/login', login);

app.listen(8000, () => {
  console.log('Server listening on port 8000.');
});