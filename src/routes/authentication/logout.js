'use strict';

var env = require('envalid');
var jwt = require('jsonwebtoken');
var debug = require('debug')('authentication/logout');

module.exports = function(app) {
  require('@66pix/models').then(function(models) {
    app.get('/authentication/logout', function(req, res, next) {
      jwt.verify(req.headers.authorization.replace('Bearer ', ''), env.get('TOKEN_SECRET'), function(error, jwtToken) {
        if (error) {
          return handleError(error, res, next);
        }

        models.Token.findById(jwtToken.tokenId)
        .then(function(token) {
          if (!token) {
            debug('Logout called with a token not represented in DB');
            return res.sendStatus(201);
          }
          token.isRevoked = true;
          token.save().then(function() {
            res.sendStatus(201);
          });
        });
      });
    });
  });
};

function handleError(error, res, next) {
  if (error.name === 'JsonWebTokenError') {
    debug('Logout called with an invalid JWT token');
    return res.sendStatus(201);
  }
  next(error);
}
