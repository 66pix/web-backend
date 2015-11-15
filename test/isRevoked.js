'use strict';

var expect = require('code').expect;
var isRevoked = require('../src/isRevoked.js');
var sinon = require('sinon');
var spy;

describe('isRevoked', function() {

  beforeEach(function(done) {
    spy = sinon.spy();
    done();
  });

  it('should call done with true if the iss is not correct', function(done) {
    isRevoked(null, {
      iss: 'not correct'
    }, spy);
    expect(spy.calledWith(null, true)).to.equal(true);
    done();
  });

  it('should call done with true if the aud is not correct', function(done) {
    isRevoked(null, {
      iss: '66pix Website',
      aud: 'not correct'
    }, spy);
    expect(spy.calledWith(null, true)).to.equal(true);
    done();
  });

  it('should call done with true if the matching token record isRevoked', function(done) {
    require('@66pix/models')
    .then(function(models) {
      return models.Token.build({
        userId: 1,
        userAgent: 'user agent',
        type: 'Login',
        isRevoked: true,
        payload: '',
        updatedWithToken: -1
      }).save();
    })
    .then(function(token) {
      isRevoked(null, {
        iss: '66pix Website',
        aud: '66pix Website User',
        tokenId: token.id
      }, function(error, revoked) {
        if (error) {
          throw error;
        }
        expect(revoked).to.equal(true);
        done();
      });
      return null;
    });
  });
});
