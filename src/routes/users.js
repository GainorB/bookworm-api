const express = require('express');
const User = require('../models/User');
const parseErrors = require('../utils/parseErrors');

const router = express.Router();

router.post('/', (req, res) => {
  const { email, password } = req.body.user;
  const user = new User({ email });
  user.setPassword(password);
  user
    .save()
    .then(user => res.json({ user: user.toAuthJSON() }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

module.exports = router;
