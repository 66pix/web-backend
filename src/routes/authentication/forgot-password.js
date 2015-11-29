'use strict';

var env = require('envalid');
var debug = require('debug')('authentication/forgot-password');
var jwt = require('jsonwebtoken');

module.exports = function(app) {

  function responseSuccess(res) {
    res.status(200)
    .json({
      message: 'Please check your email'
    });
  }

  require('@66pix/models').then(function(models) {
    app.post('/authentication/forgot-password', function(req, res) {
      if (!req.body.email) {
        debug('Login attempt without an email address');
        return res.status(400)
        .json({
          code: 400,
          message: 'Email is required'
        });
      }
      models.UserAccount.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(function(user) {
        if (!user) {
          return responseSuccess(res);
        }
        return [user, models.Token.build({
          userId: user.id,
          userAgent: req.headers['user-agent'],
          type: 'Reset Password',
          isRevoked: false,
          payload: '',
          updatedWithToken: -1
        }).save()];
      })
      .spread(function(user, token) {
        var jwtToken = jwt.sign({
          id: user.id,
          tokenId: token.id
        }, env.get('RESET_PASSWORD_TOKEN_SECRET'), {
          expiresIn: '1h',
          issuer: '66pix Website',
          audience: '66pix Website User'
        });

        var expiresOn = new Date();
        token.expiresOn = expiresOn.getTime() + 1 * 60 * 60 * 1000;
        token.updatedWithToken = token.id;
        token.payload = jwtToken;
        return [user, jwtToken, token.save()];
      })
      .spread(function(user, jwtToken) {
        debug('Emailing reset password link to %s', user.email);
        app.seneca.act({
          role: 'mail',
          cmd: 'send',
          code: 'forgot-password',
          to: user.get('email'),
          subject: '66pix Password Reset',
          content: {
            user: {
              email: user.get('email'),
              name: user.get('name')
            },
            token: jwtToken
          }
        }, function(error) {
          if (error) {
            debug(error);
            return res.status(500)
            .json({
              message: error.message
            });
          }
          return responseSuccess(res);
        });
      });
    });
  });
};
