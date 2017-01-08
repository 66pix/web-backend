import http = require('http');
import debugModule = require('debug');
const debug = debugModule('66pix-backend:index');
import {config} from './config';
import {getApp} from './app';

import {initialiseRaven} from './raven';
const Raven = initialiseRaven(require('raven'));

/* istanbul ignore next */
process.on('unhandledRejection', function(reason, promise) {
  debug(reason.message);
  debug(reason.stack);
  Raven.captureException(reason, () => {
    process.exit();
  });
});

let d = require('domain').create();
/* istanbul ignore next */
d.on('error', (error) => {
  debug(error.message);
  debug(error.stack);
  Raven.captureException(error, () => {
    process.exit();
  });
});

export const getServer = getApp.then((app) => {
  return http.createServer(app as any)
    .listen(config.get('PORT'));
});
