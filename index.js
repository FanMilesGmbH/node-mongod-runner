const tmp = require('tmp');
const getPort = require('get-port');
const { MongodHelper } = require('@fanmiles/mongodb-prebuilt');
const uuidv4 = require('uuid/v4');
const { MongoClient } = require('mongodb');


const makeCreateMongoClient = require('./createMongoClient');
const makeStartMongod = require('./startMongod');

module.exports = makeStartMongod({
  tmp,
  getPort,
  MongodHelper,
});

module.exports.createMongoClient = makeCreateMongoClient({
  MongoClient,
  uuidv4,
});
