'use strict';

var request = require('supertest');
var expect = require('code').expect;

var app;

describe('Routes upload signing', function() {

  var jwtToken;

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

  it('should respond with 400 if no filename or directory were provided', function(done) {
    request(app)
    .post('/upload/signing')
    .set('authorization', jwtToken)
    .expect(400, done);
  });

  it('should respond with a valid policy', function(done) {
    request(app)
    .post('/upload/signing')
    .set('authorization', jwtToken)
    .send({
      filename: 'THIS IS FILENAME',
      directory: 'THIS IS DIRECTORY'
    })
    .expect(200, function(error, response) {
      if (error) {
        throw error;
      }

      expect(response.body).to.only.include([
        'url',
        'fields'
      ]);

      expect(response.body.fields).to.only.include([
        'key',
        'AWSAccessKeyId',
        'acl',
        'policy',
        'signature',
        'success_action_status'
      ]);

      done();
    });
  });

  it('should populate the file paths correctly', function(done) {
    request(app)
    .post('/upload/signing')
    .set('authorization', jwtToken)
    .send({
      filename: 'THIS IS FILENAME',
      directory: 'THIS IS DIRECTORY'
    })
    .expect(200, function(error, response) {
      if (error) {
        throw error;
      }

      expect(response.body.fields.key).to.equal('THIS IS DIRECTORY/THIS IS FILENAME');

      done();
    });
  });
});
