import Bluebird = require('bluebird');
import request = require('supertest');
const R = require('ramda');
import {initialiseModels} from '@66pix/models';

module.exports = function() {
  return new Bluebird(function(resolve) {
    let result: any = {};
    initialiseModels
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
