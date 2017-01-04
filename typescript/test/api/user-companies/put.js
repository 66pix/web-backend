"use strict";
const expect = require('code').expect;
const request = require("supertest");
const Bluebird = require("bluebird");
describe('Routes User Companies put', () => {
    let app;
    let token;
    let user;
    let secondUser;
    let Company;
    let UserAccount;
    beforeEach((done) => {
        require('../../loginHelper').loginHelper()
            .then((result) => {
            Company = result.models.Company;
            user = result.user;
            app = result.app;
            token = result.token;
            UserAccount = result.models.UserAccount;
            return UserAccount.build({
                name: 'second user',
                email: 'second_user@66pix.com',
                updatedWithToken: -1,
                status: 'Active'
            })
                .save();
        })
            .then((_secondUser_) => {
            secondUser = _secondUser_;
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    afterEach((done) => {
        Bluebird.all([
            UserAccount,
            Company
        ].map((model) => {
            return model.destroy({
                truncate: true,
                cascade: true
            });
        }))
            .then(() => {
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    it('should allow updating the responsibility of a userCompany', (done) => {
        let company;
        Company.build({
            name: 'company name',
            updatedWithToken: -1,
            type: 'Retail',
            status: 'Active'
        })
            .save()
            .then((_company_) => {
            company = _company_;
            return user.addCompany(company, {
                responsibility: 'Owner',
                updatedWithToken: -1,
                isSelected: true
            });
        })
            .then(() => {
            return secondUser.addCompany(company, {
                responsibility: 'Owner',
                updatedWithToken: -1,
                isSelected: true
            });
        })
            .then(() => {
            return user.reload({
                include: {
                    all: true
                }
            });
        })
            .then((_user_) => {
            user = _user_;
            let userCompany = user.get('companies')[0].user_account_company;
            request(app)
                .put('/api/user-companies/' + userCompany.id)
                .set('authorization', token)
                .send({
                userId: userCompany.userId,
                companyId: userCompany.companyId,
                responsibility: 'Editor'
            })
                .expect((response) => {
                let updatedUserCompany = response.body;
                expect(updatedUserCompany.responsibility).to.equal('Editor');
            })
                .expect(200, done);
            return null;
        });
    });
});
//# sourceMappingURL=put.js.map