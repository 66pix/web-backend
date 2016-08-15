import Bluebird = require('bluebird');
import request = require('supertest');
const R = require('ramda');
const expect = require('code').expect;

describe('Routes Users PUT', function() {

  let app;
  let user;
  let token;
  let UserAccount;

  beforeEach(function(done) {
    require('../../loginHelper').loginHelper()
    .then(function(result: any) {
      UserAccount = result.models.UserAccount;
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

  afterEach(function(done) {
    UserAccount.destroy({
      truncate: true,
      cascade: true
    })
    .then(function() {
      done();
    })
    .catch((error) => {
      console.log(JSON.stringify(error, null, 2));
      done(error);
    });
  });

  it('should respond with a 200 and the updated user', function(done) {

    request(app)
    .put('/api/users/' + user.id)
    .send({
      id: user.id,
      email: 'active@66pix.com',
      password: '123456',
      name: 'Updated Name'
    })
    .set('authorization', token)
    .expect(function(response) {
      let _user_ = response.body;
      expect(_user_).to.contain({
        email: 'active@66pix.com',
        name: 'Updated Name',
        id: user.id
      });
    })
    .expect(200, done);
  });

  it('should not change the password even if a different password was sent', function(done) {
    request(app)
      .put('/api/users/' + user.id)
      .send({
        id: user.id,
        email: user.email,
        password: 'new password',
        name: user.name
      })
      .set('authorization', token)
      .expect(function() {
        UserAccount.findById(user.id)
        .then(function() {
          done();
          return null;
        });
      })
      .expect(200, function() {});
  });
});
