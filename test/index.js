'use strict';

var expect = require('chai').expect;

describe('index', function() {

  it('should create a valid server', function(done) {
    process.env.PORT = 3333;
    this.timeout(10000);
    require('../src/index.js').then(function(server) {
      expect(server).to.be.defined;
      expect(server.close).to.be.defined;
      server.close();
      process.env.PORT = 3000;
      done();
    });
  });
});

