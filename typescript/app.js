"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@66pix/api");
const models_1 = require("@66pix/models");
const cors = require("cors");
const express = require("express");
const config_js_1 = require("./config.js");
const isRevoked_1 = require("./isRevoked");
const raven_1 = require("./raven");
const forgot_password_1 = require("./routes/authentication/forgot-password");
const login_1 = require("./routes/authentication/login");
const logout_1 = require("./routes/authentication/logout");
const reset_password_1 = require("./routes/authentication/reset-password");
const expressJwt = require("express-jwt");
const bodyparser = require("body-parser");
const debug = require('debug')('66pix-backend:app');
const Raven = raven_1.initialiseRaven(require('raven'));
let app = express();
const corsOptions = {
    origin: config_js_1.config.get('CORS_URLS').split(',')
};
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(bodyparser.json());
app.disable('x-powered-by');
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'max-age=0');
    next();
});
app.use('/api', expressJwt({
    secret: config_js_1.config.get('TOKEN_SECRET'),
    isRevoked: isRevoked_1.isRevoked
}));
exports.getApp = models_1.initialiseModels
    .then((models) => {
    login_1.login(app, models);
    logout_1.logout(app, models);
    forgot_password_1.forgotPassword(app, models);
    reset_password_1.resetPassword(app, models);
    return api_1.api(app);
})
    .then(() => {
    app.use(unauthorisedErrorHandler);
    app.use(Raven.errorHandler());
    app.use(catchAllErrorHandler);
    return app;
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
    debug(error);
    debug('Reporting catchAllErrorHandler');
    Raven.captureException(error, () => {
        res.status(code);
        debug('Reported catchAllErrorHandler');
        res.json({
            message: error.message,
            trackingId: res.sentry
        });
    });
}
//# sourceMappingURL=app.js.map