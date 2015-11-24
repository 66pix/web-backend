'use strict';

var expect = require('code').expect;
var request = require('supertest');

var app;
var user;

var token;

describe('Routes Users PUT', function() {

  beforeEach(function(done) {
    require('../../../src/app.js').then(function(_app_) {
      app = _app_;
      request(app)
        .post('/authentication/login')
        .send({
          email: 'active@66pix.com',
          password: '12345'
        })
        .expect(function(response) {
          token = 'Bearer ' + response.body.token;
          request(app)
            .get('/api/users/current')
            .set('authorization', token)
            .expect(function(currentResponse) {
              user = currentResponse.body;
            })
            .expect(200, done);
        })
        .expect(200, function() { });
    });
  });

  /**
   * Reset test user's details
   */
  afterEach(function(done) {
    request(app)
      .put('/api/users/' + user.id)
      .set('authorization', token)
      .send({
        id: user.id,
        name: user.name,
        email: user.email,
        password: '12345'
      })
      .expect(200, done);
  });

  it('should respond with a 200 and the updated user', function(done) {
    request(app)
      .put('/api/users/' + user.id)
      .send({
        id: user.id,
        email: 'active@66pix.com',
        password: '123456',
        name: 'Updated Name'
      })
      .set('authorization', token)
      .expect(function(response) {
        var _user_ = response.body;
        expect(_user_).to.deep.contain({
          email: 'active@66pix.com',
          name: 'Updated Name',
          id: 1
        });
      })
      .expect(200, done);
  });

  it('should not change the password even if a different password was sent', function(done) {
    request(app)
      .put('/api/users/' + user.id)
      .send({
        id: user.id,
        email: user.email,
        password: 'new password',
        name: user.name
      })
      .set('authorization', token)
      .expect(function() {
        request(app)
          .post('/authentication/login')
          .send({
            email: 'active@66pix.com',
            password: '12345'
          })
          .expect(200, done);
      })
      .expect(200, function() {});
  });
});
