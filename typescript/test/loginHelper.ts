import request = require('supertest');
import {initialiseModels} from '@66pix/models';
import {getApp} from '../app';

const USER_EMAIL = 'active@66pix.com';
const USER_PASSWORD = 'ASDF1234';
let result: any = {};

export const loginHelper = () => {
  return getApp
  .then((app) => {
    result.app = app;
    return initialiseModels;
  })
  .then((models) => {
    result.models = models;
    return models.UserAccount.destroy({
      where: {
        email: USER_EMAIL
      }
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
    return new Promise((resolve, reject) => {
      request(result.app)
      .post('/authentication/login')
      .send({
        email: USER_EMAIL,
        password: USER_PASSWORD
      })
      .expect(200, (error, response) => {
        result.token = 'Bearer ' + response.body.token;
        resolve(result);
      });
    });
  })
  .catch((error) => {
    console.log(JSON.stringify(error, null, 2));
    throw error;
  });
};
