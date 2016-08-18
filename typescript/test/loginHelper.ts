import request = require('supertest');
const R = require('ramda');
import {initialiseModels} from '@66pix/models';
import {getApp} from '../app';

const USER_EMAIL = 'active@66pix.com';
const USER_PASSWORD = '1234567';

export const loginHelper = () => {
  return new Promise((resolve, reject) => {
    let result: any = {};
    initialiseModels
    .then((models) => {
      result.models = models;
      return models.UserAccount.destroy({
        truncate: true,
        cascade: true
      });
    })
    .then(() => {
      return result.models.UserAccount.build({
        email: USER_EMAIL,
        name: 'this is a name',
        status: 'Active',
        password: USER_PASSWORD,
        updatedWithToken: -1
      })
      .save();
    })
    .then((user) => {
      result.user = user;
      return getApp;
    })
    .then((app) => {
      result.app = app;
      request(app)
      .post('/authentication/login')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD
      })
      .expect((response) => {
        result.token = 'Bearer ' + response.body.token;
      })
      .expect(200, () => {
        resolve(result);
      });
    })
    .catch(reject);
  });
};
