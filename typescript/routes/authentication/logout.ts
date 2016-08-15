import {config} from '../../config';
import jwt = require('jsonwebtoken');
const debug = require('debug')('authentication/logout');
import {initialiseModels} from '@66pix/models';

export function logout(app) {
  initialiseModels
  .then((models) => {
    app.post('/authentication/logout', (req, res, next) => {
      jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.get('TOKEN_SECRET'), (error, jwtToken) => {
        if (error) {
          return handleError(error, res, next);
        }

        return models.Token.findById(jwtToken.tokenId)
        .then((token) => {
          if (!token) {
            debug('Logout called with a token not represented in DB');
            return res.sendStatus(204);
          }
          token.isRevoked = true;
          token.save()
          .then(() => {
            res.sendStatus(204);
            return null;
          });
          return null;
        });
      });
    });
    return null;
  });
};

function handleError(error, res, next) {
  if (error.name === 'JsonWebTokenError') {
    debug('Logout called with an invalid JWT token');
    return res.sendStatus(204);
  }

  if (error.name === 'TokenExpiredError') {
    debug('Logout called with an expired JWT token');
    return res.sendStatus(204);
  }

  return next(error);
}
