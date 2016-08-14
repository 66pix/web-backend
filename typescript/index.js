"use strict";
const http = require('http');
const debugModule = require('debug');
const debug = debugModule('66pix-backend:index');
const config_1 = require('./config');
const raygun_1 = require('./raygun');
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
module.exports = require('./app')
    .then((app) => {
    return http.createServer(app)
        .listen(config_1.config.get('PORT'));
});
//# sourceMappingURL=index.js.map