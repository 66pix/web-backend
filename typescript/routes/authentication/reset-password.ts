import {config} from '../../config';
const debug = require('debug')('authentication/reset-password');
import jwt = require('jsonwebtoken');
import {initialiseModels} from '@66pix/models';

export function resetPassword(app) {
  initialiseModels
  .then(function(models) {
    app.post('/authentication/reset-password/:token', function(req, res) {

      function sendError(message) {
        return res.status(400)
        .json({
          code: 400,
          message: message
        });
      }

      jwt.verify(req.params.token, config.get('RESET_PASSWORD_TOKEN_SECRET'), function(error, token) {
        if (error) {
          debug(error);
          return sendError(
            'Password reset token is invalid or expired, ' +
              'please perform the "forgot password" process again');
        }

        if (!req.body.newPassword) {
          debug('Missing newPassword');
          return sendError('Please provide a new password');
        }
        if (req.body.newPassword !== req.body.newPasswordRepeat) {
          debug('Password pairs do not match');
          return sendError('You must verify your new password by typing it twice');
        }

        return models.UserAccount.findById(token.id)
        .then(function(user) {
          if (user.status !== 'Active') {
            return sendError('User does not exist or has been deactivated');
          }
          user.password = req.body.newPassword;
          user.save().then(function() {
            res.status(201)
            .send();
          });
          return null;
        });
      });
    });
  });
};
