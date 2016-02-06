'use strict';

var request = require('supertest');

describe('API', function() {

  var app;
  beforeEach(function(done) {
    require('../src/app.js').then(function(_app_) {
      app = _app_;
      done();
    });
  });

  it('should protect all /api routes', function(done) {
    request(app)
      .get('/api/users/current')
      .expect(401, done);
  });
});
