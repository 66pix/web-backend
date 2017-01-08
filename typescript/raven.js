"use strict";
const config_1 = require("./config");
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
            captureException: (error, callback) => callback()
        };
        return Raven;
    }
    Raven = _Raven_;
    Raven.config(config_1.config.get('RAVEN_URL'), {
        release: '%RELEASE_VERSION%',
        environment: config_1.config.get('NODE_ENV')
    })
        .install();
    return Raven;
}
exports.initialiseRaven = initialiseRaven;
//# sourceMappingURL=raven.js.map