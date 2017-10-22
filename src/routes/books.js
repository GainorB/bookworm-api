const express = require('express');
const authenticate = require('../middlewares/Auth');
const request = require('request-promise');
const { parseString } = require('xml2js');
const Book = require('../models/Book');
const parseErrors = require('../utils/parseErrors');

const router = express.Router();

// RUNNING THIS MIDDLEWARE ON ALL THE ROUTES
router.use(authenticate);

router.get('/', (req, res) => {
  // USES THE USERS ID TO FIND THEIR BOOKS
  Book.find({ userId: req.currentUser._id })
    .then(books => res.json({ books }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post('/', (req, res) => {
  // CREATES A BOOK WITH THE INFORMATION RECEIVED FROM THE CLIENT AND THE USERS ID
  Book.create({ ...req.body.book, userId: req.currentUser._id })
    .then(book => res.json({ book }))
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.get('/search', (req, res) => {
  // API REQUEST
  request
    .get(`https://www.goodreads.com/search/index.xml?key=${process.env.API_KEY}&q=${req.query.q}`)
    .then(result =>
      parseString(result, (err, goodreadsResult) =>
        // RESPONSE TO CLIENT
        res.json({
          books: goodreadsResult.GoodreadsResponse.search[0].results[0].work.map(work => ({
            goodreadsId: work.best_book[0].id[0]._,
            title: work.best_book[0].title[0],
            authors: work.best_book[0].author[0].name[0],
            covers: [work.best_book[0].image_url[0]]
          }))
        })
      )
    );
});

router.get('/fetchPages', (req, res) => {
  // API ID OF EACH BOOK
  const goodreadsId = req.query.goodreadsId;

  request
    .get(`https://www.goodreads.com/book/show.xml?key=${process.env.API_KEY}&id=${goodreadsId}`)
    .then(result =>
      parseString(result, (err, goodreadsResult) => {
        const numPages = goodreadsResult.GoodreadsResponse.book[0].num_pages[0];
        const pages = numPages ? parseInt(numPages, 10) : 0;

        res.json({
          pages
        });
      })
    );
});

module.exports = router;
