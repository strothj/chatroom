const socketIO = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
app.use(express.static('build/public'));

const server = new http.Server(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log('Received message:', message);
    socket.broadcast.emit('message', message);
  });
});

server.listen(process.env.PORT || 8080);
