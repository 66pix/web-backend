import request = require('supertest')
import {getApp} from '../app'
import {config} from '../config'
import * as R from 'ramda'
const expect = require('code').expect

describe('App', function() {

  let app
  beforeEach(function(done) {
    getApp.then(function(_app_) {
      app = _app_
      done()
    })
    .catch((error) => {
      console.log(JSON.stringify(error, null, 2))
      done(error)
    })
  })

  it('should protect all /api routes', function(done) {
    request(app)
      .get('/api/users/current')
      .expect(401, done)
  })

  it('should respond correctly to OPTIONS requests', (done) => {
    request(app)
    .options('/authentication/login')
    .set('Access-Control-Request-Method', 'POST')
    .expect(204, (error, response) => {
      expect(response.headers['access-control-allow-methods']).to.equal('GET,HEAD,PUT,PATCH,POST,DELETE')
      done()
    })
  })

  it('should allow CORS requests from the configured origin', (done) => {
    request(app)
    .post('/authentication/login')
    .send({
      email: 'test@66pix.com',
      password: 'alskdfdsj'
    })
    .set({
      'Origin': R.head(config.get('CORS_URLS').split(','))
    })
    .expect(401, done)
  })

})
