const net = require('net');
const { encrypt, decrypt } = require('./crypt');

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
  constructor({ port, key }) {
    this.port = port;
    this.key = key ? Buffer.from(key.padStart(32)).slice(0, 32) : null;
    this.connections = [];
    this.server = net.createServer((c) => {
      this.connections.push(c);
      c.on('end', () => {
        this.connections = this.connections.filter(connection => connection !== c);
      });
    });
    this.server.listen(this.port, () => {
      console.log(`Listening on ${this.port}...`);
    });
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
    this.connections.forEach(c => c.write(payload));
  }
};
