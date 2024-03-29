"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expect = require('code').expect;
const fs = require("fs");
const path = require("path");
describe('Package.json', function () {
    let packageJson;
    beforeEach(function (done) {
        fs.readFile(path.join(__dirname, '../../package.json'), 'utf8', function (error, file) {
            if (error) {
                return done(error);
            }
            packageJson = JSON.parse(file);
            return done();
        });
    });
    it('should specify private: true', function () {
        expect(packageJson.private).to.equal(true);
    });
    it('should specify license: UNLICENSED', function () {
        expect(packageJson.license).to.equal('UNLICENSED');
    });
});
//# sourceMappingURL=package.json.js.map