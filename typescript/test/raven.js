"use strict";
const raven_1 = require("./../raven");
const config_1 = require("../config");
const expect = require('code').expect;
describe('raven', function () {
    let previousEnvironment = process.env.ENVIRONMENT;
    afterEach((done) => {
        raven_1.clearRaven();
        config_1.config.set('ENVIRONMENT', previousEnvironment);
        done();
    });
    it('should set Raven to mock in local environment', function (done) {
        process.env.ENVIRONMENT = 'local';
        const Raven = raven_1.initialiseRaven({ notRaven: true });
        expect(Raven.notRaven).to.be.undefined();
        done();
    });
    it('should set Raven to the correct object in staging', function (done) {
        config_1.config.set('ENVIRONMENT', 'staging');
        let Raven = raven_1.initialiseRaven({
            captureException: () => { },
            config: () => {
                return {
                    install: () => { }
                };
            }
        });
        expect(Raven.captureException).to.be.a.function();
        done();
    });
    it('should set Raven to the correct object in production', function (done) {
        config_1.config.set('ENVIRONMENT', 'production');
        let Raven = raven_1.initialiseRaven({
            captureException: () => { },
            config: () => {
                return {
                    install: () => { }
                };
            }
        });
        expect(Raven.captureException).to.be.a.function();
        done();
    });
});
//# sourceMappingURL=raven.js.map