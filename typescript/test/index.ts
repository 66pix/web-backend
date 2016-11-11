const expect = require('code').expect;
import {getServer} from '../index';

describe('index', () => {

  it('should create a valid server', (done) => {
    getServer.then((server) => {
      expect(server).to.not.be.undefined();
      expect(server.close).to.not.be.undefined();
      server.close();
      done();
    });
  });
});
