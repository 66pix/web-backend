/// <reference path="../../../../typings/index.d.ts" />
"use strict";
var request = require('supertest');
var expect = require('code').expect;
var Plan = require('test-plan');
var app;
var UserAccount;
describe('Routes authentication login', function () {
    beforeEach(function (done) {
        require('../../loginHelper')()
            .then(function (result) {
            app = result.app;
            return require('@66pix/models');
        })
            .then(function (models) {
            UserAccount = models.UserAccount;
            done();
        });
    });
    afterEach(function (done) {
        return UserAccount.destroy({
            force: true,
            truncate: true,
            cascade: true
        })
            .then(function () {
            done();
            return null;
        })
            .catch(function (error) {
            throw error;
        });
    });
    it('should reject invalid login attempts', function (done) {
        var plan = new Plan(2, done);
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
            var jwtToken = JSON.parse(response.text);
            expect(jwtToken.token).to.exist();
            done();
        });
    });
    it('should set the given password on a pending user then log them in', function (done) {
        var pendingUserEmail = 'pending@66pix.com';
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
                var jwtToken = JSON.parse(response.text);
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