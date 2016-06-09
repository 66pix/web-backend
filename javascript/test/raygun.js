/// <reference path="../../typings/index.d.ts" />
"use strict";
var raygun_1 = require('./../raygun');
var sinon = require('sinon');
var expect = require('code').expect;
describe('raygun', function () {
    it('should set raygunClient to offline in development', function (done) {
        var called = false;
        // tslint:disable
        var Client = (function () {
            // tslint:enable
            function Client() {
                return this;
            }
            Client.prototype.init = function () {
                return this;
            };
            Client.prototype.setTags = function () { };
            ;
            Client.prototype.user = function () { };
            ;
            Client.prototype.offline = function () {
                called = true;
            };
            ;
            return Client;
        }());
        var raygun = {
            Client: Client
        };
        raygun_1.raygunClientFactory(raygun);
        expect(called).to.equal(true);
        done();
    });
});
//# sourceMappingURL=raygun.js.map