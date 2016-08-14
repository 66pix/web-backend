/// <reference path="../../typings/index.d.ts" />
"use strict";
const raygun_1 = require('./../raygun');
let sinon = require('sinon');
let expect = require('code').expect;
describe('raygun', function () {
    it('should set raygunClient to offline in development', function (done) {
        let called = false;
        // tslint:disable
        class Client {
            // tslint:enable
            constructor() {
                return this;
            }
            init() {
                return this;
            }
            setTags() { }
            ;
            user() { }
            ;
            offline() {
                called = true;
            }
            ;
        }
        const raygun = {
            Client: Client
        };
        raygun_1.raygunClientFactory(raygun);
        expect(called).to.equal(true);
        done();
    });
});
//# sourceMappingURL=raygun.js.map