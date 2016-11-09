import SocketIO from 'socket.io';
import EventEmitter from 'events';

class ChatServer extends EventEmitter {

  constructor(listenArg) {
    super();
    if (typeof listenArg === 'number') {
      this.selfHosted = true;
    }
    this.users = [];
    this.io = new SocketIO(listenArg);

    this.io.on('connection', (socket) => {
      socket.on('set username', (username, ok) => {
        this.addUser(username, socket);
        this.addMessageHandlers(username);
        ok(true);
      });
    });
  }

  addUser(username, socket) {
    this.users[username] = socket;
    socket.removeAllListeners('set username');
    // this.emit('set username', username);
  }

  addMessageHandlers(username) {
    const socket = this.users[username];
    socket.on('message', (message) => {
      socket.broadcast.emit('message', { username, message });
      // this.emit('message', { username, message });
    });
  }

  close() {
    if (this.selfHosted) {
      this.io.close();
    }
  }

}

export default ChatServer;
