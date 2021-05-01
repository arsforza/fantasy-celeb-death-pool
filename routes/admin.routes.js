const express = require('express');
const router  = express.Router();

const localApi = require('../api/local-api');

router.get('/simulate-death', (req, res, next) => {
  const { user } = req;

  localApi.getAllThisYearsBets()
  .then(allBets => {
    console.log(allBets);
    const uniquePeople = allBets.reduce((arr, bet) => {
      bet.people.forEach(person => {
        localApi.didPersoDie(person._id)
        .then(dead => {
          if(!dead) {
            const personAlreadyStored = arr.some(uniquePerson => uniquePerson._id === person._id)
            if(!personAlreadyStored)
             arr.push(person);
          }
        })
        .catch(err => next(err));
      })
      return arr;
    }, []);

    return uniquePeople;
  })
  .then(people => {
    res.render('admin/simulate-death', { userInSession: user, people });
  })
  .catch(err => next(err));
});

router.post('/simulate-death', (req, res, next) => {
  const{ personId } = req.body;

  localApi.newDeath(personId)
  .then(deathSimulated => {
    res.redirect('/dashboard');
  })
  .catch(err => next(err));
});

module.exports = router;