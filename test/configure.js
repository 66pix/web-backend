'use strict';

process.setMaxListeners(0);

before(function(done) {
  require('@66pix/models')
  .then(function(models) {
    return require('@66pix/fixtures')(models);
  })
  .then(function() {
    done();
  });
});
