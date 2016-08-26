"use strict";
const expect = require('code').expect;
const request = require('supertest');
const models_1 = require('@66pix/models');
const loginHelper_1 = require('../../loginHelper');
describe('Routes Users GET', () => {
    let app;
    let token;
    beforeEach((done) => {
        loginHelper_1.loginHelper()
            .then((result) => {
            app = result.app;
            token = result.token;
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
    it('should respond with an array', (done) => {
        request(app)
            .get('/api/users')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .expect((response) => {
            expect(response.body).to.be.instanceof(Array);
        })
            .expect(200, done);
    });
});
//# sourceMappingURL=list.js.map