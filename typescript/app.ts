import {config} from './config.js';
import * as express from 'express';
import * as cors from 'cors';
import expressJwt = require('express-jwt');
import bodyparser = require('body-parser');
const debug = require('debug')('backend');
import {isRevoked} from './isRevoked';
import {api} from '@66pix/api';
import {initialiseModels} from '@66pix/models';

import {login} from './routes/authentication/login';
import {logout} from './routes/authentication/logout';
import {forgotPassword} from './routes/authentication/forgot-password';
import {resetPassword} from './routes/authentication/reset-password';

import {raygunClientFactory} from './raygun';
let raygun = require('raygun');
const raygunClient = raygunClientFactory(raygun);

let app = express();

const corsOptions = {
  origin: config.get('CORS_URLS').split(',')
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(bodyparser.json());

app.use('/api', expressJwt({
  secret: config.get('TOKEN_SECRET'),
  isRevoked: isRevoked
}));

export const getApp = initialiseModels
.then((models) => {
  login(app, models);
  logout(app, models);
  forgotPassword(app, models);
  resetPassword(app, models);
  return api(app);
})
.then(() => {
  app.use(unauthorisedErrorHandler);
  app.use(raygunClient.expressHandler);
  app.use(catchAllErrorHandler);
  return app;
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
