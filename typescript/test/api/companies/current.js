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
const loginHelper_1 = require("../../loginHelper");
const R = require("ramda");
describe('Routes Companies current', () => {
    let app;
    let token;
    let user;
    let Company;
    let UserAccount;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        const result = yield loginHelper_1.loginHelper();
        Company = result.models.Company;
        UserAccount = result.models.UserAccount;
        user = result.user;
        app = result.app;
        token = result.token;
    }));
    afterEach((done) => {
        Bluebird.map([
            UserAccount,
            Company
        ], (model) => {
            return model.destroy({
                truncate: true,
                cascade: true
            });
        }, {
            concurrency: 1
        })
            .then(() => {
            done();
        })
            .catch((error) => {
            console.log(JSON.stringify(error, null, 2));
            done(error);
        });
    });
    it('should respond to current with the currently selected company if authorised', (done) => {
        Company.build({
            name: 'company name',
            updatedWithToken: -1,
            status: 'Active'
        })
            .save()
            .then((company) => {
            return user.addCompany(company, {
                responsibility: 'Owner',
                updatedWithToken: -1,
                isSelected: true
            });
        })
            .then(() => {
            request(app)
                .get('/api/companies/selected')
                .set('authorization', token)
                .expect((response) => {
                let company = response.body;
                expect(company).to.contain({
                    name: company.name,
                    createdAt: company.createdAt
                });
                expect(R.prop('name', R.head(company.users))).to.equal(user.name);
            })
                .expect(200, done);
        });
    });
});
//# sourceMappingURL=current.js.map