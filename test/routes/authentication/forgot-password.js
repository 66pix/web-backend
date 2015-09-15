'use strict';

var request = require('supertest');
var app;

describe('Routes authentication forgot-password', function() {

  beforeEach(function(done) {
    this.timeout(10000);
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

  it('should respond with 200 if the email exists and a forgot password email was send', function(done) {
    request(app)
      .post('/authentication/forgot-password')
      .send({
        email: 'active@66pix.com'
      })
      .expect(200)
      .expect({
        message: 'Please check your email'
      }, done);
  });

  it('should cause seneca to act with the correct arguments', function(done) {

    done();
  });
});

