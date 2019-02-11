const net = require('net');
const EventEmitter = require('events');
const { encrypt, decrypt } = require('./crypt');

module.exports = class Client extends EventEmitter {
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
