import SocketIO from 'socket.io';

class ChatServer {

  constructor(listenArg) {
    if (typeof listenArg === 'number') {
      this.selfHosted = true;
    }
    this.users = new Map();

    this.io = new SocketIO(listenArg);
    this.io.on('connection', this.handleConnection.bind(this));
  }

  isAvailableName(username) {
    for (const existing of this.users.keys()) {
      if (username.toLowerCase() === existing.toLowerCase()) return false;
    }
    return true;
  }

  addUser(username, socket) {
    if (!this.isAvailableName(username)) return false;
    this.users.set(username, socket);
    socket.removeAllListeners('set username');
    socket.broadcast.emit('join', username);
    return true;
  }

  addMessageHandlers(username) {
    const socket = this.users.get(username);
    socket.on('message', (message) => {
      socket.broadcast.emit('message', { username, message });
    });
    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  getUsernameFromSocket(socket) {
    for (const [key, value] of this.users) {
      if (value === socket) {
        return key;
      }
    }
    return null;
  }

  handleConnection(socket) {
    this.recommendUsername(socket);
    socket.on('set username', (username, ok) => {
      if (this.addUser(username, socket)) {
        this.addMessageHandlers(username);
        ok(true);
      } else {
        this.recommendUsername(socket);
        ok(false);
      }
    });
  }

  handleDisconnect(socket) {
    const username = this.getUsernameFromSocket(socket);
    this.users.delete(username);
    socket.broadcast.emit('left', username);
  }

  recommendUsername(socket) {
    let nextGuest = 0;
    do {
      nextGuest += 1;
    } while (!this.isAvailableName(`guest${nextGuest}`));
    socket.emit('recommend username', `guest${nextGuest}`);
  }

  close(cb) {
    if (this.selfHosted) this.io.close(cb);
  }

}

export default ChatServer;
