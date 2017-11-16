# node-mongod-runner
Nodejs runner for mongod with ephemeralForTest storage type and guaranteed listening port.
The process will be stopped on `SIGINT` or `SIGTERM` signals.

# Examples

```javascript
const mongodRunner = require('node-mongod-runner');
const mongodb = require('mongodb');

mongodRunner().then(({ mongoUri, port }) => {
  return mongodb.connect(mongoUri);
})
```

Passing some defaults suggestion for port:

```javascript
mongodRunner({
  port: 27101,
})
```
The default `port` will be ignored if not free and a random one will be assigned.

Listening only on localhost:
```javascript
mongodRunner({
  host: 'localhost',
})
```

Use a different version of MongoDB:
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
