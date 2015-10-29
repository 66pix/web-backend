'use strict';

var request = require('supertest');
var expect = require('code').expect;
var app;

describe('API', function() {

  beforeEach(function(done) {
    require('../src/app.js').then(function(_app_) {
      app = _app_;
      done();
    });
  });

  it('should expose seneca on app', function() {
    expect(app.seneca).to.be.an.instanceof(Object);
  });

  it('should protect all /api routes', function(done) {
    request(app)
      .get('/api/users/current')
      .expect(401, done);
  });
});
