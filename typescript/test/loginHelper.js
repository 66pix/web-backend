"use strict";
const request = require('supertest');
const R = require('ramda');
const models_1 = require('@66pix/models');
const app_1 = require('../app');
const USER_EMAIL = 'active@66pix.com';
const USER_PASSWORD = '1234567';
exports.loginHelper = () => {
    return new Promise((resolve, reject) => {
        let result = {};
        models_1.initialiseModels
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
            return app_1.getApp;
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
//# sourceMappingURL=loginHelper.js.map