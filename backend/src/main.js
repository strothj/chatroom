import http from 'http';
import express from 'express';
import ChatServer from './chat-server';

const app = express();
app.use(express.static('build/public'));

const server = new http.Server(app);
const chatServer = new ChatServer(server); // eslint-disable-line no-unused-vars

server.listen(process.env.PORT || 8080);
