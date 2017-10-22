const express = require('express');
const User = require('../models/User');
const parseErrors = require('../utils/parseErrors');
const { sendConfirmationEmail } = require('../mailer');

const router = express.Router();

router.post('/', (req, res) => {
  // EXTRACT EMAIL AND PASSWORD FROM CLIENT
  const { email, password } = req.body.user;
  // CREATE A USER WITH EMAIL
  const user = new User({ email });
  // SETPASSWORD HASHES THE PASSWORD WE GOT FROM THE CLIENT
  user.setPassword(password);
  // CREATE A CONFIRMATION TOKEN
  user.setConfirmationToken();
  user
    .save()
    .then(user => {
      // SEND CONFIRMATION EMAIL TO USER
      sendConfirmationEmail(user);
      // TOAUTHJSON IS A FUNCTION USED TO CREATE AN OBJECT TO SEND TO THE CLIENT
      res.json({ user: user.toAuthJSON() });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

module.exports = router;
