'use strict';

module.exports = passPortConfig;

function passPortConfig() {
  require('66pix-models').then(function(models) {

    var User = models.User;
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(loginUser));

    function loginUser(email, password, done) {
      User.login(email, password)
        .then(function(user) {
          done(null, user);
        })
      .catch(function(error) {
        done(error);
      });
    }
  });
}

