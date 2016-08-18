"use strict";
const request = require('supertest');
const R = require('ramda');
const models_1 = require('@66pix/models');
const app_1 = require('../app');
const USER_EMAIL = 'active@66pix.com';
const USER_PASSWORD = 'ASDF1234';
let result = {};
exports.loginHelper = () => {
    return models_1.initialiseModels
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
        return app_1.getApp;
    })
        .then((app) => {
        return new Promise((resolve, reject) => {
            result.app = app;
            request(app)
                .post('/authentication/login')
                .send({
                email: USER_EMAIL,
                password: USER_PASSWORD
            })
                .expect(200, (error, response) => {
                console.log(JSON.stringify(response, null, 2));
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
//# sourceMappingURL=loginHelper.js.map