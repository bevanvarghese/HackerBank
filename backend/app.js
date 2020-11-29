const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/hackerbank', (err) => {
//   if (err)
//     console.log("MongoDB connection error: "+err);
//   else 
//     console.log("Connected to MongoDB");
// });

app.get('/', (req,res) => {
  res.send('<h1>Hello World!</h1>');
});

// const userRouter = require('./routes/users');
// const questionRouter = require('./routes/questions');
// const answerRouter = require('./routes/answers');

//app.use('/route', deconstructedRouteFromAbove);

app.listen(8000, () => {
  console.log('Server listening on port 8000.');
});

module.exports = app;