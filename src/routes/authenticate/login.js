'use strict';

var passport = require('passport');

module.exports = function(app) {
  app.post('/authenticate/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/authenticate/login',
    failureFlash: true
  }));
};

