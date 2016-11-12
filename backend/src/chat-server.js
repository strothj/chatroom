import SocketIO from 'socket.io';
import debounce from 'lodash.debounce';

class ChatServer {

  constructor(listenArg) {
    if (typeof listenArg === 'number') {
      this.selfHosted = true;
    }
    this.users = new Map();
    this.userTypingDebounce = new Map();
    this.debounceTypingInterval = 100;

    this.io = new SocketIO(listenArg);
    this.io.on('connection', this.handleConnection.bind(this));
  }

  userExists(username) {
    for (const existing of this.users.keys()) {
      if (username.toLowerCase() === existing.toLowerCase()) return true;
    }
    return false;
  }

  addUser(username, socket) {
    if (this.userExists(username)) return false;
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
    socket.on('user list', () => {
      this.handleGetUserList(socket);
    });
    socket.on('private message', (message) => {
      this.handlePrivateMessage(socket, message);
    });
    socket.on('typing', () => {
      this.handleTyping(socket);
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

  handleGetUserList(socket) {
    socket.emit('user list', [...this.users.keys()]);
  }

  handlePrivateMessage(socket, message) {
    if (!message || !message.to || !message.contents) return;
    if (!this.userExists(message.to)) return;

    const targetSocket = this.users.get(message.to);
    targetSocket.emit('private message', {
      from: this.getUsernameFromSocket(socket),
      contents: message.contents,
    });
  }

  handleTyping(socket) {
    const username = this.getUsernameFromSocket(socket);
    if (!this.userTypingDebounce.has(username)) {
      socket.broadcast.emit('typing', username);
      this.userTypingDebounce.set(username, debounce(
        function debounceDoneTyping() { // eslint-disable-line prefer-arrow-callback
          socket.broadcast.emit('ended typing', username);
          this.userTypingDebounce.delete(username);
        }.bind(this), this.debounceTypingInterval
      ));
    } else {
      this.userTypingDebounce.get(username)();
    }
  }

  recommendUsername(socket) {
    let nextGuest = 0;
    do {
      nextGuest += 1;
    } while (this.userExists(`guest${nextGuest}`));
    socket.emit('recommend username', `guest${nextGuest}`);
  }

  close(cb) {
    if (this.selfHosted) this.io.close(cb);
  }

}

export default ChatServer;
