const { expect } = require('chai');
const { coroutine: async } = require('bluebird');
const sinon = require('sinon');

const makeCreateMongoClient = require('../createMongoClient');

describe('createMongoClient', () => {
  const connectionUri = 'mongo_connectionUri';
  const dbName = 'mongo_dbname';
  const connectCallResult = 'expectedMongoClient';

  let createMongoClient;
  let result;

  beforeEach(async(function* beforeEachHandler() {
    const uuidv4 = sinon.stub().returns(dbName);

    const MongoClient = sinon.stub().returns({
      connect: sinon.stub().withArgs({ connectionUri }).resolves('expectedMongoClient'),
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
