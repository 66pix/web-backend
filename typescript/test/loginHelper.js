'use strict';

var Promise = require('bluebird');
var request = require('supertest');
var R = require('ramda');

module.exports = function() {
  return new Promise(function(resolve) {
    var result = {};
    require('@66pix/models')
    .then(function(models) {
      result.models = models;
      return result.models.UserAccount.findOrCreate({
        where: {
          email: 'active@66pix.com',
          name: 'this is a name',
          updatedWithToken: -1,
          password: '12345',
          status: 'Active'
        },
        defaults: {
          email: 'active@66pix.com',
          name: 'this is a name',
          updatedWithToken: -1,
          password: '12345',
          status: 'Active'
        }
      });
    })
    .then(function(user) {
      result.user = R.head(user);
      return require('../app');
    })
    .then(function(app) {
      result.app = app;
      request(app)
      .post('/authentication/login')
      .send({
        email: 'active@66pix.com',
        password: '12345'
      })
      .expect(function(response) {
        result.token = 'Bearer ' + response.body.token;
      })
      .expect(200, function() {
        resolve(result);
      });

      return null;
    })
    .catch(function(error) {
      throw error;
    });
  });
};
