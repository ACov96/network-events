const net = require('net');
const { encrypt, decrypt } = require('./crypt');

module.exports = class Server {
  constructor({ port, key, iv }) {
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

  emit({ event, data }) {
    let payload = `${event}\n${data ? JSON.stringify(data) : ''}\n`;
    if (this.key) {
      payload = encrypt(payload, this.key);
    }
    this.connections.forEach(c => c.write(payload));
  }
};
