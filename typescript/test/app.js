"use strict";
const request = require('supertest');
const app_1 = require('../app');
const config_1 = require('../config');
const expect = require('code').expect;
describe.only('App', function () {
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
    it('should respond correctly to OPTIONS requests', (done) => {
        request(app)
            .options('/public/api/pricing')
            .set('Access-Control-Request-Method', 'POST')
            .expect(204, (error, response) => {
            expect(response.headers['access-control-allow-methods']).to.equal('GET,HEAD,PUT,PATCH,POST,DELETE');
            expect(response.headers['access-control-allow-origin']).to.equal(config_1.config.get('CORS_URL'));
            done();
        });
    });
    it('should allow CORS requests from only the configured origin', (done) => {
        request(app)
            .get('/public/api/pricing')
            .set('Origin', config_1.config.get('CORS_URL'))
            .expect(200, done);
    });
    it('should reject CORS requests from the wrong URL', (done) => {
        request(app)
            .get('/public/api/pricing')
            .set('Origin', config_1.config.get('CORS_URL') + '.suffix.com')
            .expect(400, done);
    });
});
//# sourceMappingURL=app.js.map