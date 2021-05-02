const express = require('express');
const router  = express.Router();

const localApi = require('../api/local-api');

router.get('/simulate-death', (req, res, next) => {
  const { user } = req;
  const isAdmin = user.role === 'admin';

  localApi.getAlivePeople()
  .then(people => {
    res.render('admin/simulate-death', { userInSession: user, isAdmin, people });
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