"use strict";
const jwt = require('jsonwebtoken');
const debug = require('debug')('authentication/login');
const config_js_1 = require('../../config.js');
const Bluebird = require('bluebird');
const models_1 = require('@66pix/models');
function login(app) {
    models_1.initialiseModels
        .then((models) => {
        app.post('/authentication/login', (req, res) => {
            if (bodyIsValid(req.body)) {
                return res.status(401)
                    .json({
                    code: 401,
                    message: 'Invalid email or password'
                });
            }
            let UserAccount = models.UserAccount;
            let Token = models.Token;
            // Query for pending user, if found set password and continue
            // If not found, continue with normal login attempt
            UserAccount.findOne({
                where: {
                    email: req.body.email,
                    status: 'Pending'
                }
            })
                .then((pendingUser) => {
                if (pendingUser) {
                    pendingUser.password = req.body.password;
                    pendingUser.status = 'Active';
                    return pendingUser.save();
                }
                return null;
            })
                .then(() => {
                return UserAccount.login(req.body.email, req.body.password);
            })
                .then((user) => {
                return Bluebird.props({
                    user: user,
                    token: Token.build({
                        userAccountId: user.id,
                        userAgent: req.headers['user-agent'],
                        type: 'Login',
                        isRevoked: false,
                        payload: '',
                        updatedWithToken: -1
                    })
                        .save()
                });
            })
                .then((result) => {
                let EXPIRES_IN_HOURS = 5;
                let jwtToken = jwt.sign({
                    id: result.user.id,
                    tokenId: result.token.id
                }, config_js_1.config.get('TOKEN_SECRET'), {
                    expiresIn: EXPIRES_IN_HOURS + 'h',
                    issuer: '66pix Website',
                    audience: '66pix Website User'
                });
                let expiresOn = new Date();
                result.token.expiresOn = expiresOn.getTime() + EXPIRES_IN_HOURS * 60 * 60 * 1000;
                result.token.updatedWithToken = result.token.id;
                result.token.payload = jwtToken;
                return Bluebird.props({
                    jwtToken: jwtToken,
                    tokenSave: result.token.save()
                });
            })
                .then((result) => {
                res.json({
                    token: result.jwtToken
                });
            })
                .catch((error) => {
                debug(error);
                res.status(error.code)
                    .json({
                    code: error.code,
                    message: error.message
                });
            });
        });
    });
}
exports.login = login;
;
function bodyIsValid(body) {
    return !body.email || !body.password;
}
//# sourceMappingURL=login.js.map