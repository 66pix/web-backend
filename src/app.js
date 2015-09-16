'use strict';

var express = require('express');
var expressJwt = require('express-jwt');
var bodyparser = require('body-parser');
var debug = require('debug')('backend');

var app = express();

app.use(bodyparser.json());

app.use('/api', expressJwt({
  secret: process.env.TOKEN_SECRET
}));

require('./routes/authentication/login.js')(app);
require('./routes/authentication/forgot-password.js')(app);

var api = require('@faceleg/66pix-api')(app);
module.exports = api.then(function(seneca) {
  app.use(unauthorisedErrorHandler);
  app.seneca = seneca;
  return app;
});

function unauthorisedErrorHandler(error, req, res, next) {
  if (error.name !== 'UnauthorizedError') {
    return next(error);
  }

  debug(error);
  res.status(401);
  res.json({
    message: error.message
  });
}

