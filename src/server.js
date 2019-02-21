const net = require('net');
const http = require('http');
const { parse } = require('querystring');
const { encrypt, decrypt } = require('./crypt');

const MINUTE = 1000 * 60;

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
    this.server = net.createServer((c) => {
      if (this.key) {
        c.once('data', (data) => {
          try {
            const clientKey = decrypt(data, this.key).toString();
            if (clientKey === this.key.toString()) {
              console.log(`Client connected from ${c.remoteAddress}`);
              this.connections.push(c);
            } else c.destroy();
          } catch (err) {
            c.destroy();
          }
        });
      } else {
        // console.log(`Client connected from ${c.remoteAddress}`);
        this.connections.push(c);
      }
      c.once('end', () => console.log(`Client ${c.remoteAddress} has disconnected`));
    });
    this.httpServer = http.createServer((req, res) => {
      const event = req.url.substring(1);
      if (req.method === 'POST') {
        let buffer = '';
        req.on('data', chunk => buffer += chunk.toString());
        req.on('end', () => {
          this.emit({ event, data: parse(buffer) });
          res.end();
        });
      } else {
        this.emit({ event });
        res.end();
      }
    });

    this.server.listen(clientPort, () => console.log(`Listening for clients on ${clientPort}...`));
    this.httpServer.listen(httpPort, () => console.log(`Listening for events on ${httpPort}...`));

    // Cleanup bad connections once every minute
    setInterval(() => {
      this.connections = this.connections.filter(c => !c.destroyed);
    }, MINUTE);
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
