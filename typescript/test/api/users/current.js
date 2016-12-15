"use strict";
const expect = require('code').expect;
const request = require("supertest");
const models_1 = require("@66pix/models");
const loginHelper_1 = require("../../loginHelper");
describe('Routes Users current', () => {
    let app;
    let token;
    let user;
    beforeEach((done) => {
        loginHelper_1.loginHelper()
            .then((result) => {
            user = result.user;
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
    it('should respond to current with the current user if authorised', (done) => {
        request(app)
            .get('/api/users/current')
            .set('authorization', token)
            .expect((response) => {
            expect(response.body).to.contain({
                email: 'active@66pix.com',
                name: 'this is a name',
                id: user.id
            });
        })
            .expect(200, done);
    });
});
//# sourceMappingURL=current.js.map