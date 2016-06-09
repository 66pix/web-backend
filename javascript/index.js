/// <reference path="../typings/index.d.ts" />
"use strict";
var http = require('http');
var debugModule = require('debug');
var debug = debugModule('66pix-backend:index');
var config = require('./config');
var raygun_1 = require('./raygun');
var raygun = require('raygun');
var raygunClient = raygun_1.raygunClientFactory(raygun);
var d = require('domain').create();
d.on('error', function (error) {
    debug(error.message);
    debug(error.stack);
    raygunClient.send(error, {}, function () {
        process.exit();
    });
});
module.exports = require('./app')
    .then(function (app) {
    return http.createServer(app)
        .listen(config.get('PORT'));
});
//# sourceMappingURL=index.js.map