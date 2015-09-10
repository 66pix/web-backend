'use strict';

var jwt = require('jsonwebtoken');
var debug = require('debug')('authentication/login');

module.exports = function(app) {
  require('@faceleg/66pix-models').then(function(models) {
    app.post('/authentication/login', function(req, res) {
      if (!req.body.email || !req.body.password) {
        return res.send(401, 'Invalid username or password');
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
          res.status(error.code)
            .send(error.message);
        });
    });
  });
};

