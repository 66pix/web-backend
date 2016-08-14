/// <reference path="../typings/index.d.ts" />
"use strict";
let config = require('./config.js');
const express = require('express');
let expressJwt = require('express-jwt');
let bodyparser = require('body-parser');
let debug = require('debug')('backend');
let Promise = require('bluebird');
let isRevoked = require('./isRevoked.js');
const raygun_1 = require('./raygun');
let raygun = require('raygun');
const raygunClient = raygun_1.raygunClientFactory(raygun);
let app = express();
app.use(bodyparser.json());
app.use(['/api'], expressJwt({
    secret: config.get('TOKEN_SECRET'),
    isRevoked: isRevoked
}));
require('./routes/authentication/login.js')(app);
require('./routes/authentication/logout.js')(app);
require('./routes/authentication/forgot-password.js')(app);
require('./routes/authentication/reset-password.js')(app);
module.exports = new Promise(function (resolve) {
    require('@66pix/api')(app)
        .then(function () {
        app.use(unauthorisedErrorHandler);
        app.use(raygunClient.expressHandler);
        app.use(catchAllErrorHandler);
        resolve(app);
    });
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
process.on('unhandledRejection', function (error) {
    raygunClient.send(error);
});
//# sourceMappingURL=app.js.map