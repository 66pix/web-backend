"use strict";
const http = require("http");
const debugModule = require("debug");
const debug = debugModule('66pix-backend:index');
const config_1 = require("./config");
const app_1 = require("./app");
const raygun_1 = require("./raygun");
let raygun = require('raygun');
const raygunClient = raygun_1.raygunClientFactory(raygun);
let d = require('domain').create();
/* istanbul ignore next */
d.on('error', (error) => {
    debug(error.message);
    debug(error.stack);
    raygunClient.send(error, {}, () => {
        process.exit();
    });
});
exports.getServer = app_1.getApp.then((app) => {
    return http.createServer(app)
        .listen(config_1.config.get('PORT'));
});
//# sourceMappingURL=index.js.map