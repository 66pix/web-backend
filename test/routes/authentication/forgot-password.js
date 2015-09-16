'use strict';

var request = require('supertest');
var sinon = require('sinon');
var expect = require('chai').expect;
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
    sinon.stub(app.seneca, 'act', function() {});
    request(app)
      .post('/authentication/forgot-password')
      .send({
        email: 'active@66pix.com'
      })
      .expect(200)
      .expect({
        message: 'Please check your email'
      }, function() {
        app.seneca.act.restore();
        done();
      });
  });

  it('should cause seneca to act with the correct arguments', function(done) {
    this.timeout(5000);
    sinon.stub(app.seneca, 'act', function(args) {
      expect(args).to.have.property('role', 'mail');
      expect(args).to.have.property('cmd', 'send');
      expect(args).to.have.property('code', 'forgot-password');
      expect(args).to.have.property('to', 'active@66pix.com');
      expect(args).to.have.property('subject', '66pix Password Reset');

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

