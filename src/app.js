'use strict';

var express = require('express');
var expressJwt = require('express-jwt');
var bodyparser = require('body-parser');
var debug = require('debug')('backend');
var Promise = require('bluebird');
var isRevoked = require('./isRevoked.js');

var app = express();

app.use(bodyparser.json());

app.use('/api', expressJwt({
  secret: process.env.TOKEN_SECRET,
  isRevoked: isRevoked
}));

require('./routes/authentication/login.js')(app);
require('./routes/authentication/forgot-password.js')(app);
require('./routes/authentication/reset-password.js')(app);

module.exports = new Promise(function(resolve) {
  require('@faceleg/66pix-api')(app)
  .then(function(seneca) {
    app.use(unauthorisedErrorHandler);
    app.seneca = seneca;
    seneca.ready(function() {
      resolve(app);
    });
  });
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
