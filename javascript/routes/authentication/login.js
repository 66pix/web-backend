/// <reference path="../../../index.d.ts" />
var jwt = require('jsonwebtoken');
var debug = require('debug')('authentication/login');
var config = require('../../config.js');
var Promise = require('bluebird');
module.exports = function (app) {
    require('@66pix/models').then(function (models) {
        app.post('/authentication/login', function (req, res) {
            if (bodyIsValid(req.body)) {
                return res.status(401)
                    .json({
                    code: 401,
                    message: 'Invalid email or password'
                });
            }
            var UserAccount = models.UserAccount;
            var Token = models.Token;
            // Query for pending user, if found set password and continue
            // If not found, continue with normal login attempt
            UserAccount.findOne({
                where: {
                    email: req.body.email,
                    status: 'Pending'
                }
            })
                .then(function (pendingUser) {
                if (pendingUser) {
                    pendingUser.password = req.body.password;
                    pendingUser.status = 'Active';
                    return pendingUser.save();
                }
                return null;
            })
                .then(function () {
                return UserAccount.login(req.body.email, req.body.password);
            })
                .then(function (user) {
                return Promise.props({
                    user: user,
                    token: Token.build({
                        userId: user.id,
                        userAgent: req.headers['user-agent'],
                        type: 'Login',
                        isRevoked: false,
                        payload: '',
                        updatedWithToken: -1
                    })
                        .save()
                });
            })
                .then(function (result) {
                var EXPIRES_IN_HOURS = 5;
                var jwtToken = jwt.sign({
                    id: result.user.id,
                    tokenId: result.token.id
                }, config.get('TOKEN_SECRET'), {
                    expiresIn: EXPIRES_IN_HOURS + 'h',
                    issuer: '66pix Website',
                    audience: '66pix Website User'
                });
                var expiresOn = new Date();
                result.token.expiresOn = expiresOn.getTime() + EXPIRES_IN_HOURS * 60 * 60 * 1000;
                result.token.updatedWithToken = result.token.id;
                result.token.payload = jwtToken;
                return Promise.props({
                    jwtToken: jwtToken,
                    tokenSave: result.token.save()
                });
            })
                .then(function (result) {
                res.json({
                    token: result.jwtToken
                });
            })
                .catch(function (error) {
                debug(error);
                res.status(error.code)
                    .json({
                    code: error.code,
                    message: error.message
                });
            });
        });
    });
};
function bodyIsValid(body) {
    return !body.email || !body.password;
}
//# sourceMappingURL=login.js.map