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

  const port = yield getPort({ host: mongodConfig.host });
  const tempDirectory = tmp.dirSync();

  const mongodArgs = [
    '--storageEngine', 'ephemeralForTest',
    '--dbpath', tempDirectory.name,
    '--port', port,
  ];

  const mongodHelper = new MongodHelper(mongodArgs);
  return yield mongodHelper.run();
});
