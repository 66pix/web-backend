const expect = require('code').expect;
import request = require('supertest');
import {initialiseModels} from '@66pix/models';
import {loginHelper} from '../../loginHelper';

describe('Routes Users current', () => {
  let app;
  let token;
  let user;

  beforeEach((done) => {
    loginHelper()
    .then((result: any) => {
      user = result.user;
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

  it('should respond to current with the current user if authorised', (done) => {
    request(app)
      .get('/api/users/current')
      .set('authorization', token)
      .expect((response) => {
        expect(response.body).to.contain({
          email: 'active@66pix.com',
          name: 'this is a name',
          id: user.id
        });
      })
      .expect(200, done);
  });
});
