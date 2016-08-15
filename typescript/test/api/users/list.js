"use strict";
const expect = require('code').expect;
const request = require('supertest');
const models_1 = require('@66pix/models');
describe('Routes Users GET', function () {
    let app;
    let token;
    beforeEach(function (done) {
        require('../../loginHelper').loginHelper()
            .then(function (result) {
            app = result.app;
            token = result.token;
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    afterEach(function (done) {
        models_1.initialiseModels
            .then(function (models) {
            return models.UserAccount.destroy({
                truncate: true,
                cascade: true
            });
        })
            .then(function () {
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    it('should respond with an array', function (done) {
        request(app)
            .get('/api/users')
            .set('authorization', token)
            .set('content-type', 'application/json')
            .expect(function (response) {
            expect(response.body).to.be.instanceof(Array);
        })
            .expect(200, done);
    });
});
//# sourceMappingURL=list.js.map