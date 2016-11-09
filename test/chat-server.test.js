import chai from 'chai';
import io from 'socket.io-client';
import ChatServer from '../src/chat-server';

chai.should();
const port = process.env.PORT || 8080;
const addr = `http://localhost:${port}`;
const opts = { multiplex: false, reconnection: false };

const testUsernames = ['Bob', 'Jane'];

function addTestUsers() {
  const addUserPromises = [];
  for (const username of testUsernames) {
    const client = io.connect(addr, opts);
    const addUserPromise = new Promise((resolve, reject) => {
      client.on('connect', () => {
        client.emit('set username', username, (ok) => {
          if (ok) { resolve(client); } else { reject(new Error(`Failed to add user: ${username}`)); }
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
    const connectedUsers = Object.keys(server.users);

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

        client.emit('set username', 'Bob', (ok) => {
          ok.should.equal(false); // Bob already exists as a user.
        });
      });
    })
  );

});
