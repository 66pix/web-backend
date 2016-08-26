"use strict";
const jwt = require('jsonwebtoken');
const debug = require('debug')('66pix-backend:authentication/login');
const config_1 = require('../../config');
const Bluebird = require('bluebird');
const Joi = require('joi');
const Celebrate = require('celebrate');
function login(app, models) {
    app.post('/authentication/login', Celebrate({
        body: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    }), (req, res) => {
        // Query for pending user, if found set password and continue
        // If not found, continue with normal login attempt
        models.UserAccount.findOne({
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
            return;
        })
            .then(() => models.UserAccount.login(req.body.email, req.body.password))
            .then((user) => {
            return Bluebird.props({
                user: user,
                token: models.Token.build({
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
            }, config_1.config.get('TOKEN_SECRET'), {
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
}
exports.login = login;
;
//# sourceMappingURL=login.js.map