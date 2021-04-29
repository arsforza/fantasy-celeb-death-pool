const express = require('express');
const router  = express.Router();

router.get('/user-profile', (req, res, next) => {
  res.render('users/user-profile', { userInSession: req.user });
} );

module.exports = router;