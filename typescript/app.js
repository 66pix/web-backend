"use strict";
const config_js_1 = require('./config.js');
const express = require('express');
const expressJwt = require('express-jwt');
const bodyparser = require('body-parser');
const debug = require('debug')('backend');
const isRevoked_1 = require('./isRevoked');
const api_1 = require('@66pix/api');
const login_1 = require('./routes/authentication/login');
const logout_1 = require('./routes/authentication/logout');
const forgot_password_1 = require('./routes/authentication/forgot-password');
const reset_password_1 = require('./routes/authentication/reset-password');
const raygun_1 = require('./raygun');
let raygun = require('raygun');
const raygunClient = raygun_1.raygunClientFactory(raygun);
let app = express();
app.use(bodyparser.json());
app.use(['/api'], expressJwt({
    secret: config_js_1.config.get('TOKEN_SECRET'),
    isRevoked: isRevoked_1.isRevoked
}));
login_1.login(app);
logout_1.logout(app);
forgot_password_1.forgotPassword(app);
reset_password_1.resetPassword(app);
exports.getApp = api_1.api(app)
    .then((_app) => {
    console.log('GOT APP');
    app.use(unauthorisedErrorHandler);
    app.use(raygunClient.expressHandler);
    app.use(catchAllErrorHandler);
    return _app;
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
process.on('unhandledRejection', (error) => {
    raygunClient.send(error);
});
//# sourceMappingURL=app.js.map