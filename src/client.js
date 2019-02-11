const net = require('net');
const EventEmitter = require('events');
const { encrypt, decrypt } = require('./crypt');

/**
 * Client
 * @class
 * @description Client to receive events to.
 */
module.exports = class Client extends EventEmitter {
  /**
   * Constructor
   * @constructor
   * @param {Object} opts - Constructor options
   * @param {Number} opts.port - Port to connect to
   * @param {String} opts.host - Host to connect to
   * @param {String} opts.key - Secret key to use. Will be padded/truncated
   *                            to length 32 for encryption algorithm.
   */
  constructor({ port, host, key }) {
    super();
    this.port = port;
    this.host = host;
    this.key = key ? Buffer.from(key.padStart(32)).slice(0, 32) : null;
    this.connection = net.createConnection(this.port, this.host, (c) => {
      console.log('connected to server');
    });
    this.connection.on('data', (data) => {
      let payload;
      if (this.key) {
        const buffer = Buffer.from(data);
        payload = decrypt(buffer.slice(16), this.key, buffer.slice(0, 16)).split('\n');
      } else {
        payload = data.toString('utf8').split('\n');
      }
      this.emit(payload[0], JSON.parse(payload[1]));
    });
  }
};
