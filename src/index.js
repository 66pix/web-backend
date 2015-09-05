'use strict';

process.on('uncaughtException', function(err) {
  console.error('uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

var http = require('http');
var express = require('express');
var expressJwt = require('express-jwt');
var bodyparser = require('body-parser');

var app = express();

app.use(bodyparser.json());

app.use('/api', expressJwt({
  secret: process.env.TOKEN_SECRET
}));

require('./routes/authentication/login.js')(app);
require('66pix-api')(app);

var server = http.createServer(app);
server.listen(process.env.PORT);

