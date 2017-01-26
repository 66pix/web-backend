const expect = require('code').expect
import request = require('supertest')
import Bluebird = require('bluebird')
import {loginHelper} from '../../loginHelper'
import * as R from 'ramda'

describe('Routes Companies current', () => {
  let app
  let token

  let user
  let Company
  let UserAccount

  beforeEach((done) => {
    loginHelper()
    .then((result: any) => {
      Company = result.models.Company
      UserAccount = result.models.UserAccount
      user = result.user
      app = result.app
      token = result.token
      done()
    })
    .catch((error) => {
      console.log(JSON.stringify(error, null, 2))
      done(error)
    })
  })

  afterEach((done) => {
    Bluebird.map([
      UserAccount,
      Company
    ], (model) => {
      return model.destroy({
        truncate: true,
        cascade: true
      })
    }, {
      concurrency: 1
    })
    .then(() => {
      done()
    })
    .catch((error) => {
      console.log(JSON.stringify(error, null, 2))
      done(error)
    })
  })

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
      })
    })
    .then(() => {
      request(app)
      .get('/api/companies/selected')
      .set('authorization', token)
      .expect((response) => {
        let company = response.body
        expect(company).to.contain({
          name: company.name,
          createdAt: company.createdAt
        })
        expect(R.prop('name', R.head(company.users))).to.equal(user.name)
      })
      .expect(200, done)
      return null
    })
  })
})
