const net = require('net');
const http = require('http');
const { encrypt } = require('./crypt');

/**
 * Server
 * @description Server to emit events with
 * @class
 */
module.exports = class Server {
  /**
   * Constructor
   * @constructor
   * @param {Object} opts - Constructor options
   * @param {Number} opts.port - Port to listen on
   * @param {String} opts.key - Secret key to encrypt messages with. Will be
   *                            truncated/padded to length 32.
   */
  constructor({ clientPort, httpPort, key }) {
    this.key = key ? Buffer.from(key.padStart(32)).slice(0, 32) : null;
    this.connections = [];
    this.clientServer = net.createServer((c) => {
      console.log(`Client connected from ${c.remoteAddress}`);
      this.connections.push(c);
      c.once('close', () => {
        console.log(`Client ${c.remoteAddress} has disconnected`);
        this.connections = this.connections.filter(connection => connection !== c);
      });
      c.once('error', (hadError) => {
        if (hadError) {
          console.log(`Error emitting event to client ${c.remoteAddress}. Disconnecting client`);
          this.connections = this.connections.filter(connection => connection !== c);
        }
      });
    });
    this.httpServer = http.createServer((req, res) => {
      const event = req.url.substring(1);
      if (req.method === 'POST') {
        let buffer = '';
        req.on('data', chunk => buffer += chunk.toString());
        req.on('end', () => {
          this.emit({ event, data: JSON.parse((buffer)) });
          res.end();
        });
      } else {
        this.emit({ event });
        res.end();
      }
    });

    this.clientServer.listen(clientPort, () => console.log(`Listening for clients on ${clientPort}...`));
    this.httpServer.listen(httpPort, () => console.log(`Listening for events on ${httpPort}...`));
  }

  /**
   * Emit Event
   * @method
   * @description Emits an event to all connected clients with data attached
   *              if data is provided.
   * @param {Object} opts - Emit options
   * @param {String} event - Event name
   * @param {Object} data - Arbitrary data to send to clients
   */
  emit({ event, data }) {
    let payload = `${event}\n${data ? JSON.stringify(data) : ''}\n`;
    if (this.key) {
      payload = encrypt(payload, this.key);
    }
    this.connections.forEach((c) => {
      if (!c.destroyed) c.write(payload);
    });
  }
};
