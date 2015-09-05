'use strict';

var request = require('supertest-as-promised');
var app = require('../src/app.js');

describe('API Users', function() {

  it('should protect all /api routes', function(done) {
    request(app)
      .get('/api/users/current')
      .expect(401)
      .catch(function() {
        console.log('here');
        done();
      });
  });
});

