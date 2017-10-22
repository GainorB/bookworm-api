require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bluebird = require('bluebird');

app.use(bodyParser.json());

// MONGOOSE
mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/books', require('./routes/books'));

// DIRECT ALL REQUESTS TO THIS FILE
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// START SERVER
app.listen(8080, () => console.log('Running on localhost:8080'));

module.exports = app;
