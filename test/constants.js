'use strict';

var expect = require('chai').expect;

describe('constants', function() {

  it('should expose the correct values', function() {
    var constants = require('../constants.js');
    expect(constants.FORGOT_PASSWORD_TOKEN_EXPIRY).to.be.defined;
  });
});

