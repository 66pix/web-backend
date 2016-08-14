import {config} from './config.js';
import express = require('express');
let expressJwt = require('express-jwt');
import bodyparser = require('body-parser');
const debug = require('debug')('backend');
import Bluebird = require('bluebird');
import {isRevoked} from './isRevoked';

import {login} from './routes/authentication/login';
import {logout} from './routes/authentication/logout';
import {forgotPassword} from './routes/authentication/forgot-password';
import {resetPassword} from './routes/authentication/reset-password';

import {raygunClientFactory} from './raygun';
let raygun = require('raygun');
const raygunClient = raygunClientFactory(raygun);

let app = express();

app.use(bodyparser.json());

app.use(['/api'], expressJwt({
  secret: config.get('TOKEN_SECRET'),
  isRevoked: isRevoked
}));

login(app);
logout(app);
forgotPassword(app);
resetPassword(app);

module.exports = new Bluebird((resolve) => {
  require('@66pix/api')(app)
  .then(() => {
    app.use(unauthorisedErrorHandler);
    app.use(raygunClient.expressHandler);
    app.use(catchAllErrorHandler);
    resolve(app);
  });
});

function unauthorisedErrorHandler(error, req, res, next) {
  if (error.name !== 'UnauthorizedError') {
    return next(error);
  }

  debug(error);
  res.status(401);
  return res.json({
    message: error.message
  });
}

function catchAllErrorHandler(error, req, res, next) {
  let code = 500;
  if (error.code) {
    code = error.code;
  }

  debug(error);
  res.status(code);
  res.json({
    message: error.message
  });
}

process.on('unhandledRejection', (error) => {
  raygunClient.send(error);
});
