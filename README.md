# Network Events

A dependency-free, light-weight event system using NodeJS's `net`, 
`events`, and `crypto` libraries.

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
const server = new Server({ port: 5000 });

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

### With Encryption
You can also encrypt traffic using a secret key.

```javascript
/* server.js */
const { Server } = require('network-events');

let count = 0;
const server = new Server({ port: 5000, key: 'somesupersecretkey' });

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
