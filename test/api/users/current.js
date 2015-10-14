'use strict';

var expect = require('chai').expect;
var request = require('supertest');
var requireClean = require('require-new');
var app;

var token;

describe('Routes Users current', function() {

  beforeEach(function(done) {
    requireClean('../../../src/app.js').then(function(_app_) {
      app = _app_;
      request(app)
        .post('/authentication/login')
        .send({
          email: 'active@66pix.com',
          password: '12345'
        })
        .expect(function(response) {
          token = 'Bearer ' + response.body.token;
        })
        .expect(200, done);
    });
  });

  it('should respond to current with the current user if authorised', function(done) {
    request(app)
      .get('/api/users/current')
      .set('authorization', token)
      .expect(function(response) {
        var user = response.body;
        console.log(user);
        expect(user).to.have.property('email', 'active@66pix.com');
        expect(user).to.have.property('name', 'Active User');
        expect(user).to.have.property('id', 1);
      })
      .expect(200, done);
  });
});
