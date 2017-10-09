const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bluebird = require('bluebird');

const auth = require('./routes/auth');
const users = require('./routes/users');
const books = require('./routes/books');

dotenv.config();
const app = express();
app.use(bodyParser.json());

// MONGOOSE
mongoose.Promise = bluebird;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });

// ROUTES
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/books', books);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// START SERVER
app.listen(8080, () => console.log('Running on localhost:8080'));
