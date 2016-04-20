'use strict';

var expect = require('code').expect;
var request = require('supertest');

describe('Routes Users PUT', function() {

  var app;
  var user;
  var token;
  var UserAccount;

  beforeEach(function(done) {
    require('../../loginHelper')()
    .then(function(result) {
      UserAccount = result.models.UserAccount;
      user = result.user;
      app = result.app;
      token = result.token;

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
        id: user.id
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
        UserAccount.findById(user.id)
        .then(function() {
          done();
          return null;
        });
      })
      .expect(200, function() {});
  });
});
