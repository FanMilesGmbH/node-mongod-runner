const { expect } = require('chai');
const { coroutine: async } = require('bluebird');
const sinon = require('sinon');
const makeStartMongod = require('../startMongod');

const makeGetPortStub = ({ port, host }) => sinon.stub()
  .withArgs({
    host,
    port,
  })
  .resolves(port);

describe('startMongod', () => {
  context('with defaults', () => {
    const port = 27017;
    const host = '0.0.0.0';
    const tmpDirName = '/tmp/random';

    let startMongod;
    let response;

    beforeEach(async(function* beforeEachHandler() {
      const getPort = makeGetPortStub({
        host,
        port,
      });

      const tmp = {
        dirSync: sinon.stub().returns(tmpDirName),
      };

      const MongodHelper = sinon.stub().withArgs([
        '--storageEngine', 'ephemeralForTest',
        '--dbpath', tmpDirName,
        '--port', port,
      ]).returns({
        run: sinon.stub().resolves(true),
      });

      startMongod = makeStartMongod({ getPort, tmp, MongodHelper });

      response = yield startMongod();
    }));

    it('should have a correct response', () => {
      expect(response).to.deep.equal({
        connectionUri: `mongodb://${host}:${port}`,
        port,
      });
    });
  });

  context('with custom options', () => {
    const port = 51678;
    const host = '127.0.0.1';
    const tmpDirName = '/tmp/random';

    let startMongod;
    let response;

    beforeEach(async(function* beforeEachHandler() {
      const getPort = makeGetPortStub({
        host,
        port,
      });

      const tmp = {
        dirSync: sinon.stub().returns(tmpDirName),
      };

      const MongodHelper = sinon.stub().withArgs([
        '--storageEngine', 'ephemeralForTest',
        '--dbpath', tmpDirName,
        '--bind_ip', host,
        '--port', port,
      ]).returns({
        run: sinon.stub().resolves(true),
      });

      startMongod = makeStartMongod({ getPort, tmp, MongodHelper });

      response = yield startMongod({
        port,
        host,
      });
    }));

    it('should have a correct response', () => {
      expect(response).to.deep.equal({
        connectionUri: `mongodb://${host}:${port}`,
        port,
      });
    });
  });
});
