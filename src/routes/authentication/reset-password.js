'use strict';

var debug = require('debug')('authentication/reset-password');
var jwt = require('jsonwebtoken');

module.exports = function(app) {

  require('@66pix/models').then(function(models) {
    app.post('/authentication/reset-password/:token', function(req, res) {

      function sendError(message) {
        return res.status(400)
          .json({
            code: 400,
            message: message
          });
      }

      jwt.verify(req.params.token, process.env.RESET_PASSWORD_TOKEN_SECRET, function(error, token) {
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

        models.User.findById(token.id).then(function(user) {
          if (user.status !== 'Active') {
            return sendError('User does not exist or has been deactivated');
          }
          user.password = req.body.newPassword;
          user.save().then(function() {
            res.status(201)
              .send();
          });
        });
      });
    });
  });
};

