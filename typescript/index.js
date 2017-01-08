"use strict";
const http = require("http");
const debugModule = require("debug");
const debug = debugModule('66pix-backend:index');
const config_1 = require("./config");
const app_1 = require("./app");
const raven_1 = require("./raven");
const Raven = raven_1.initialiseRaven(require('raven'));
/* istanbul ignore next */
process.on('unhandledRejection', function (reason, promise) {
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
exports.getServer = app_1.getApp.then((app) => {
    return http.createServer(app)
        .listen(config_1.config.get('PORT'));
});
//# sourceMappingURL=index.js.map