'use strict';

var expect = require('chai').expect;
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
