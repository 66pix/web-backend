'use strict';

var request = require('supertest');
var expect = require('code').expect;
var Plan = require('test-plan');
var app;

describe('Routes authentication login', function() {

  beforeEach(function(done) {
    require('../../../src/app.js').then(function(_app_) {
      app = _app_;
      done();
    });
  });

  it('should reject invalid login attempts', function(done) {
    var plan = new Plan(2, done);
    request(app)
      .post('/authentication/login')
      .expect(401)
      .expect({
        code: 401,
        message: 'Invalid email or password'
      }, function() {
        plan.ok(true);
      });

    request(app)
      .post('/authentication/login')
      .send({
        email: 'inactive@66pix.com',
        password: 'invalid password'
      })
      .expect(401)
      .expect({
        code: 401,
        message: 'Invalid email or password'
      }, function() {
        plan.ok(true);
      });
  });

  it('should return a JWT token', function(done) {
    request(app)
      .post('/authentication/login')
      .send({
        email: 'active@66pix.com',
        password: '12345'
      })
      .expect(200)
      .end(function(error, response) {
        if (error) {
          throw error;
        }
        var jwtToken = JSON.parse(response.text);
        expect(jwtToken.token).to.exist();
        done();
      });
  });
});
