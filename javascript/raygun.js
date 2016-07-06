/// <reference path="../typings/index.d.ts" />
"use strict";
var path = require('path');
function raygunClientFactory(raygun) {
    var raygunClient = new raygun.Client().init({
        apiKey: 'uRW3z1eB4DCaFppIv8vkvQ==',
        offlineStorageOptions: {
            cachePath: path.join(__dirname, 'raygunCache/'),
            cacheLimit: 0
        }
    });
    raygunClient.setTags([
        process.env.NODE_ENV
    ]);
    raygunClient.user = function (req) {
        if (!req || !req.user) {
            return null;
        }
        return req.user.id;
    };
    if (process.env.NODE_ENV === 'development') {
        raygunClient.offline();
    }
    return raygunClient;
}
exports.raygunClientFactory = raygunClientFactory;
//# sourceMappingURL=raygun.js.map