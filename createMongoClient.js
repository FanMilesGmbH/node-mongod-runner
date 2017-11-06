const Promise = require('bluebird');
const uuidv4 = require('uuid/v4');
const MongoClient = require('mongodb').MongoClient;

/**
 * @typedef {Object} CreateMongoClientResponse
 * @property {String} mongoDbUri
 * @property {Object} mongoClient
 */
/**
 * Creates temporarty database and connects to the mongo
 * @param {Object} parameters
 * @param {String} parameters.connectionUri - Valid mongo connection uri
 * @example
 * createMongoClient({ connectionUri: 'mongodb://127.0.0.0' })
 * @returns {Promise.<CreateMongoClientResponse>}
 */
module.exports = Promise.coroutine(function* createMongoClientHandler({ connectionUri }) {
  const dbName = `test-db-${uuidv4()}`;
  const Client = new MongoClient();

  const mongoDbUri = `${connectionUri}/${dbName}`;
  const mongoClient = yield Client.connect(mongoDbUri);

  return { mongoDbUri, mongoClient };
});
