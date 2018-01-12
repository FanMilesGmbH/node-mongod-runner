const _ = require('lodash');
const Promise = require('bluebird');

module.exports = ({ tmp, MongodHelper, getPort }) =>
  Promise.coroutine(function* mongoRunnerHandler(config) {
    const mongodConfig = _.defaults(config, {
      port: 27017,
      host: '0.0.0.0',
    });

    const host = mongodConfig.host;
    const port = yield getPort({ host, port: mongodConfig.port });
    const tempDirectory = tmp.dirSync();

    const mongodArgs = [
      '--storageEngine', 'ephemeralForTest',
      '--dbpath', tempDirectory.name,
      '--bind_ip', host,
      '--port', port,
    ];

    const mongodHelper = new MongodHelper(mongodArgs);

    if (mongodConfig.version) {
      _.set(mongodHelper, 'mongoBin.mongoDBPrebuilt.mongoDBDownload.options.version', mongodConfig.version);
    }

    const mongoIsRunning = yield mongodHelper.run();

    if (!mongoIsRunning) {
      throw new Error('mongod was not successfully started!');
    }

    function kill() {
      mongodHelper.mongoBin.childProcess.kill('SIGTERM');
    }

    process.on('SIGINT', kill);
    process.on('SIGTERM', kill);

    module.exports.kill = kill;

    return {
      connectionUri: `mongodb://${host}:${port}`,
      port,
      kill,
    };
  });
