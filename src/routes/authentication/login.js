'use strict';

var jwt = require('jsonwebtoken');
var debug = require('debug')('authentication/login');
var config = require('../../../src/config.js');

module.exports = function(app) {
  require('@66pix/models').then(function(models) {
    app.post('/authentication/login', function(req, res) {

      if (bodyIsValid(req.body)) {
        return res.status(401)
        .json({
          code: 401,
          message: 'Invalid email or password'
        });
      }

      var UserAccount = models.UserAccount;
      var Token = models.Token;
      UserAccount.login(req.body.email, req.body.password)
      .then(function(user) {
        return [user, Token.build({
          userId: user.id,
          userAgent: req.headers['user-agent'],
          type: 'Login',
          isRevoked: false,
          payload: '',
          updatedWithToken: -1
        }).save()];
      })
      .spread(function(user, token) {
        var EXPIRES_IN_HOURS = 5;
        var jwtToken = jwt.sign({
          id: user.id,
          tokenId: token.id
        }, config.get('TOKEN_SECRET'), {
          expiresIn: EXPIRES_IN_HOURS + 'h',
          issuer: '66pix Website',
          audience: '66pix Website User'
        });

        var expiresOn = new Date();
        token.expiresOn = expiresOn.getTime() + EXPIRES_IN_HOURS * 60 * 60 * 1000;
        token.updatedWithToken = token.id;
        token.payload = jwtToken;
        return [jwtToken, token.save()];
      })
      .spread(function(jwtToken) {
        res.json({
          token: jwtToken
        });
      })
      .catch(UserAccount.InvalidLoginDetailsError, UserAccount.TooManyAttemptsError, function(error) {
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
