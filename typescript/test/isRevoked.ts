const expect = require('code').expect
import {isRevoked} from '../isRevoked'
import sinon = require('sinon')
import {initialiseModels} from '@66pix/models'

describe('isRevoked', () => {

  let spy
  beforeEach((done) => {
    spy = sinon.spy()
    done()
  })

  it('should call done with true if the argument is null', (done) => {
    isRevoked(null, null, spy)
    expect(spy.calledWith(null, true)).to.equal(true)
    done()
  })

  it('should call done with true if the iss is not correct', (done) => {
    isRevoked(null, {
      iss: 'not correct'
    }, spy)
    expect(spy.calledWith(null, true)).to.equal(true)
    done()
  })

  it('should call done with true if the aud is not correct', (done) => {
    isRevoked(null, {
      iss: '66pix Website',
      aud: 'not correct'
    }, spy)
    expect(spy.calledWith(null, true)).to.equal(true)
    done()
  })

  it('should call done with true if the token is not present in the database', (done) => {
    let tokenId
    let models
    initialiseModels
    .then((_models_) => {
      models = _models_
      return models.Token.build({
        userAccountId: 1,
        userAgent: 'user agent',
        type: 'Login',
        isRevoked: true,
        payload: '',
        updatedWithToken: -1
      }).save()
    })
    .then((token) => {
      tokenId = token.id
      return models.Token.destroy({
        force: true,
        truncate: true
      })
    })
    .then(() => {
      isRevoked(null, {
        iss: '66pix Website',
        aud: '66pix Website User',
        tokenId: tokenId
      }, (error, revoked) => {
        if (error) {
          throw error
        }
        expect(revoked).to.equal(true)
        done()
      })
      return null
    })
  })

  it('should call done with true if the matching token record isRevoked', (done) => {
    initialiseModels
    .then((models) => {
      return models.Token.build({
        userAccountId: 1,
        userAgent: 'user agent',
        type: 'Login',
        isRevoked: true,
        payload: '',
        updatedWithToken: -1
      }).save()
    })
    .then((token) => {
      isRevoked(null, {
        iss: '66pix Website',
        aud: '66pix Website User',
        tokenId: token.id
      }, (error, revoked) => {
        if (error) {
          throw error
        }
        expect(revoked).to.equal(true)
        done()
      })
      return null
    })
  })

  it('should call done with false if the matching token record is not revoked', (done) => {
    initialiseModels
    .then((models) => {
      return models.Token.build({
        userAccountId: 1,
        userAgent: 'user agent',
        type: 'Login',
        isRevoked: false,
        payload: '',
        updatedWithToken: -1
      }).save()
    })
    .then((token) => {
      isRevoked(null, {
        iss: '66pix Website',
        aud: '66pix Website User',
        tokenId: token.id
      }, (error, revoked) => {
        if (error) {
          throw error
        }
        expect(revoked).to.equal(false)
        done()
      })
      return null
    })
  })
})
