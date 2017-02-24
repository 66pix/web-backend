"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expect = require('code').expect;
const index_1 = require("../index");
describe('index', () => {
    it('should create a valid server', (done) => {
        index_1.getServer.then((server) => {
            expect(server).to.not.be.undefined();
            expect(server.close).to.not.be.undefined();
            server.close();
            done();
        });
    });
});
//# sourceMappingURL=index.js.map