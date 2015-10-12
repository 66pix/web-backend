'use strict';

var debug = require('debug')('authentication/forgot-password');
var jwt = require('jsonwebtoken');

module.exports = function(app) {

  function responseSuccess(res) {
    res.status(200)
      .json({
        message: 'Please check your email'
      });
  }

  require('@faceleg/66pix-models').then(function(models) {
    app.post('/authentication/forgot-password', function(req, res) {
      if (!req.body.email) {
        debug('Login attempt without an email address');
        return res.status(400)
          .json({
            code: 400,
            message: 'Email is required'
          });
      }
      models.User.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(function(user) {
        if (user) {
          var token = jwt.sign({
            id: user.id
          }, process.env.RESET_PASSWORD_TOKEN_SECRET, {
            expiresInMinutes: 60
          });
          debug('Emailing reset password link to %s', user.email);
          app.seneca.act({
            role: 'mail',
            cmd: 'send',
            code: 'forgot-password',
            to: user.email,
            subject: '66pix Password Reset',
            content: {
              user: user,
              token: token,
              resetUrl: 'URL'
            }
          });
          return responseSuccess(res);
        }
        responseSuccess(res);
      });
    });
  });
};

