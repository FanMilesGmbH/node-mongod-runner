const Promise = require('bluebird');
const uuidv4 = require('uuid/v4');
const MongoClient = require('mongodb').MongoClient;
const getPort = require('get-port');
const tmp = require('tmp');
const { MongodHelper } = require('mongodb-prebuilt');
Promise.promisifyAll(tmp);


let mongoClient;

module.exports = Promise.coroutine(function* () {
  if (mongoClient) {
    return mongoClient;
  }

  try {
    const port = yield getPort({ host: '0.0.0.0' });
    const dbPath = yield tmp.dirAsync();

    const mongodArgs = [
      '--storageEngine', 'ephemeralForTest',
      '--dbpath', dbPath,
      '--port', port,
    ];

    const mongodHelper = new MongodHelper(mongodArgs);

    mongodHelper.mongoBin.mongoDBPrebuilt.mongoDBDownload.options.version = MONGO_VERSION;

    yield mongodHelper.run();

    const dbName = `test-db-${uuidv4()}`;
    mongoClient = new MongoClient();

    yield mongoClient.connect(`mongodb://0.0.0.0:${port}/${dbName}`);

    return mongoClient;
  } catch (e) {
    throw e;
  }
});
