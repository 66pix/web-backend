"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const debug = require('debug')('66pix-backend:authentication/forgot-password');
const jwt = require("jsonwebtoken");
const path = require("path");
const Bluebird = require("bluebird");
const nunjucks = require("nunjucks");
function forgotPassword(app, models) {
    function responseSuccess(res) {
        res.status(200)
            .json({
            message: 'Please check your email'
        });
    }
    app.post('/authentication/forgot-password', (req, res) => {
        if (!req.body.email) {
            debug('Login attempt without an email address');
            return res.status(400)
                .json({
                code: 400,
                message: 'Email is required'
            });
        }
        return models.UserAccount.findOne({
            where: {
                email: req.body.email
            }
        })
            .then((user) => {
            if (!user) {
                responseSuccess(res);
                return Bluebird.reject(new Error('User not found'));
            }
            return [
                user,
                models.Token.build({
                    userAccountId: user.id,
                    userAgent: req.headers['user-agent'],
                    type: 'Reset Password',
                    isRevoked: false,
                    payload: '',
                    updatedWithToken: -1
                })
                    .save()
            ];
        })
            .spread((user, token) => {
            let jwtToken = jwt.sign({
                id: user.id,
                tokenId: token.id
            }, config_1.config.get('RESET_PASSWORD_TOKEN_SECRET'), {
                expiresIn: '1h',
                issuer: '66pix Website',
                audience: '66pix Website User'
            });
            let expiresOn = new Date();
            token.expiresOn = expiresOn.getTime() + 1 * 60 * 60 * 1000;
            token.updatedWithToken = token.id;
            token.payload = jwtToken;
            return [
                user,
                jwtToken,
                token.save()
            ];
        })
            .spread((user, jwtToken) => {
            debug('Emailing reset password link to %s', user.email);
            let subject = '66pix Password Reset';
            let nunjucksContent = {
                subject: subject,
                token: jwtToken,
                baseUrl: config_1.config.get('BASE_URL')
            };
            require('@66pix/email').default({
                to: user.get('email'),
                subject: subject,
                content: {
                    html: nunjucks.render(path.join(__dirname, '../../../email/forgot-password/html.nunjucks'), nunjucksContent),
                    text: nunjucks.render(path.join(__dirname, '../../../email/forgot-password/text.nunjucks'), nunjucksContent),
                    user: {
                        email: user.get('email'),
                        name: user.get('name')
                    }
                }
            })
                .then(() => {
                responseSuccess(res);
                return null;
            })
                .catch((error) => {
                debug(error);
                res.status(500)
                    .json({
                    message: error.message
                });
            });
            return null;
        })
            .catch((error) => {
            if (error.message === 'User not found') {
                return debug('User not found with email: ' + req.body.email);
            }
            throw error;
        });
    });
}
exports.forgotPassword = forgotPassword;
//# sourceMappingURL=forgot-password.js.map