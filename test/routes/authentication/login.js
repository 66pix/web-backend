'use strict';

var request = require('supertest-as-promised');
var expect = require('chai').expect;
var Plan = require('test-plan');
var app;

describe('Routes authentication login', function() {

  beforeEach(function(done) {
    this.timeout(10000);
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
      .then(function(response) {
        expect(response.body.code).to.be.equal(401);
        expect(response.body.message).to.be.equal('Invalid email or password');
        plan.ok(true);
      });

    request(app)
      .post('/authentication/login')
      .send({
        email: 'inactive@66pix.com',
        password: 'invalid password'
      })
      .expect(401)
      .then(function(response) {
        expect(response.body.code).to.be.equal(401);
        expect(response.body.message).to.be.equal('Invalid email or password');
        plan.ok(true);
      });
  });
});

