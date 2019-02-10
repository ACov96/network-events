const net = require('net');
const EventEmitter = require('events');

module.exports = class Client {
  constructor({ port, host }) {
    this.port = port;
    this.host = host;
    this.emitter = new EventEmitter();
    this.connection = net.createConnection(this.port, this.host, (c) => {
      console.log('connected to server');
    });
    this.connection.setEncoding('utf8');
    this.connection.on('data', (data) => {
      const payload = data.split('\n');
      this.emitter.emit(payload[0], JSON.parse(payload[1]));
    });
  }

  on(event, cb) {
    this.emitter.on(event, cb);
  }
};
