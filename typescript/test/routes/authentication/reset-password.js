"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../../config");
const expect = require('code').expect;
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app_1 = require("../../../app");
const models_1 = require("@66pix/models");
describe('Routes authentication reset-password', () => {
    let app;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        app = yield app_1.getApp;
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        const models = yield models_1.initialiseModels;
        yield models.UserAccount.destroy({
            force: true,
            truncate: true,
            cascade: true
        });
    }));
    it('should reject requests with an invalid token', (done) => {
        request(app)
            .post('/authentication/reset-password/invalid')
            .expect(400)
            .expect({
            code: 400,
            message: 'Password reset token is invalid or expired, please perform the "forgot password" process again'
        }, done);
    });
    it('should reject requests with a valid token but missing password pair', (done) => {
        let token = jwt.sign({
            id: 1
        }, config_1.config.get('RESET_PASSWORD_TOKEN_SECRET'), {
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
    it('should reject requests with a password pair that does not match', (done) => {
        let token = jwt.sign({
            id: 1
        }, config_1.config.get('RESET_PASSWORD_TOKEN_SECRET'), {
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
    it('should reject requests for users that are not active', (done) => {
        let models;
        models_1.initialiseModels
            .then((_models_) => {
            models = _models_;
            return models.UserAccount.build({
                email: 'inactive@66pix.com',
                status: 'Inactive',
                updatedWithToken: -1,
                name: 'not active'
            })
                .save();
        })
            .then(() => {
            models.UserAccount.findOne({
                where: {
                    email: 'inactive@66pix.com'
                }
            }).then((user) => {
                let token = jwt.sign({
                    id: user.id
                }, config_1.config.get('RESET_PASSWORD_TOKEN_SECRET'), {
                    expiresIn: 60 * 60
                });
                let password = 'authentication/reset-password/reset';
                request(app)
                    .post('/authentication/reset-password/' + token)
                    .send({
                    newPassword: password,
                    newPasswordRepeat: password
                })
                    .expect(400, (error, response) => {
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
    it('should reset the correct user\'s password if all token is valid and password pairs match', (done) => {
        let models;
        models_1.initialiseModels
            .then((_models_) => {
            models = _models_;
            return models.UserAccount.build({
                email: 'resetpassword@66pix.com',
                status: 'Active',
                updatedWithToken: -1,
                name: 'not active'
            })
                .save();
        })
            .then(() => {
            models.UserAccount.findOne({
                where: {
                    email: 'resetpassword@66pix.com'
                }
            }).then((user) => {
                let token = jwt.sign({
                    id: user.id
                }, config_1.config.get('RESET_PASSWORD_TOKEN_SECRET'), {
                    expiresIn: 60 * 60
                });
                let password = 'authentication/reset-password/reset';
                request(app)
                    .post('/authentication/reset-password/' + token)
                    .send({
                    newPassword: password,
                    newPasswordRepeat: password
                })
                    .expect(201, () => {
                    models.UserAccount.login('resetpassword@66pix.com', password)
                        .then(() => {
                        done();
                    })
                        .catch((error) => {
                        throw error;
                    });
                });
            });
            return null;
        });
    });
});
//# sourceMappingURL=reset-password.js.map