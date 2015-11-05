'use strict';

var request = require('supertest');
var jwt = require('jsonwebtoken');

var app;

describe('Routes authentication reset-password', function() {

  beforeEach(function(done) {
    require('../../../src/app.js')
    .then(function(_app_) {
      app = _app_;
      done();
      return null;
    });
  });

  it('should reject requests missing a token', function(done) {
    request(app)
    .post('/authentication/reset-password')
    .expect(404, done);
  });

  it('should reject requests with an invalid token', function(done) {
    request(app)
    .post('/authentication/reset-password/invalid')
    .expect(400)
    .expect({
      code: 400,
      message: 'Password reset token is invalid or expired, please perform the "forgot password" process again'
    }, done);
  });

  it('should reject requests with a valid token but missing password pair', function(done) {
    var token = jwt.sign({
      id: 1
    }, process.env.RESET_PASSWORD_TOKEN_SECRET, {
      expiresIn: 0
    });

    request(app)
    .post('/authentication/reset-password/' + token)
    .expect(400)
    .expect({
      code: 400,
      message: 'Please provide a new password'
    }, done);
  });

  it('should reject requests with a password pair that does not match', function(done) {
    var token = jwt.sign({
      id: 1
    }, process.env.RESET_PASSWORD_TOKEN_SECRET, {
      expiresIn: 0
    });

    request(app)
    .post('/authentication/reset-password/' + token)
    .send({
      newPassword: 'new password',
      newPasswordRepeat: 'new passsword'
    })
    .expect(400)
    .expect({
      code: 400,
      message: 'You must verify your new password by typing it twice'
    }, done);
  });

  it('should reject requests for users that are not active', function(done) {
    require('@66pix/models').then(function(models) {
      models.User.findOne({
        where: {
          email: 'inactive@66pix.com'
        }
      }).then(function(user) {
        var token = jwt.sign({
          id: user.id
        }, process.env.RESET_PASSWORD_TOKEN_SECRET, {
          expiresIn: 60 * 60
        });

        var password = 'authentication/reset-password/reset';

        request(app)
        .post('/authentication/reset-password/' + token)
        .send({
          newPassword: password,
          newPasswordRepeat: password
        })
        .expect(400, {
          code: 400,
          message: 'User does not exist or has been deactivated'
        }, done);
      });
    });
  });

  it('should reset the correct user\'s password if all token is valid and password pairs match', function(done) {
    require('@66pix/models').then(function(models) {
      models.User.findOne({
        where: {
          email: 'resetpassword@66pix.com'
        }
      }).then(function(user) {
        var token = jwt.sign({
          id: user.id
        }, process.env.RESET_PASSWORD_TOKEN_SECRET, {
          expiresIn: 60 * 60
        });

        var password = 'authentication/reset-password/reset';

        request(app)
        .post('/authentication/reset-password/' + token)
        .send({
          newPassword: password,
          newPasswordRepeat: password
        })
        .expect(201, function() {
          models.User.login('resetpassword@66pix.com', password).then(function() {
            done();
          }).catch(function(error) {
            done(error);
          });
        });
      });
    });
  });
});
