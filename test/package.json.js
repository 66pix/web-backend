'use strict';

var expect = require('code').expect;
var fs = require('fs');
var path = require('path');

describe('Package.json', function() {

  var packageJson;
  beforeEach(function(done) {
    fs.readFile(path.join(__dirname, '../package.json'), 'utf8', function(error, file) {
      if (error) {
        return done(error);
      }
      packageJson = JSON.parse(file);
      return done();
    });
  });

  it('should specify private: true', function() {
    expect(packageJson.private).to.equal(true);
  });

  it('should specify license: UNLICENSED', function() {
    expect(packageJson.license).to.equal('UNLICENSED');
  });
});
