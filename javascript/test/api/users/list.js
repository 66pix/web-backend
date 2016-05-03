'use strict';
var expect = require('code').expect;
var request = require('supertest');
describe('Routes Users GET', function () {
    var app;
    var token;
    beforeEach(function (done) {
        require('../../loginHelper')()
            .then(function (result) {
            app = result.app;
            token = result.token;
            done();
        });
    });
    afterEach(function (done) {
        require('@66pix/models')
            .then(function (models) {
            return models.UserAccount.destroy({
                truncate: true,
                cascade: true
            });
        })
            .then(function () {
            done();
            return null;
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