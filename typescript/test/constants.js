const expect = require('code').expect;
describe('constants', function () {
    it('should expose the correct values', function () {
        const constants = require('../constants');
        expect(constants.FORGOT_PASSWORD_TOKEN_EXPIRY).to.not.be.undefined();
    });
});
//# sourceMappingURL=constants.js.map