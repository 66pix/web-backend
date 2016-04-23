'use strict';

var expect = require('code').expect;
var request = require('supertest');
var Promise = require('bluebird');

describe('Routes Companies current', function() {
  var app;
  var token;

  var user;
  var Company;
  var UserAccount;

  beforeEach(function(done) {
    require('../../loginHelper')()
    .then(function(result) {
      Company = result.models.Company;
      UserAccount = result.models.UserAccount;
      user = result.user;
      app = result.app;
      token = result.token;

      done();
      return null;
    });
  });

  afterEach(function(done) {
    Promise.all([
      Company,
      UserAccount
    ].map(function(model) {
      return model.destroy({
        truncate: true,
        cascade: true
      });
    }))
    .then(function() {
      done();
      return null;
    });
  });

  it('should respond to current with the currently selected company if authorised', function(done) {
    Company.build({
      name: 'company name',
      updatedWithToken: -1,
      type: 'Retail',
      status: 'Active'
    })
    .save()
    .then(function(company) {
      return user.addCompany(company, {
        responsibility: 'Owner',
        updatedWithToken: -1,
        isSelected: true
      });
    })
    .then(function() {
      request(app)
      .get('/api/companies/selected')
      .set('authorization', token)
      .expect(function(response) {
        var company = response.body;
        expect(company).to.deep.contain({
          name: company.name,
          createdAt: company.createdAt
        });
        expect(company.users).to.deep.contain({
          name: user.name
        });
      })
      .expect(200, done);
      return null;
    });
  });
});
