/// <reference path="../../../../typings/index.d.ts" />
"use strict";
let config = require('../../../config');
let expect = require('code').expect;
const request = require('supertest');
const jwt = require('jsonwebtoken');
describe('Routes authentication reset-password', function () {
    let app;
    beforeEach(function (done) {
        require('../../../app')
            .then(function (_app_) {
            app = _app_;
            done();
            return null;
        });
    });
    afterEach(function (done) {
        require('@66pix/models')
            .then(function (models) {
            return models.UserAccount.destroy({
                force: true,
                truncate: true,
                cascade: true
            });
        })
            .then(function () {
            done();
            return null;
        });
    });
    it('should reject requests missing a token', function (done) {
        request(app)
            .post('/authentication/reset-password')
            .expect(404, done);
    });
    it('should reject requests with an invalid token', function (done) {
        request(app)
            .post('/authentication/reset-password/invalid')
            .expect(400)
            .expect({
            code: 400,
            message: 'Password reset token is invalid or expired, please perform the "forgot password" process again'
        }, done);
    });
    it('should reject requests with a valid token but missing password pair', function (done) {
        let token = jwt.sign({
            id: 1
        }, config.get('RESET_PASSWORD_TOKEN_SECRET'), {
            expiresIn: '1h'
        });
        request(app)
            .post('/authentication/reset-password/' + token)
            .expect(400)
            .expect({
            code: 400,
            message: 'Please provide a new password'
        }, done);
    });
    it('should reject requests with a password pair that does not match', function (done) {
        let token = jwt.sign({
            id: 1
        }, config.get('RESET_PASSWORD_TOKEN_SECRET'), {
            expiresIn: '1h'
        });
        request(app)
            .post('/authentication/reset-password/' + token)
            .send({
            newPassword: 'new password',
            newPasswordRepeat: 'new passsword'
        })
            .expect(400)
            .expect({
            code: 400,
            message: 'You must verify your new password by typing it twice'
        }, done);
    });
    it('should reject requests for users that are not active', function (done) {
        let models;
        require('@66pix/models')
            .then(function (_models_) {
            models = _models_;
            return models.UserAccount.build({
                email: 'inactive@66pix.com',
                status: 'Inactive',
                updatedWithToken: -1,
                name: 'not active'
            })
                .save();
        })
            .then(function () {
            models.UserAccount.findOne({
                where: {
                    email: 'inactive@66pix.com'
                }
            }).then(function (user) {
                let token = jwt.sign({
                    id: user.id
                }, config.get('RESET_PASSWORD_TOKEN_SECRET'), {
                    expiresIn: 60 * 60
                });
                let password = 'authentication/reset-password/reset';
                request(app)
                    .post('/authentication/reset-password/' + token)
                    .send({
                    newPassword: password,
                    newPasswordRepeat: password
                })
                    .expect(400, function (error, response) {
                    expect(response.body).to.equal({
                        code: 400,
                        message: 'User does not exist or has been deactivated'
                    });
                    done();
                });
            });
            return null;
        });
    });
    it('should reset the correct user\'s password if all token is valid and password pairs match', function (done) {
        let models;
        require('@66pix/models').then(function (_models_) {
            models = _models_;
            return models.UserAccount.build({
                email: 'resetpassword@66pix.com',
                status: 'Active',
                updatedWithToken: -1,
                name: 'not active'
            })
                .save();
        })
            .then(function () {
            models.UserAccount.findOne({
                where: {
                    email: 'resetpassword@66pix.com'
                }
            }).then(function (user) {
                let token = jwt.sign({
                    id: user.id
                }, config.get('RESET_PASSWORD_TOKEN_SECRET'), {
                    expiresIn: 60 * 60
                });
                let password = 'authentication/reset-password/reset';
                request(app)
                    .post('/authentication/reset-password/' + token)
                    .send({
                    newPassword: password,
                    newPasswordRepeat: password
                })
                    .expect(201, function () {
                    models.UserAccount.login('resetpassword@66pix.com', password)
                        .then(function () {
                        done();
                        return null;
                    })
                        .catch(function (error) {
                        throw error;
                    });
                });
            });
            return null;
        });
    });
});
//# sourceMappingURL=reset-password.js.map