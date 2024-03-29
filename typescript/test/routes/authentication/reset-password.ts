import {config} from '../../../config'
const expect = require('code').expect
import request = require('supertest')
import jwt = require('jsonwebtoken')
import {getApp} from '../../../app'
import {initialiseModels} from '@66pix/models'

describe('Routes authentication reset-password', () => {
  let app

  beforeEach(async () => {
    app = await getApp
  })

  afterEach(async () => {
    const models = await initialiseModels
    await models.UserAccount.destroy({
      force: true,
      truncate: true,
      cascade: true
    })
  })

  it('should reject requests with an invalid token', (done) => {
    request(app)
    .post('/authentication/reset-password/invalid')
    .expect(400)
    .expect({
      code: 400,
      message: 'Password reset token is invalid or expired, please perform the "forgot password" process again'
    }, done)
  })

  it('should reject requests with a valid token but missing password pair', (done) => {
    let token = jwt.sign({
      id: 1
    }, config.get('RESET_PASSWORD_TOKEN_SECRET'), {
      expiresIn: '1h'
    })

    request(app)
    .post('/authentication/reset-password/' + token)
    .expect(400)
    .expect({
      code: 400,
      message: 'Please provide a new password'
    }, done)
  })

  it('should reject requests with a password pair that does not match', (done) => {
    let token = jwt.sign({
      id: 1
    }, config.get('RESET_PASSWORD_TOKEN_SECRET'), {
      expiresIn: '1h'
    })

    request(app)
    .post('/authentication/reset-password/' + token)
    .send({
      newPassword: 'new password',
      newPasswordRepeat: 'new passsword'
    })
    .expect(400)
    .expect({
      code: 400,
      message: 'You must verify your new password by typing it twice'
    }, done)
  })

  it('should reject requests for users that are not active', (done) => {
    let models
    initialiseModels
    .then((_models_) => {
      models = _models_
      return models.UserAccount.build({
        email: 'inactive@66pix.com',
        status: 'Inactive',
        updatedWithToken: -1,
        name: 'not active'
      })
      .save()
    })
    .then(() => {
      models.UserAccount.findOne({
        where: {
          email: 'inactive@66pix.com'
        }
      }).then((user) => {
        let token = jwt.sign({
          id: user.id
        }, config.get('RESET_PASSWORD_TOKEN_SECRET'), {
          expiresIn: 60 * 60
        })

        let password = 'authentication/reset-password/reset'

        request(app)
        .post('/authentication/reset-password/' + token)
        .send({
          newPassword: password,
          newPasswordRepeat: password
        })
        .expect(400, (
          error,
          response
        ) => {
          expect(response.body).to.equal({
            code: 400,
            message: 'User does not exist or has been deactivated'
          })
          done()
        })
      })
      return null
    })
  })

  it('should reset the correct user\'s password if all token is valid and password pairs match', (done) => {
    let models
    initialiseModels
    .then((_models_) => {
      models = _models_
      return models.UserAccount.build({
        email: 'resetpassword@66pix.com',
        status: 'Active',
        updatedWithToken: -1,
        name: 'not active'
      })
      .save()
    })
    .then(() => {
      models.UserAccount.findOne({
        where: {
          email: 'resetpassword@66pix.com'
        }
      }).then((user) => {
        let token = jwt.sign({
          id: user.id
        }, config.get('RESET_PASSWORD_TOKEN_SECRET'), {
          expiresIn: 60 * 60
        })

        let password = 'authentication/reset-password/reset'

        request(app)
        .post('/authentication/reset-password/' + token)
        .send({
          newPassword: password,
          newPasswordRepeat: password
        })
        .expect(201, () => {
          models.UserAccount.login('resetpassword@66pix.com', password)
          .then(() => {
            done()
          })
          .catch((error) => {
            throw error
          })
        })
      })
      return null
    })
  })
})
