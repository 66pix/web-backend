'use strict';

var request = require('supertest');
var sinon = require('sinon');
var expect = require('code').expect;
var requireClean = require('require-clean');

describe('Routes authentication forgot-password', function() {
  var app;
  var mailer;

  beforeEach(function(done) {
    mailer = requireClean('@66pix/email');
    require('../../loginHelper')()
    .then(function(result) {
      app = result.app;
      done();
      return null;
    });
  });

  afterEach(function(done) {
    require('@66pix/models')
    .then(function(models) {
      return models.UserAccount.destroy({
        force: true,
        truncate: true,
        cascade: true
      });
    })
    .then(function() {
      done();
      return null;
    });
  });

  it('should reject invalid forgot-password requests', function(done) {
    request(app)
    .post('/authentication/forgot-password')
    .expect(400)
    .expect({
      code: 400,
      message: 'Email is required'
    }, done);
  });

  it('should respond with 200 if the email does not exist', function(done) {
    request(app)
    .post('/authentication/forgot-password')
    .send({
      email: 'notpresent@66pix.com'
    })
    .expect(200)
    .expect({
      message: 'Please check your email'
    }, done);
  });

  it('should respond with 200 if the email exists and a forgot password email was sent', function(done) {
    request(app)
    .post('/authentication/forgot-password')
    .send({
      email: 'active@66pix.com'
    })
    .expect(200)
    .expect({
      message: 'Please check your email'
    }, function() {
      done();
    });
  });

  it('should respond with a 500 if something goes wrong with the mailing process', function(done) {
    var Promise = require('bluebird');
    sinon.stub(mailer, 'default', function() {
      return Promise.reject(new Error('this is an error'));
    });

    request(app)
    .post('/authentication/forgot-password')
    .send({
      email: 'active@66pix.com'
    })
    .expect(500, function(error, response) {
      mailer.default.reset();
      if (error) {
        return done(error);
      }
      expect(response.body.message).to.equal('this is an error');
      return done();
    });
  });
});
