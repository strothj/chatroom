<template>
  <div>
    <header>
      <navbar></navbar>
      <user-list
        slot="userList"
        :users="users"></user-list>
    </header>
    <main>
      <username-picker
        ref="usernamePicker"
        :initialUsername="initialUsername"
        :username-needed="usernameNeeded"
        :error="usernameError"
        @usernameSelected="usernameSelected"></username-picker>
      <chatroom>
        <message-list
          slot="messageList"
          :messages="messages"></message-list>
      </chatroom>
      <message-input
        @message="submitMessage"></message-input>
    </main>
  </div>

</template>

<script>
import UsernamePicker from 'components/UsernamePicker';
import Navbar from 'components/Navbar';
import Chatroom from 'components/Chatroom';
import UserList from 'components/UserList';
import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';

export default {
  props: ['initialSocket'],
  data: () => ({
    socket: null,
    users: [],
    messages: [],
    initialUsername: '',
    username: '',
    usernameNeeded: false,
    usernameError: '',
  }),
  mounted: function mounted() {
    if (this.initialSocket) {
      this.socket = this.initialSocket;
    } else {
      this.socket = io();
    }
    this.socket.on('recommend username', (username) => {
      this.initialUsername = username;
      this.usernameNeeded = true;
    });
    this.socket.on('user list', (users) => {
      this.users = users.sort();
    });
    this.socket.on('join', (username) => {
      this.users.push(username);
      this.users = this.users.sort();
    });
    this.socket.on('left', (username) => {
      const index = this.users.indexOf(username);
      if (index !== -1) {
        this.users.splice(index, 1);
      }
    });
    this.socket.on('message', (message) => {
      this.messages.push(message);
    });
  },
  methods: {
    usernameSelected: function usernameSelected(username) {
      this.socket.emit('set username', username, (ok) => {
        if (ok) {
          this.username = username;
          this.socket.emit('user list');
        } else {
          this.usernameError = `Username "${username}" is not available.`;
        }
        this.usernameNeeded = !ok;
      });
    },
    submitMessage: function submitMessage(message) {
      this.socket.emit('message', message);
      this.messages.push({ username: this.username, message, currentUser: true });
    },
  },
  components: {
    UsernamePicker,
    Navbar,
    Chatroom,
    UserList,
    MessageList,
    MessageInput,
  },
};
</script>
