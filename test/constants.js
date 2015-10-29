'use strict';

var expect = require('code').expect;

describe('constants', function() {

  it('should expose the correct values', function() {
    var constants = require('../src/constants.js');
    expect(constants.FORGOT_PASSWORD_TOKEN_EXPIRY).to.not.be.undefined();
  });
});
