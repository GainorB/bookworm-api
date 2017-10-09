const express = require('express');
const User = require('../models/User');
const parseErrors = require('../utils/parseErrors');
const sendConfirmationEmail = require('../mailer');

const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body.user;
  const user = new User({ email });
  user.setPassword(password);
  user.setConfirmationToken();
  user
    .save()
    .then(user => {
      sendConfirmationEmail(user);
      res.json({ user: user.toAuthJSON() });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

module.exports = router;
