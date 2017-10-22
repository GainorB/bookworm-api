const express = require('express');
const User = require('../models/User');
const { sendResetPasswordEmail } = require('../mailer');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/', (req, res) => {
  // GRAB CREDENTIALS FROM CLIENT
  const { credentials } = req.body;
  // FIND USER WITH PROVIDED EMAIL
  User.findOne({ email: credentials.email }).then(user => {
    // IF USER IS FOUND AND THE PASSWORD IS CORRECT
    if (user && user.isValidPassword(credentials.password)) {
      res.json({ user: user.toAuthJSON() });
    } else {
      res.status(400).json({ errors: { global: 'Invalid Credentials' } });
    }
  });
});

router.post('/confirmation', (req, res) => {
  // TOKEN FROM CLIENT
  const token = req.body.token;
  // USE TOKEN TO FIND A USER. IF TOKEN IS FOUND, UPDATE THE USER RECORD
  // BY CLEARING THE TOKEN AND SETTING CONFIRMED TO TRUE
  User.findOneAndUpdate(
    { confirmationToken: token },
    { confirmationToken: '', confirmed: true },
    { new: true } // TRUE: RETURNS THE UPDATED USER AFTER THE UPDATE IS APPLIED
  ).then(user => {
    // IF USER IS FOUND
    user ? res.json({ user: user.toAuthJSON() }) : res.status(400).json({});
  });
});

router.post('/reset_password_request', (req, res) => {
  // FIND A USER BY EMAIL FROM CLIENT
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // IF USER IS FOUND SEND EMAIL
      sendResetPasswordEmail(user);
      res.json({});
    } else {
      res.status(400).json({ errors: { global: 'Something went wrong' } });
    }
  });
});

router.post('/validate_token', (req, res) => {
  // VALIDATE THE TOKEN FROM THE CLIENT
  jwt.verify(req.body.token, process.env.JWT_SECRET, err => {
    if (err) {
      // IF INVALID TOKEN
      res.status(401).json({});
    } else {
      // IF TOKEN IS VALID
      res.json({});
    }
  });
});

router.post('/reset_password', (req, res) => {
  // CREDENTIALS FROM CLIENT
  const { password, token } = req.body.data;
  // VERIFY TOKEN
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // IF INVALID TOKEN
      res.status(401).json({ errors: { global: 'Invalid token' } });
    } else {
      // IF TOKEN IS VALID
      // DECODED WILL CONTAIN USERS ID THAT WE CAN USE TO SEARCH FOR A USER
      User.findOne({ _id: decoded._id }).then(user => {
        if (user) {
          // IF USER IS FOUND, RESET PASSWORD WITH THE PASSWORD WE GOT FROM CLIENT
          user.setPassword(password);
          user.save().then(() => res.json({}));
        } else {
          res.status(404).json({ errors: { global: 'Invalid token' } });
        }
      });
    }
  });
});

module.exports = router;
