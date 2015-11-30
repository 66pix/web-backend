'use strict';

var request = require('supertest');
var sinon = require('sinon');
var expect = require('code').expect;

describe('Routes authentication forgot-password', function() {
  var app;

  beforeEach(function(done) {
    require('../../loginHelper.js')()
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
    })
    .catch(function(error) {
      throw error;
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

  it('should respond with a 500 if something went wrong', function(done) {
    sinon.stub(app.seneca, 'act', function(args, callback) {
      callback(new Error('An error'));
    });
    request(app)
    .post('/authentication/forgot-password')
    .send({
      email: 'active@66pix.com'
    })
    .expect(500)
    .expect({
      message: 'An error'
    }, function() {
      app.seneca.act.restore();
      done();
    });
  });

  it('should cause seneca to act with the correct arguments', function(done) {
    sinon.stub(app.seneca, 'act', function(args) {
      expect(args).to.deep.contain({
        role: 'mail',
        cmd: 'send',
        code: 'forgot-password',
        to: 'active@66pix.com',
        subject: '66pix Password Reset'
      });

      app.seneca.act.restore();

      done();
    });

    request(app)
    .post('/authentication/forgot-password')
    .send({
      email: 'active@66pix.com'
    })
    .expect(200, function() {});
  });
});
