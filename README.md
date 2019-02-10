# Network Events

A dependency-free, light-weight event system using NodeJS's `net` and 
`events` libraries.

## Installation

Install from npm:

```bash
npm install network-events
```

## Usage

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
const { Client } = require('network-events');

const client = new Client({ port: 5000, host: 'localhost' });
client.on('count', (data) => console.log(data.count));
```

Every 5 seconds, the server will increment `count` and emit the result to all
connected clients.
