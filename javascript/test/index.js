'use strict';
var expect = require('code').expect;
describe('index', function () {
    it('should create a valid server', function (done) {
        require('../index').then(function (server) {
            expect(server).to.not.be.undefined();
            expect(server.close).to.not.be.undefined();
            server.close();
            done();
        });
    });
});
//# sourceMappingURL=index.js.map