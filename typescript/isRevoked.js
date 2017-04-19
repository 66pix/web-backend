"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@66pix/models");
function isRevoked(request, payload, done) {
    if (!payload) {
        return done(null, true);
    }
    if (payload.iss !== '66pix Website') {
        return done(null, true);
    }
    if (payload.aud !== '66pix Website User') {
        return done(null, true);
    }
    return models_1.initialiseModels
        .then((models) => {
        return models.Token.findById(payload.tokenId);
    })
        .then((token) => {
        if (!token) {
            return done(null, true);
        }
        done(null, token.isRevoked);
        return null;
    });
}
exports.isRevoked = isRevoked;
//# sourceMappingURL=isRevoked.js.map