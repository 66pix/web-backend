'use strict';

var request = require('supertest');
var sinon = require('sinon');
var expect = require('code').expect;
var app;

describe('Routes authentication forgot-password', function() {

  beforeEach(function(done) {
    require('../../../src/app.js').then(function(_app_) {
      app = _app_;
      done();
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
