'use strict';

var request = require('supertest');
var jwt = require('jsonwebtoken');
var app;
var jwtToken;

describe('Routes authentication logout', function() {

  beforeEach(function(done) {
    require('../../../src/app.js').then(function(_app_) {
      app = _app_;
      request(app)
      .post('/authentication/login')
      .send({
        email: 'active@66pix.com',
        password: '12345'
      })
      .expect(200, function(error, response) {
        if (error) {
          throw error;
        }
        jwtToken = 'Bearer ' + response.body.token;
        done();
      });
    });
  });

  it('should return 201 if the jwt token is invalid', function(done) {
    request(app)
    .get('/authentication/logout')
    .set('authorization', '')
    .expect(201, done);
  });

  it('should return 201 if the jwt token is not present in the database', function(done) {
    var tokenId = jwt.verify(jwtToken.replace('Bearer ', ''), process.env.TOKEN_SECRET).tokenId;
    require('@66pix/models').then(function(models) {
      return models.Token.findById(tokenId);
    })
    .then(function(token) {
      return token.destroy({
        force: true
      });
    })
    .then(function() {
      request(app)
      .get('/authentication/logout')
      .set('authorization', jwtToken)
      .expect(201, done);
    });
  });

  it('should invalidate the jwt token', function(done) {
    request(app)
    .get('/authentication/logout')
    .set('authorization', jwtToken)
    .expect(201, function(error) {
      if (error) {
        throw error;
      }
      request(app)
      .get('/api/users/current')
      .set('authorization', jwtToken)
      .expect(401, done);
    });
  });
});
