"use strict";
const config_js_1 = require('../../config.js');
const jwt = require('jsonwebtoken');
const debug = require('debug')('authentication/logout');
const models_1 = require('@66pix/models');
function logout(app) {
    models_1.initialiseModels
        .then((models) => {
        app.post('/authentication/logout', (req, res, next) => {
            jwt.verify(req.headers.authorization.replace('Bearer ', ''), config_js_1.config.get('TOKEN_SECRET'), (error, jwtToken) => {
                if (error) {
                    return handleError(error, res, next);
                }
                return models.Token.findById(jwtToken.tokenId)
                    .then((token) => {
                    if (!token) {
                        debug('Logout called with a token not represented in DB');
                        return res.sendStatus(204);
                    }
                    token.isRevoked = true;
                    token.save()
                        .then(() => {
                        res.sendStatus(204);
                        return null;
                    });
                    return null;
                });
            });
        });
        return null;
    });
}
exports.logout = logout;
;
function handleError(error, res, next) {
    if (error.name === 'JsonWebTokenError') {
        debug('Logout called with an invalid JWT token');
        return res.sendStatus(204);
    }
    if (error.name === 'TokenExpiredError') {
        debug('Logout called with an expired JWT token');
        return res.sendStatus(204);
    }
    return next(error);
}
//# sourceMappingURL=logout.js.map