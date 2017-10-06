const Promise = require('bluebird');
const uuidv4 = require('uuid/v4');
const MongoClient = require('mongodb').MongoClient;

let mongoClient;

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
  if (mongoClient) {
    return mongoClient;
  }

  const dbName = `test-db-${uuidv4()}`;
  mongoClient = new MongoClient();

  const mongoDbUri = `${connectionUri}/${dbName}`;
  mongoClient = yield mongoClient.connect(mongoDbUri);

  return { mongoDbUri, mongoClient };
});
