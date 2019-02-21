# Network Events

A dependency-free, light-weight event system using NodeJS's `net`, 
`events`, `http`, and `crypto` libraries.

**NOTE**: Not all builds of NodeJS ship with `crypto`, but most do. If you
installed NodeJS through something like `nvm`, you're probably fine. 

## Installation

Install from npm:

```bash
npm install network-events
```

## Usage

### Basic
Here's a simple client/server example:

```javascript
/* server.js */
const { Server } = require('network-events');

let count = 0;
const server = new Server({ clientPort: 5000 });

setInterval(() => {
  count++;
  server.emit({ event: 'count', data: { count } });
}, 5000);
```

```javascript
/* client.js */
const { Client } = require('network-events');

const client = new Client({ port: 5000, host: 'localhost' });
client.on('count', (data) => console.log(data.count));
```

Every 5 seconds, the server will increment `count` and emit the result to all
connected clients.

### HTTP Server
Consume events via a REST endpoint and emit the event/data to all listening clients.

```javascript
/* server.js */
const { Server } = require('network-events');

let count = 0;
const server = new Server({ clientPort: 5000, httpPort: 5001 });
```

```javascript
const { Client } = require('network-events');

const client = new Client({ port: 5000, hot: 'localhost' });
client.on('http-event', data => console.log('Received HTTP event', data));
client.on('other-event', data => console.log('Received other event', data));
```

This exposes and endpoint that external entities can make REST calls to. An entity
can make a POST request to `http://localhost:5001/http-event` with a POST body
which will then be emitted to all connected clients. An entity can also post to
`/other-event` and listening clients will also get that data.

### With Encryption
You can also encrypt traffic using a secret key.

```javascript
/* server.js */
const { Server } = require('network-events');

let count = 0;
const server = new Server({ clientPort: 5000, key: 'somesupersecretkey' });

setInterval(() => {
  count++;
  server.emit({ event: 'count', data: { count } });
}, 5000);
```

```javascript
/* client.js */
const { Client } = require('network-events');

const client = new Client({ port: 5000, host: 'localhost', key: 'somesupersecretkey' });
client.on('count', (data) => console.log(data.count));
```
## Documentation

For more documentation, clone the repository and run:

```bash
npm run build_docs
```

This will create a `docs/` directory with detailed documentation.
