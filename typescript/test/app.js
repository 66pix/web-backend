"use strict";
const request = require('supertest');
const app_1 = require('../app');
describe('App', function () {
    let app;
    beforeEach(function (done) {
        app_1.getApp.then(function (_app_) {
            app = _app_;
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    it('should protect all /api routes', function (done) {
        request(app)
            .get('/api/users/current')
            .expect(401, done);
    });
});
//# sourceMappingURL=app.js.map