const express = require('express');
const router  = express.Router();
const passport = require('passport');
const User = require('../models/User.model');

const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if(!username) {
    res.render('auth/signup', { message: 'Please provide a username'});
    return;
  }

  if(!password) {
    res.render('auth/signup', { message: 'Please provide a password'});
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcrypt.genSalt(saltRounds)
  .then(salt => bcrypt.hash(password, salt))
  .then(passwordHash => {
    return User.create({
      username,
      passwordHash,
      role: 'user'
    })
  })
  .then(createdUser => {
    res.redirect('/users/user-profile');
  })
  .catch(err => next(err));
});

router.get('/login', (req, res, next) => res.render('auth/login'));

router.post('/login', passport.authenticate('local',  {
  successRedirect: '/users/user-profile',
  failureRedirect: '/auth/login'
}));

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;