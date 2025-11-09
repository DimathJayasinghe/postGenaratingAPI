const http = require('http');
const app = require('./app');
const { config } = require('./config');

const server = http.createServer(app);

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${config.port} is already in use.`);
    console.error('If you are running the app locally, stop the process using the port or change PORT.');
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

// Explicitly listen on all interfaces so containers/hosted platforms can reach the server.
server.listen(config.port, '0.0.0.0', () => {
  const addr = server.address() || {};
  const address = addr.address === '::' ? '0.0.0.0' : addr.address || '0.0.0.0';
  const port = addr.port || config.port;
  console.log(`Server running on port ${port} (listening on ${address})`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Tip: open http://localhost:${port} to access the server from this machine.`);
  }
});

module.exports = server;