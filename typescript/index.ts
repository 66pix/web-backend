import http = require('http');
import debugModule = require('debug');
const debug = debugModule('66pix-backend:index');
import {config} from './config';
import {getApp} from './app';

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

export const getServer = getApp.then((app) => {
  return http.createServer(app as any)
    .listen(config.get('PORT'));
});
