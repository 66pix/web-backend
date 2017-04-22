"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const debugModule = require("debug");
const debug = debugModule('66pix-backend:index');
const config_1 = require("./config");
const app_1 = require("./app");
const raven_1 = require("./raven");
const Raven = raven_1.initialiseRaven(require('raven'));
const handleError = (error) => {
    debug(error.message);
    debug(error.stack);
    console.log('Reporting error');
    console.log(Raven);
    Raven.captureException(error, () => {
        console.log('Reported error');
        process.exit();
    });
};
/* istanbul ignore next */
process.on('unhandledRejection', handleError);
let d = require('domain').create();
/* istanbul ignore next */
d.on('error', handleError);
exports.getServer = app_1.getApp.then((app) => {
    return http.createServer(app)
        .listen(config_1.config.get('PORT'));
});
//# sourceMappingURL=index.js.map