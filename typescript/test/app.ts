import request = require('supertest');
import {getApp} from '../app';

describe('API', function() {

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
});
