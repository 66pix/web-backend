"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        const result = yield require('../../loginHelper').loginHelper();
        Company = result.models.Company;
        user = result.user;
        app = result.app;
        token = result.token;
        UserAccount = result.models.UserAccount;
        secondUser = yield UserAccount.build({
            name: 'second user',
            email: 'second_user@66pix.com',
            updatedWithToken: -1,
            status: 'Active'
        })
            .save();
    }));
    afterEach(() => __awaiter(this, void 0, void 0, function* () {
        yield Bluebird.all([
            UserAccount,
            Company
        ].map((model) => {
            return model.destroy({
                truncate: true,
                cascade: true
            });
        }));
    }));
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
                userId: userCompany.userAccountId,
                companyId: userCompany.companyId,
                responsibility: 'Editor',
                isSelected: false
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