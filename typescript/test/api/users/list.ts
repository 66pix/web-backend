const expect = require('code').expect;
import request = require('supertest');
import {initialiseModels} from '@66pix/models';
import {loginHelper} from '../../loginHelper';

describe('Routes Users GET', () => {
  let app;
  let token;

  beforeEach((done) => {
    loginHelper()
    .then((result: any) => {
      app = result.app;
      token = result.token;

      done();
    })
    .catch((error) => {
      console.log(JSON.stringify(error, null, 2));
      done(error);
    });
  });

  afterEach((done) => {
    initialiseModels
    .then((models) => {
      return models.UserAccount.destroy({
        truncate: true,
        cascade: true
      });
    })
    .then(() => {
      done();
    })
    .catch((error) => {
      console.log(JSON.stringify(error, null, 2));
      done(error);
    });
  });

  it('should respond with an array', (done) => {
    request(app)
      .get('/api/users?email=test')
      .set('authorization', token)
      .set('content-type', 'application/json')
      .expect((response) => {
        expect(response.body).to.be.instanceof(Array);
      })
      .expect(200, done);
  });
});
