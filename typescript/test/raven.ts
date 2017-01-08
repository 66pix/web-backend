import {initialiseRaven, clearRaven} from '../raven';
import {config} from '../config';
const expect = require('code').expect;

describe('raven', function() {

  let previousEnvironment = process.env.ENVIRONMENT;

  afterEach((done) => {
    clearRaven();
    config.set('ENVIRONMENT', previousEnvironment);

    done();
  });

  it('should set Raven to mock in local environment', function(done) {
    process.env.ENVIRONMENT = 'local';

    const Raven = initialiseRaven({notRaven: true});

    expect(Raven.notRaven).to.be.undefined();
    done();
  });

  it('should set Raven to the correct object in staging', function(done) {

    config.set('ENVIRONMENT', 'staging');

    let Raven = initialiseRaven({
      captureException: () => {},
      config: () => {
        return {
          install: () => {}
        };
      }
    });

    expect(Raven.captureException).to.be.a.function();

    done();
  });

  it('should set Raven to the correct object in production', function(done) {

    config.set('ENVIRONMENT', 'production');

    let Raven = initialiseRaven({
      captureException: () => {},
      config: () => {
        return {
          install: () => {}
        };
      }
    });

    expect(Raven.captureException).to.be.a.function();

    done();
  });
});
