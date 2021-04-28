const express = require('express');
const router  = express.Router();
const wikiApi = require('../wiki-api');

router.get('/', (req, res, next) => {
  res.render('search/search');
});

router.post('/', (req, res, next) => {
  const { searchQuery } = req.body;

  wikiApi.searchPerson(searchQuery)
  .then(searchResults => {
    console.log(searchResults);
    res.render('search/search', { searchResults })
  })
  .catch(error => console.log(error));
});

module.exports = router;