const { expect } = require('chai');
const { coroutine: async } = require('bluebird');
const sinon = require('sinon');
const makeStartMongod = require('../startMongod');
const makeCreateMongoClient = require('../createMongoClient');


describe('startMongod', () => {
  [
    {
      description: 'with defaults',
      options: {},
    },
    {
      description: 'with custom options',
      options: {
        port: 51678,
        host: '127.0.0.1',
      },
    },
  ].forEach(({ description, options: { port, host } }) => {
    context(description, () => {
      const tmpDirName = '/tmp/random';
      const expectedPort = port || 27017;
      const expectedHost = host || '0.0.0.0';

      let startMongod;
      let response;

      beforeEach(async(function* beforeEachHandler() {
        const getPort = sinon.stub();

        getPort.rejects('getPort() called with incorrect arguments.');

        getPort.withArgs({
          host: expectedHost,
          port: expectedPort,
        })
          .resolves(expectedPort);


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

        response = yield startMongod({ port, host });
      }));

      it('should have a correct response', () => {
        expect(response).to.deep.equal({
          connectionUri: `mongodb://${expectedHost}:${expectedPort}`,
          port: expectedPort,
        });
      });
    });
  });
});

describe('createMongoClient', () => {
  const connectionUri = 'mongo_connectionUri';
  const dbName = 'mongo_dbname';
  const connectCallResult = 'expectedMongoClient';

  let createMongoClient;
  let result;

  beforeEach(async(function* beforeEachHandler() {
    const uuidv4 = sinon.stub().returns(dbName);

    const connectStub = sinon.stub();

    connectStub
      .rejects('MongoClient.connect() called with wrong parameters.');

    connectStub
      .withArgs(`${connectionUri}/test-db-${dbName}`)
      .resolves(connectCallResult);

    const MongoClient = sinon.stub().returns({
      connect: connectStub,
    });
    createMongoClient = makeCreateMongoClient({ uuidv4, MongoClient });

    result = yield createMongoClient({ connectionUri });
  }));

  it('should return a mongoClient connection', () => {
    expect(result).to.deep.equal({
      mongoDbUri: `${connectionUri}/test-db-${dbName}`,
      mongoClient: connectCallResult,
    });
  });
});
