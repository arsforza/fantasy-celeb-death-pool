const express = require('express');
const router  = express.Router();
const wikiApi = require('../api/wiki-api');
const localApi = require('../api/local-api');

router.get('/dashboard', (req, res, next) => {
  const { user } = req;
  const isAdmin = user.role === 'admin';
  Promise.all([localApi.getThisYearDeaths(), localApi.getAllThisYearsBets()])
  .then(results => {
    const deathList = results[0];
    const betList = results[1];

    res.render('dashboard', { userInSession: user, deathList, betList, isAdmin })
  })
  .catch(err => next(err));
});

router.get('/user-profile', (req, res, next) => {
  const { user } = req;
  const isAdmin = user.role === 'admin';
  const { error } = req.flash();
  const err = error ? error[0] : false;
  console.log(err);
  localApi.getUserThisYearBet(user._id)
  .then(thisYearBet => {
    localApi.isBetFull(thisYearBet)
    .then(fullList => {
      res.render('users/user-profile', { userInSession: user, thisYearBet, fullList, err, isAdmin })
    })
    .catch(err => next(err));
  })
  .catch(err => next(err));
} );

router.get('/fill-list', (req, res, next) => {
  const { user } = req;
  const isAdmin = user.role === 'admin';
  const { searchResults } = req.session;
  req.session.searchResults = [];

  if(searchResults) {
    searchResults.forEach(result => {
      localApi.isPersonAlreadyInBet(user._id, result.wikiId)
      .then(isInBet => {
        result.showButton = isInBet ? false : true;
      })
      .catch(err => next(err));
    })
  }

  localApi.getUserThisYearBet(user._id)
  .then(bet => {
    localApi.isBetFull(bet)
    .then(fullBet => {
      res.render('users/fill-list', { userInSession: user, searchResults, bet, fullBet, isAdmin })
    })
  })
});

router.post('/search-name', (req, res, next) => {
  const { searchQuery } = req.body;

  if(searchQuery.trim().length === 0) {
    res.redirect('/fill-list');
    return;
  }
    

  wikiApi.searchPerson(searchQuery)
  .then(searchResults => {
    req.session.searchResults = searchResults;
    res.redirect('/fill-list');
  })
  .catch(error => next(error));
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
  const { wikiId, name, description, birthYear, wikipediaUrl, jsonUrl, basePoints } = req.body;

  localApi.isPersonAlreadyInDb(wikiId)
  .then(alreadyInDb => {
    if(alreadyInDb)
      return localApi.getPersonByWikiId(wikiId)
    else {
      return localApi.createNewPerson({ wikiId, name, description, birthYear, wikipediaUrl, jsonUrl, basePoints })
    }
  }).then(chosenPerson => {
    if(chosenPerson) {
      localApi.addPersonToBet(user._id, chosenPerson)
      .catch(err => next(err));
    } else {
      return;
    }
  })
  .then(result => {
    res.redirect('/fill-list');
  })
  .catch(err => next(err));
});

module.exports = router;