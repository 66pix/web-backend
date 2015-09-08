'use strict';

var express = require('express');
var expressJwt = require('express-jwt');
var bodyparser = require('body-parser');

var app = express();

app.use(bodyparser.json());

app.use('/api', expressJwt({
  secret: process.env.TOKEN_SECRET
}));

require('./routes/authentication/login.js')(app);
require('@faceleg/66pix-api')(app);

module.exports = app;

