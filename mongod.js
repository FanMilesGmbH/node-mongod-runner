const _ = require('lodash');
const Promise = require('bluebird');
const tmp = require('tmp');
const getPort = require('get-port');
const { MongodHelper } = require('mongodb-prebuilt');


module.exports = Promise.coroutine(function* (config) {
  const mongodConfig = _.defaults(config, {
    port: 27017,
    host: '0.0.0.0',
  });

  try {
    const port = yield getPort({ host: mongodConfig.host });
    const dbPath = yield tmp.dirAsync();

    const mongodArgs = [
      '--storageEngine', 'ephemeralForTest',
      '--dbpath', dbPath,
      '--port', port,
    ];

    const mongodHelper = new MongodHelper(mongodArgs);
    yield mongodHelper.run();
  } catch(e) {
    throw e;
  }
});
