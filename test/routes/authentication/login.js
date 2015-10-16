'use strict';

var request = require('supertest');
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
});

