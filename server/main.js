const socket_io = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
app.use(express.static('public'));

const server = http.Server(app);
const io = socket_io(server);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log('Received message:', message);
    socket.broadcast.emit('message', message);
  });
});

server.listen(process.env.PORT || 8080);
