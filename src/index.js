'use strict';

process.on('uncaughtException', function(err) {
  console.error('uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

var http = require('http');
var server = http.createServer(require('./app.js'));
server.listen(process.env.PORT);

