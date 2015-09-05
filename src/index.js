'use strict';

process.on('uncaughtException', function(error) {
  console.error('uncaughtException:', error.message);
  console.error(error.stack);
  process.exit(1);
});

var http = require('http');

require('./app.js')
.then(function(app) {
  http.createServer(app)
    .listen(process.env.PORT);
});

