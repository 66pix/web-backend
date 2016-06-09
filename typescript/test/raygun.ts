/// <reference path="../../typings/index.d.ts" />

import {raygunClientFactory} from './../raygun';
let sinon = require('sinon');
let expect = require('code').expect;

describe('raygun', function() {

  it('should set raygunClient to offline in development', function(done) {
    let called = false;

    // tslint:disable
    class Client {
      // tslint:enable
      constructor() {
        return this;
      }

      init() {
        return this;
      }
      setTags() {};
      user() {};
      offline() {
        called = true;
      };
    }

    const raygun = {
      Client: Client
    };

    raygunClientFactory(raygun);

    expect(called).to.equal(true);
    done();
  });
});
