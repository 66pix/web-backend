import request = require('supertest');
import {getApp} from '../app';
import {config} from '../config';
const expect = require('code').expect;

describe.only('App', function() {

  let app;
  beforeEach(function(done) {
    getApp.then(function(_app_) {
      app = _app_;
      done();
    })
    .catch((error) => {
      console.log(JSON.stringify(error, null, 2));
      done(error);
    });
  });

  it('should protect all /api routes', function(done) {
    request(app)
      .get('/api/users/current')
      .expect(401, done);
  });

  it('should respond correctly to OPTIONS requests', (done) => {
    request(app)
    .options('/authentication/login')
    .set('Access-Control-Request-Method', 'POST')
    .expect(204, (error, response) => {
      expect(response.headers['access-control-allow-methods']).to.equal('GET,HEAD,PUT,PATCH,POST,DELETE');
      expect(response.headers['access-control-allow-origin']).to.equal(config.get('CORS_URL'));
      done();
    });
  });

  it('should allow CORS requests from only the configured origin', (done) => {
    request(app)
    .post('/authentication/login')
    .send({
      email: 'test@66pix.com',
      password: 'alskdfdsj'
    })
    .set({
      'Origin': config.get('CORS_URL')
    })
    .expect(401, done);
  });

});
