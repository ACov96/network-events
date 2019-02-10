const net = require('net');

module.exports = class Server {
  constructor({ port }) {
    this.port = port;
    this.connections = [];
    this.server = net.createServer((c) => {
      console.log('client connected');
      this.connections.push(c);
      c.on('end', () => {
        this.connections = this.connections.filter(connection => connection !== c);
        console.log('client disconnected');
      });
    });
    this.server.listen(this.port, () => {
      console.log(`Listening on ${this.port}...`);
    });
  }

  emit({ event, data }) {
    let payload = `${event}\n${data ? JSON.stringify(data) : ''}\n`;
    this.connections.forEach(c => c.write(payload));
  }
};
