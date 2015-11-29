'use strict';

var env = require('envalid');
var request = require('supertest');
var expect = require('code').expect;
var jwt = require('jsonwebtoken');
var sinon = require('sinon');
var app;
var jwtToken;

describe('Routes authentication logout', function() {

  beforeEach(function(done) {
    require('../../loginHelper.js')()
    .then(function(result) {
      app = result.app;
      jwtToken = result.token;
      done();

      return null;
    });
  });

  afterEach(function(done) {
    require('@66pix/models')
    .then(function(models) {
      return models.UserAccount.destroy({
        force: true,
        truncate: true,
        cascade: true
      });
    })
    .then(function() {
      done();
      return null;
    })
    .catch(function(error) {
      throw error;
    });
  });

  it('should return 201 if the jwt token is invalid', function(done) {
    request(app)
    .get('/authentication/logout')
    .set('authorization', '')
    .expect(201, done);
  });

  it('should send a non JsonWebTokenError down the middleware chain', function(done) {
    sinon.stub(jwt, 'verify', function(token, secret, callback) {
      callback(new Error('This is another error'));
    });
    request(app)
    .get('/authentication/logout')
    .set('authorization', '')
    .expect(500, function(error, response) {
      if (error) {
        return done(error);
      }
      jwt.verify.restore();
      expect(response.body.message).to.equal('This is another error');
      done();
    });
  });

  it('should return 201 if the jwt token is not present in the database', function(done) {
    var tokenId = jwt.verify(jwtToken.replace('Bearer ', ''), env.get('TOKEN_SECRET')).tokenId;
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
