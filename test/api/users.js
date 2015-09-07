'use strict';

var expect = require('chai').expect;
var request = require('supertest-as-promised');

var app = requireClean('../../app.js');

describe('API Users', function() {

  it('should respond with a user', function(done) {
    request(app)
      .get('/api/users/current')
      .expect(200, {
        id: 1,
        email: 'active@66pix.com',
        name: 'Active User'
      })
      .then(function(res) {
        expect(res.body.id).to.equal(1);
        expect(res.body.email).to.equal('active@66pix.com');
        expect(res.body.name).to.equal('Active User');
        done();
      })
      .catch(function() {
        done();
      });
  });
});

