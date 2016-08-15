"use strict";
const request = require('supertest');
const expect = require('code').expect;
const Plan = require('test-plan');
const models_1 = require('@66pix/models');
describe('Routes authentication login', function () {
    let app;
    let UserAccount;
    beforeEach(function (done) {
        require('../../loginHelper').loginHelper()
            .then(function (result) {
            app = result.app;
            return models_1.initialiseModels;
        })
            .then(function (models) {
            UserAccount = models.UserAccount;
            done();
        })
            .catch(function (error) {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    afterEach(function (done) {
        UserAccount.destroy({
            truncate: true,
            cascade: true
        })
            .then(function () {
            done();
        })
            .catch(function (error) {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    it('should reject invalid login attempts', function (done) {
        let plan = new Plan(2, done);
        request(app)
            .post('/authentication/login')
            .expect(401)
            .expect({
            code: 401,
            message: 'Invalid email or password'
        }, function () {
            plan.ok(true);
        });
        request(app)
            .post('/authentication/login')
            .send({
            email: 'inactive@66pix.com',
            password: 'invalid password'
        })
            .expect(401)
            .expect({
            code: 401,
            message: 'Invalid email or password'
        }, function () {
            plan.ok(true);
        });
    });
    it('should return a JWT token', function (done) {
        request(app)
            .post('/authentication/login')
            .send({
            email: 'active@66pix.com',
            password: '12345'
        })
            .expect(200)
            .end(function (error, response) {
            if (error) {
                throw error;
            }
            let jwtToken = JSON.parse(response.text);
            expect(jwtToken.token).to.exist();
            done();
        });
    });
    it('should set the given password on a pending user then log them in', function (done) {
        const pendingUserEmail = 'pending@66pix.com';
        UserAccount.build({
            name: 'Pending User',
            status: 'Pending',
            email: pendingUserEmail,
            updatedWithToken: -1
        })
            .save()
            .then(function () {
            request(app)
                .post('/authentication/login')
                .send({
                email: pendingUserEmail,
                password: '12345'
            })
                .expect(200)
                .end(function (error, response) {
                if (error) {
                    throw error;
                }
                let jwtToken = JSON.parse(response.text);
                expect(jwtToken.token).to.exist();
                UserAccount.findOne({
                    where: {
                        email: pendingUserEmail,
                        status: 'Active'
                    }
                })
                    .then(function (pendingUser) {
                    expect(pendingUser.status, 'Pending user status should now be Active').to.equal('Active');
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=login.js.map