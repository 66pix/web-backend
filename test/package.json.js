'use strict';

var expect = require('chai').expect;
var fs = require('fs');

describe('Package.json', function() {

  var packageJson;
  beforeEach(function(done) {
    fs.readFile('../package.json', 'utf8', function(error, file) {
      packageJson = JSON.parse(file);
      done();
    });
  });

  it('should specify private: true', function() {
    expect(packageJson).to.have.property('private', true);
  });

  it('should specify license: UNLICENSED', function() {
    expect(packageJson).to.have.property('license', 'UNLICENSED');
  });
});

