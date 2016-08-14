"use strict";
const request = require('supertest');
describe('API', function () {
    let app;
    beforeEach(function (done) {
        require('../app').then(function (_app_) {
            app = _app_;
            done();
        });
    });
    it('should protect all /api routes', function (done) {
        request(app)
            .get('/api/users/current')
            .expect(401, done);
    });
});
//# sourceMappingURL=app.js.map