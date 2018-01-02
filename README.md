# node-mongod-runner

[![Greenkeeper badge](https://badges.greenkeeper.io/FanMilesGmbH/node-mongod-runner.svg)](https://greenkeeper.io/)
Nodejs runner for mongod with ephemeralForTest storage type and guaranteed listening port.
The process will be stopped on `SIGINT` or `SIGTERM` signals.

# Usage

```javascript
const mongodRunner = require('node-mongod-runner');
const mongodb = require('mongodb');

mongodRunner().then(({ connectionUri }) => {
  return mongodb.connect(`${connectionUri}/test_db`);
})
```

- Passing some suggestion for port:

  ```javascript
  mongodRunner({
    port: 27101,
  })
  ```
  If the `port` is not free a random one will be generated and returned. 

- Listening only on localhost:
  ```javascript
  mongodRunner({
    host: 'localhost',
  })
  ```

- Use a different version of MongoDB:
  ```javascript
  mongodRunner({
    version: '3.2.0',
  })
  ```
  This might take a while because it needs to download the mongod binary.
  So, if used in Mocha tests you need to consider setting a timeout.

# Default configuration

```json
{
  "port": 27017,
  "host": "0.0.0.0"
}
```

# API

## `mongodRunner({ port, host, version })`

Returns a `promise` that will resolve an object containing `connectionUri` and `port`.
```javascript
// result
{
  connectionUri // 'mongodb://0.0.0.0:44444'
  port          // the generated port Eg.: 44444
  kill          // method to kill mongod process
}
```

## `mongoRunner.createMongoClient({ connectionUri })`

It takes a `connectionUri` and it creates a mongodb connection to a random database.
It returns a `Promise` that will resolve to an object containing the `connectionUri` that includes
the random generated database name.
```javascript
// result
{
  connectionUri // the connection uri with a randomly generated db name Eg.: 'mongodb://0.0.0.0:44444/test-db-a743afc5-1571-486a-b26b-982f40f27c32'
  mongoClient   // a mongodb client connection
}
```
