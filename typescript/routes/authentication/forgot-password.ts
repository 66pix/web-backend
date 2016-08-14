import {config} from '../../config';
const debug = require('debug')('authentication/forgot-password');
import jwt = require('jsonwebtoken');
import path = require('path');
import Bluebird = require('bluebird');
import nunjucks = require('nunjucks');
import {initialiseModels} from '@66pix/models';

module.exports = function(app) {

  function responseSuccess(res) {
    res.status(200)
    .json({
      message: 'Please check your email'
    });
  }

  initialiseModels
  .then(function(models) {
    app.post('/authentication/forgot-password', function(req, res) {
      if (!req.body.email) {
        debug('Login attempt without an email address');
        return res.status(400)
        .json({
          code: 400,
          message: 'Email is required'
        });
      }
      return models.UserAccount.findOne({
        where: {
          email: req.body.email
        }
      })
      .then(function(user) {
        if (!user) {
          responseSuccess(res);
          return Bluebird.reject(new Error('User not found'));
        }
        return [
          user,
          models.Token.build({
            userId: user.id,
            userAgent: req.headers['user-agent'],
            type: 'Reset Password',
            isRevoked: false,
            payload: '',
            updatedWithToken: -1
          })
          .save()
        ];
      })
      .spread(function(user, token) {
        var jwtToken = jwt.sign({
          id: user.id,
          tokenId: token.id
        }, config.get('RESET_PASSWORD_TOKEN_SECRET'), {
          expiresIn: '1h',
          issuer: '66pix Website',
          audience: '66pix Website User'
        });

        var expiresOn = new Date();
        token.expiresOn = expiresOn.getTime() + 1 * 60 * 60 * 1000;
        token.updatedWithToken = token.id;

        token.payload = jwtToken;
        return [
          user,
          jwtToken,
          token.save()
        ];
      })
      .spread(function(user, jwtToken) {
        debug('Emailing reset password link to %s', user.email);
        var subject = '66pix Password Reset';
        var nunjucksContent = {
          subject: subject,
          token: jwtToken,
          baseUrl: config.get('BASE_URL')
        };

        require('@66pix/email').default({
          to: user.get('email'),
          subject: subject,
          content: {
            html: nunjucks.render(path.join(__dirname, '../../../email/forgot-password/html.nunjucks'), nunjucksContent),
            text: nunjucks.render(path.join(__dirname, '../../../email/forgot-password/text.nunjucks'), nunjucksContent),
            user: {
              email: user.get('email'),
              name: user.get('name')
            }
          }
        })
        .then(function() {
          responseSuccess(res);
          return null;
        })
        .catch(function(error) {
          debug(error);
          res.status(500)
          .json({
            message: error.message
          });
        });
        return null;
      })
      .catch(function(error) {
        if (error.message === 'User not found') {
          return debug('User not found with email: ' + req.body.email);
        }
        throw error;
      });
    });
  });
};
