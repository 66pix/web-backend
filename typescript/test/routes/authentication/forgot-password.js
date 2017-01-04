"use strict";
const request = require("supertest");
const sinon = require("sinon");
const expect = require('code').expect;
const requireClean = require('require-clean');
const models_1 = require("@66pix/models");
describe('Routes authentication forgot-password', () => {
    let app;
    let mailer;
    beforeEach((done) => {
        mailer = requireClean('@66pix/email');
        require('../../loginHelper').loginHelper()
            .then((result) => {
            app = result.app;
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    afterEach((done) => {
        models_1.initialiseModels
            .then((models) => {
            return models.UserAccount.destroy({
                truncate: true,
                cascade: true
            });
        })
            .then(() => {
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    it('should reject invalid forgot-password requests', (done) => {
        request(app)
            .post('/authentication/forgot-password')
            .expect(400)
            .expect({
            code: 400,
            message: 'Email is required'
        }, done);
    });
    it('should respond with 200 if the email does not exist', (done) => {
        request(app)
            .post('/authentication/forgot-password')
            .send({
            email: 'notpresent@66pix.com'
        })
            .expect(200)
            .expect({
            message: 'Please check your email'
        }, done);
    });
    it('should respond with 200 if the email exists and a forgot password email was sent', (done) => {
        request(app)
            .post('/authentication/forgot-password')
            .send({
            email: 'active@66pix.com'
        })
            .expect(200)
            .expect({
            message: 'Please check your email'
        }, () => {
            done();
        });
    });
    it('should respond with a 500 if something goes wrong with the mailing process', (done) => {
        let Promise = require('bluebird');
        sinon.stub(mailer, 'default', () => {
            return Promise.reject(new Error('this is an error'));
        });
        request(app)
            .post('/authentication/forgot-password')
            .send({
            email: 'active@66pix.com'
        })
            .expect(500, (error, response) => {
            mailer.default.reset();
            if (error) {
                return done(error);
            }
            expect(response.body.message).to.equal('this is an error');
            return done();
        });
    });
});
//# sourceMappingURL=forgot-password.js.map