'use strict';
var expect = require('code').expect;
var request = require('supertest');
describe('Routes User Companies put', function () {
    var app;
    var token;
    var user;
    var secondUser;
    var Company;
    beforeEach(function (done) {
        require('../../loginHelper')()
            .then(function (result) {
            Company = result.models.Company;
            user = result.user;
            app = result.app;
            token = result.token;
            return result.models.UserAccount.build({
                name: 'second user',
                email: 'second_user@66pix.com',
                updatedWithToken: -1,
                status: 'Active'
            })
                .save();
        })
            .then(function (_secondUser_) {
            secondUser = _secondUser_;
            done();
            return null;
        });
    });
    afterEach(function (done) {
        require('@66pix/models')
            .then(function (models) {
            return models.UserAccount.destroy({
                force: true,
                truncate: true,
                cascade: true
            });
        })
            .then(function () {
            return Company.destroy({
                force: true,
                truncate: true,
                cascade: true
            });
        })
            .then(function () {
            done();
            return null;
        })
            .catch(function (error) {
            throw error;
        });
    });
    it('should allow updating the responsibility of a userCompany', function (done) {
        var company;
        Company.build({
            name: 'company name',
            updatedWithToken: -1,
            type: 'Retail',
            status: 'Active'
        })
            .save()
            .then(function (_company_) {
            company = _company_;
            return user.addCompany(company, {
                responsibility: 'Owner',
                updatedWithToken: -1,
                isSelected: true
            });
        })
            .then(function () {
            return secondUser.addCompany(company, {
                responsibility: 'Owner',
                updatedWithToken: -1,
                isSelected: true
            });
        })
            .then(function () {
            return user.reload({
                include: {
                    all: true
                }
            });
        })
            .then(function (_user_) {
            user = _user_;
            var userCompany = user.get('companies')[0].user_account_company;
            request(app)
                .put('/api/user-companies/' + userCompany.id)
                .set('authorization', token)
                .send({
                userId: userCompany.userId,
                companyId: userCompany.companyId,
                responsibility: 'Editor'
            })
                .expect(function (response) {
                var updatedUserCompany = response.body;
                expect(updatedUserCompany.responsibility).to.equal('Editor');
            })
                .expect(200, done);
            return null;
        });
    });
});
//# sourceMappingURL=put.js.map