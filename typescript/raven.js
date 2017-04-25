"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const R = require("ramda");
let Raven;
function clearRaven() {
    Raven = null;
}
exports.clearRaven = clearRaven;
function initialiseRaven(_Raven_) {
    if (Raven) {
        return Raven;
    }
    if (config_1.config.get('ENVIRONMENT') === 'local') {
        Raven = {
            captureException: (error, callback) => callback(),
            errorHandler: R.identity
        };
        return Raven;
    }
    Raven = _Raven_;
    Raven.config(config_1.config.get('RAVEN_URL'), {
        release: '%RELEASE_VERSION%',
        environment: config_1.config.get('ENVIRONMENT')
    })
        .install();
    return Raven;
}
exports.initialiseRaven = initialiseRaven;
//# sourceMappingURL=raven.js.map