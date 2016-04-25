/// <reference path="../index.d.ts" />
"use strict";
var config = require('./config.js');
var express = require('express');
var expressJwt = require('express-jwt');
var bodyparser = require('body-parser');
var debug = require('debug')('backend');
var Promise = require('bluebird');
var isRevoked = require('./isRevoked.js');
var app = express();
app.use(bodyparser.json());
app.use(['/api', '/upload'], expressJwt({
    secret: config.get('TOKEN_SECRET'),
    isRevoked: isRevoked
}));
require('./routes/authentication/login.js')(app);
require('./routes/authentication/logout.js')(app);
require('./routes/authentication/forgot-password.js')(app);
require('./routes/authentication/reset-password.js')(app);
require('./routes/upload/signing.js')(app);
module.exports = new Promise(function (resolve) {
    require('@66pix/api')(app)
        .then(function () {
        app.use(unauthorisedErrorHandler);
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
    var code = 500;
    if (error.code) {
        code = error.code;
    }
    debug(error);
    res.status(code);
    res.json({
        message: error.message
    });
}
//# sourceMappingURL=app.js.map