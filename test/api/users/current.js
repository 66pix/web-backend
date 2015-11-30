'use strict';

var expect = require('code').expect;
var request = require('supertest');

describe('Routes Users current', function() {
  var app;
  var token;
  var user;

  beforeEach(function(done) {
    require('../../loginHelper.js')()
    .then(function(result) {
      user = result.user;
      app = result.app;
      token = result.token;

      done();
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

  it('should respond to current with the current user if authorised', function(done) {
    request(app)
      .get('/api/users/current')
      .set('authorization', token)
      .expect(function(response) {
        expect(response.body).to.deep.contain({
          email: 'active@66pix.com',
          name: 'this is a name',
          id: user.id
        });
      })
      .expect(200, done);
  });
});
