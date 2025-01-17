const router = require('express').Router();
let User = require('../models/user_model');

exports.register = (req, res) => {
  User.find({ email: req.body.email })
    .then((result) => {
      if (result.length > 0) {
        return res
          .status(400)
          .json({ error: "Duplicated user's email address" });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        newUser
          .save()
          .then((doc) =>
            res
              .status(200)
              .json({ message: 'Account successfully created.', uid: doc._id })
          )
          .catch((err) => res.status(400).json({ error: err }));
      }
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  User.find({ email: user.email })
    .then((result) => {
      if (result.length == 0) {
        return res.status(400).json({ error: 'User is not registered.' });
      } else {
        if (result[0]['password'] == user.password) {
          return res
            .status(200)
            .json({
              message: 'Login successful.',
              uid: result[0]['_id'],
              uname: result[0]['name'],
            });
        } else {
          return res.status(400).json({ error: 'Unauthorized access.' });
        }
      }
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};
