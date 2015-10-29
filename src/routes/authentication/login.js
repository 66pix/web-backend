'use strict';

var jwt = require('jsonwebtoken');
var debug = require('debug')('authentication/login');

module.exports = function(app) {
  require('@faceleg/66pix-models').then(function(models) {
    app.post('/authentication/login', function(req, res) {

      if (bodyIsValid(req.body)) {
        return res.status(401)
        .json({
          code: 401,
          message: 'Invalid email or password'
        });
      }

      var User = models.User;
      var Token = models.Token;
      User.login(req.body.email, req.body.password)
      .then(function(user) {
        return [user, Token.build({
          userId: user.id,
          userAgent: req.headers['user-agent'],
          type: 'Login',
          isRevoked: false
        }).save()];
      })
      .spread(function(user, token) {
        var EXPIRES_IN_HOURS = 5;
        var jwtToken = jwt.sign({
          id: user.id,
          tokenId: token.id
        }, process.env.TOKEN_SECRET, {
          expiresIn: EXPIRES_IN_HOURS + 'h',
          issuer: '66pix Website',
          audience: '66pix Website User'
        });

        var expiresOn = new Date();
        token.expiresOn = expiresOn.getTime() + EXPIRES_IN_HOURS * 60 * 60 * 1000;
        return [jwtToken, token.save()];
      })
      .spread(function(jwtToken) {
        res.json({
          token: jwtToken
        });
      })
      .catch(User.InvalidLoginDetailsError, User.TooManyAttemptsError, function(error) {
        debug(error);
        res.status(error.code)
        .json({
          code: error.code,
          message: error.message
        });
      });
    });
  });
};

function bodyIsValid(body) {
  return !body.email || !body.password;
}
