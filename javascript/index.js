/// <reference path="../index.d.ts" />
"use strict";
var config = require('./config.js');
var http = require('http');
process.on('uncaughtException', function (error) {
    console.error('uncaughtException:', error.message);
    console.error(error.stack);
    process.exit(1);
});
module.exports = require('./app.js')
    .then(function (app) {
    return http.createServer(app)
        .listen(config.get('PORT'));
});
//# sourceMappingURL=index.js.map