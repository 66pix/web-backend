'use strict';

var jwt = require('jsonwebtoken');
var debug = require('debug')('authentication/login');

module.exports = function(app) {
  require('@faceleg/66pix-models').then(function(models) {
    app.post('/authentication/login', function(req, res) {
      if (!req.body.email || !req.body.password) {
        return res.json(401, {
          code: 401,
          message: 'Invalid email or password'
        });
      }

      var User = models.User;
      User.login(req.body.email, req.body.password)
        .then(function(user) {
          var token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name
          }, process.env.TOKEN_SECRET, {
            expiresInMinutes: 60 * 5
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

