'use strict';

var request = require('supertest-as-promised');
var app;

describe('API', function() {

  beforeEach(function(done) {
    this.timeout(10000);
    require('../src/app.js').then(function(_app_) {
      app = _app_;
      done();
    });
  });

  it('should protect all /api routes', function(done) {
    request(app)
      .get('/api/users/current')
      .expect(401)
      .then(function() {
        done();
      });
  });
});

