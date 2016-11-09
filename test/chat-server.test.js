import chai from 'chai';
import io from 'socket.io-client';
import ChatServer from '../src/chat-server';

chai.should();
const port = process.env.PORT || 8080;
const addr = `http://localhost:${port}`;
const opts = { multiplex: false };

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

});
