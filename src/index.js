'use strict';

process.on('uncaughtException', function(err) {
  console.error('uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

var http = require('http');
var express = require('express');
var cookieparser = require('cookie-parser');
var bodyparser = require('body-parser');
var session = require('express-session');
var csurf = require('csurf');

require('./passport/config.js')();

var app = express();

app.use(cookieparser());
app.use(bodyparser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(csurf());
app.use(function(req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  next();
});

require('./routes/authenticate/login.js')(app);

app.use(express.static('public'));

var server = http.createServer(app);

server.listen(process.env.PORT);

require('66pix-api')(app);

