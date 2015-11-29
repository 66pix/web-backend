'use strict';

var env = require('envalid');

process.on('uncaughtException', function(error) {
  /* eslint-disable no-console, no-process-exit, lines-around-comment */
  console.error('uncaughtException:', error.message);
  console.error(error.stack);
  process.exit(1);
  /* eslint-enable no-console, no-process-exit, lines-around-comment */
});

var http = require('http');

module.exports = require('./app.js')
  .then(function(app) {
    return http.createServer(app)
      .listen(env.get('PORT'));
  });
