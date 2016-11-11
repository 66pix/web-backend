"use strict";
const request = require('supertest');
const R = require('ramda');
const expect = require('code').expect;
const loginHelper_1 = require('../../loginHelper');
describe('Routes Users PUT', () => {
    let app;
    let user;
    let token;
    let UserAccount;
    beforeEach((done) => {
        loginHelper_1.loginHelper()
            .then((result) => {
            UserAccount = result.models.UserAccount;
            user = result.user;
            app = result.app;
            token = result.token;
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    afterEach((done) => {
        UserAccount.destroy({
            truncate: true,
            cascade: true
        })
            .then(() => {
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    it('should respond with a 200 and the updated user', (done) => {
        request(app)
            .put('/api/users/' + user.id)
            .send({
            id: user.id,
            email: 'active@66pix.com',
            password: 'ASDF1234',
            name: 'Updated Name'
        })
            .set('authorization', token)
            .expect(200, (error, response) => {
            expect(response.body).to.contain({
                email: 'active@66pix.com',
                name: 'Updated Name',
                id: user.id
            });
            done();
        });
    });
    it('should not change the password even if a different password was sent', (done) => {
        request(app)
            .put('/api/users/' + user.id)
            .send({
            id: user.id,
            email: user.email,
            password: 'new password',
            name: user.name
        })
            .set('authorization', token)
            .expect(200, () => {
            UserAccount.findById(user.id)
                .then(() => {
                done();
            });
        });
    });
});
//# sourceMappingURL=put.js.map