'use strict';

var jwt = require('jsonwebtoken');
var debug = require('debug')('authentication/login');

var LOGIN_SESSION_EXPIRY = 60 * 5;

module.exports = function(app) {
  require('@faceleg/66pix-models').then(function(models) {
    app.post('/authentication/login', function(req, res) {
      if (!req.body.email || !req.body.password) {
        return res.status(401)
          .json({
            code: 401,
            message: 'Invalid email or password'
          });
      }

      var User = models.User;
      console.log(req.body);
      User.login(req.body.email, req.body.password)
        .then(function(user) {
          var token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name
          }, process.env.TOKEN_SECRET, {
            expiresInMinutes: LOGIN_SESSION_EXPIRY
          });

          res.json({
            token: token
          });
        })
        .catch(User.InvalidLoginDetailsError, User.TooManyAttemptsError, function(error) {
          debug('%s, %s', error.name, error.message);
          res.status(error.code)
            .json({
              code: error.code,
              message: error.message
            });
        });
    });
  });
};

