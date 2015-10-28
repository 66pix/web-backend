'use strict';

var expect = require('code').expect;

describe('index', function() {

  it('should create a valid server', function(done) {
    process.env.PORT = 3333;
    require('../src/index.js').then(function(server) {
      expect(server).to.not.be.undefined();
      expect(server.close).to.not.be.undefined();
      server.close();
      process.env.PORT = 3000;
      done();
    });
  });
});
