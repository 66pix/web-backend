'use strict';

module.exports = function isRevoked(request, payload, done) {
  if (!payload) {
    return done(null, true);
  }

  if (payload.iss !== '66pix Website') {
    return done(null, true);
  }

  if (payload.aud !== '66pix Website User') {
    return done(null, true);
  }

  return require('@66pix/models')
  .then(function(models) {
    return models.Token.findById(payload.tokenId);
  })
  .then(function(token) {
    if (!token) {
      return done(null, true);
    }
    done(null, token.isRevoked);
    return null;
  });
};
