'use strict';

var expect = require('code').expect;
var request = require('supertest');

describe('Routes Companies current', function() {
  var app;
  var token;

  var user;
  var Company;

  beforeEach(function(done) {
    require('../../loginHelper.js')()
    .then(function(result) {
      Company = result.models.Company;
      user = result.user;
      app = result.app;
      token = result.token;

      done();
      return null;
    });
  });

  afterEach(function(done) {
    require('@66pix/models')
    .then(function(models) {
      return models.UserAccount.destroy({
        force: true,
        truncate: true,
        cascade: true
      });
    })
    .then(function() {
      return Company.destroy({
        force: true,
        truncate: true,
        cascade: true
      });
    })
    .then(function() {
      done();
      return null;
    })
    .catch(function(error) {
      throw error;
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
