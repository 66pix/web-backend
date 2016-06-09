/// <reference path="../typings/index.d.ts" />

import http = require('http');
import debugModule = require('debug');
let debug = debugModule('66pix-backend:index');
let config = require('./config');

import {raygunClientFactory} from './raygun';
let raygun = require('raygun');
const raygunClient = raygunClientFactory(raygun);

let d = require('domain').create();
/* istanbul ignore next */
d.on('error', (error) => {
  debug(error.message);
  debug(error.stack);
  raygunClient.send(error, {}, () => {
    process.exit();
  });
});

module.exports = require('./app')
.then((app) => {
  return http.createServer(app)
    .listen(config.get('PORT'));
});
