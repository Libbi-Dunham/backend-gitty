const { Router } = require('express');
const quoteService = require('../services/quoteService');

module.exports = Router().get('/', (req, res, next) => {
  quoteService
    .getQuotes()
    .then((quotes) => res.send(quotes))
    .catch((error) => next(error));
});
