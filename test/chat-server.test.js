import chai from 'chai';
import io from 'socket.io-client';
import ChatServer from '../src/chat-server';

chai.should();
const port = process.env.PORT || 8080;
const addr = `http://localhost:${port}`;
const opts = { multiplex: false, reconnection: false };

const testUsernames = ['Bob', 'Jane', 'John'];

function addTestUsers() {
  const addUserPromises = [];
  for (const username of testUsernames) {
    const client = io.connect(addr, opts);
    const addUserPromise = new Promise((resolve, reject) => {
      client.on('connect', () => {
        client.emit('set username', username, (ok) => {
          if (ok) {
            resolve(client);
            client.removeAllListeners();
          } else { reject(new Error(`Failed to add user: ${username}`)); }
        });
      });
    });
    addUserPromises.push(addUserPromise);
  }
  return Promise.all(addUserPromises);
}

describe('ChatServer', () => {
  let server;

  beforeEach(() => { server = new ChatServer(port); });
  afterEach(() => { server.close(); });

  it('add multiple users', async () => {
    const [client1, client2] = await addTestUsers();
    const connectedUsers = [...server.users.keys()];

    client1.should.not.equal(client2);
    connectedUsers.should.deep.equal(testUsernames);
  });

  it('should recieve recommended guest name on connection', (done) => {
    const client1 = io.connect(addr, opts);
    client1.on('recommend username', (username) => {
      username.should.equal('guest1');
      client1.emit('set username', username, () => {

        const client2 = io.connect(addr, opts);
        client2.on('recommend username', (username2) => {
          username2.should.equal('guest2');
          done();
        });

      });
    });
  });

  it('should fail set username if name is already taken and recommend a new one', () =>
    new Promise(async (resolve) => {
      await addTestUsers();
      const client = io.connect(addr, opts);
      client.on('recommend username', () => {
        // Ignore recommendation given on inital connection to server.
        client.removeAllListeners('recommend username');

        client.on('recommend username', (username) => {
          // This should be called after we attempt a bad username selection.
          username.should.equal('guest1');
          resolve();
        });

        client.emit('set username', 'bob', (ok) => {
          ok.should.equal(false); // Bob already exists as a user.
        });
      });
    })
  );

  it('should broadcast on user connection and disconnection', async () => {
    const [client1, client2] = await addTestUsers();

    async function disconnectBroadcastTest() {
      return new Promise((resolve) => {
        client1.on('left', (username) => {
          username.should.equal('Jane');
          server.users.size.should.equal(testUsernames.length - 1);
          setTimeout(() => { resolve(); }, 10); // Wait to prevent race condition.
        });

        client2.disconnect();
      });
    }

    async function connectBroadcastTest() {
      return new Promise((resolve) => {
        client1.on('join', (username) => {
          username.should.equal('Jane');
          resolve();
        });

        client2.on('recommend username', () => {
          client2.emit('set username', 'Jane', () => {});
        });
        client2.connect(addr, opts);
      });
    }

    await disconnectBroadcastTest();
    await connectBroadcastTest();
  });

  it('should return a list of users', async () => {
    const [client] = await addTestUsers();

    return new Promise((resolve) => {
      client.on('user list', (users) => {
        users.should.deep.equal(testUsernames);
        resolve();
      });

      client.emit('user list');
    });
  });

  it('send private message to user', async () => {
    const [client1, client2, client3] = await addTestUsers();

    return new Promise((resolve, reject) => {
      client1.on('private message', (message) => {
        message.from.should.equal('Jane');
        message.contents.should.equal('test message');
        // Timeout to give client2's private message handler a chance to detect spillover.
        setTimeout(() => { resolve(); }, 10);
      });

      // Private message should only go to one user.
      client2.on('private message', () => { reject(); });
      client3.on('private message', () => { reject(); });

      client2.emit('private message', { to: 'Bob', contents: 'test message' });
    });
  });

});
