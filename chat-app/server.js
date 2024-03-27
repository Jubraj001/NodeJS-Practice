const net = require('net');

const server = net.createServer();

// Array of client sockets
const clients = [];

server.on("connection", (socket) => {
  console.log("A new connection to the server");

  const clientId = clients.length + 1;
  socket.write(`id-${clientId}`);

  clients.map((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  socket.on("data", (data) => {
    const dataString = data.toString('utf-8');
    const id = dataString.substring(0, dataString.indexOf("-"));
    const message = dataString.substring(dataString.indexOf("-message-") + 9);

    clients.map((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    })
  });

  socket.on('end', () => {
    // Broadcasting the message to everyone when someone leaves the chat
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    })
  });

  clients.push({ id: clientId.toString(), socket });
})

server.listen(3008, "127.0.0.1", () => {
  console.log('Open server on', server.address());
})
