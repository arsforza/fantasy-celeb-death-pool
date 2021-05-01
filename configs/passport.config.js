const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

const localStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, done) => {
    User.findOne({ username })
    .then(user => {
      if(!user) {
        return done(null, false, { message: `The username doesn't exist` });
      }
      
      bcrypt.compare(password, user.passwordHash)
      .then(verifiedStatus => {
        return verifiedStatus
        ? done(null, user)
        : done(null, false, { message: 'Incorrect password.' });
      }) 
      .catch(err => done(err));
    })
  }
)

module.exports = localStrategy;