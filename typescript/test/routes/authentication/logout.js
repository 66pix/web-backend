"use strict";
const config_1 = require('../../../config');
const request = require('supertest');
const expect = require('code').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');
const models_1 = require('@66pix/models');
describe('Routes authentication logout', () => {
    let app;
    let jwtToken;
    beforeEach((done) => {
        require('../../loginHelper').loginHelper()
            .then((result) => {
            app = result.app;
            jwtToken = result.token;
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    afterEach((done) => {
        models_1.initialiseModels
            .then((models) => {
            return models.UserAccount.destroy({
                truncate: true,
                cascade: true
            });
        })
            .then(() => {
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    it('should return 204 if the jwt token is invalid', (done) => {
        request(app)
            .post('/authentication/logout')
            .set('authorization', '')
            .expect(204, done);
    });
    it('should send a non JsonWebTokenError down the middleware chain', (done) => {
        sinon.stub(jwt, 'verify', (token, secret, callback) => {
            callback(new Error('This is another error'));
        });
        request(app)
            .post('/authentication/logout')
            .set('authorization', '')
            .expect(500, (error, response) => {
            if (error) {
                return done(error);
            }
            jwt.verify.restore();
            expect(response.body.message).to.equal('This is another error');
            return done();
        });
    });
    it('should return 204 if the jwt token is not present in the database', (done) => {
        let tokenId = jwt.verify(jwtToken.replace('Bearer ', ''), config_1.config.get('TOKEN_SECRET')).tokenId;
        models_1.initialiseModels
            .then((models) => {
            return models.Token.findById(tokenId);
        })
            .then((token) => {
            return token.destroy({
                force: true
            });
        })
            .then(() => {
            request(app)
                .post('/authentication/logout')
                .set('authorization', jwtToken)
                .expect(204, done);
        });
    });
    it('should invalidate the jwt token', (done) => {
        request(app)
            .post('/authentication/logout')
            .set('authorization', jwtToken)
            .expect(204, (error) => {
            if (error) {
                throw error;
            }
            request(app)
                .get('/api/users/current')
                .set('authorization', jwtToken)
                .expect(401, done);
        });
    });
});
//# sourceMappingURL=logout.js.map