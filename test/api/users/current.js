'use strict';

var expect = require('chai').expect;
var request = require('supertest-as-promised');
var app;

var token;

describe('API Users', function() {

  beforeEach(function(done) {
    this.timeout(10000);
    require('../../../src/app.js').then(function(_app_) {
      app = _app_;
      request(app)
        .post('/authentication/login')
        .send({
          email: 'active@66pix.com',
          password: '12345'
        })
        .expect(200)
        .then(function(response) {
          token = 'Bearer ' + response.body.token;
          done();
        });
    });
  });

  it('should respond to current with the current user if authorised', function(done) {
    request(app)
      .get('/api/users/current')
      .set('authorization', token)
      .expect(200)
      .then(function(response) {
        var user = response.body;
        expect(user).to.have.property('email', 'active@66pix.com');
        expect(user).to.have.property('name', 'Active User');
        expect(user).to.have.property('id', 1);
        done();
      });
  });

  it('should protect all /api routes', function(done) {
    request(app)
      .get('/api/users/current')
      .expect(401)
      .then(function() {
        done();
      });
  });
});
