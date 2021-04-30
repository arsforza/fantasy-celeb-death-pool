const express = require('express');
const router  = express.Router();
const wikiApi = require('../wiki-api');
const localApi = require('../local-api');

router.get('/user-profile', (req, res, next) => {
  const { user } = req;
  localApi.getUserThisYearBet(user._id)
  .then(thisYearBet => {
    localApi.isBetFull(thisYearBet)
    .then(fullList => {
      console.log('thisYearBet ', thisYearBet);
      res.render('users/user-profile', { userInSession: user, thisYearBet, fullList })
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
} );

router.get('/fill-list', (req, res, next) => {
  const { user } = req;
  const { searchResults } = req.session;

  localApi.getUserThisYearBet(user._id)
  .then(bet => {
    res.render('users/fill-list', { searchResults, bet })
  })
});

router.post('/create-bet', (req, res, next) => {
  const { user } = req;

  localApi.createBet(user._id)
  .then(bet => {
    res.redirect('/fill-list');
  })
  .catch(err => next(err));
})

router.post('/add-person', (req, res, next) => {
  const { user } = req;
  const { wikiId, name, description, birthYear, deathYear, wikipediaUrl, jsonUrl } = req.body;

  localApi.isPersonAlreadyInBet(user._id, wikiId)
  .then(aleradyInBet => {
    if(aleradyInBet) {
      return false;
    } else {
      localApi.isPersonAlreadyInDb(wikiId)
      .then(alreadyInDb => {
        if(alreadyInDb)
          return localApi.getPersonByWikiId(wikiId)
        else {
          return localApi.createNewPerson({ wikiId, name, description, birthYear, deathYear, wikipediaUrl, jsonUrl })
        }
      }).then(chosenPerson => {
        if(chosenPerson) {
          localApi.addPersonToBet(user._id, chosenPerson)
          .then(addedPerson => {
            res.redirect('/fill-list');
          })
          .catch(err => next(err));
        } else {
          return;
        }
      })
      .catch(err => next(err));
    }
  })
  
});

router.post('/search-name', (req, res, next) => {
  const { searchQuery } = req.body;

  wikiApi.searchPerson(searchQuery)
  .then(searchResults => {
    req.session.searchResults = searchResults;
    res.redirect('/fill-list');
  })
  .catch(error => next(error));
});

module.exports = router;