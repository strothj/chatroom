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
        :username-needed="usernameNeeded"
        :error="usernameError"
        @usernameSelected="usernameSelected"></username-picker>
      <chatroom>
        <message-list
          slot="messageList"
          :messages="messages"></message-list>
      </chatroom>
      <message-input></message-input>
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
/* eslint-disable */
export default {
  props: ['initialSocket'],
  data: () => ({
    socket: null,
    users: ['testasdfasdfasdfasdfasd', 'test2', 'test3', 'test4', 'testasdfasdfasdfasdfasd', 'test2', 'test3', 'test4', 'testasdfasdfasdfasdfasd', 'test2', 'test3', 'test4'],
    messages: [{ username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world!' }, { username: 'Bob', contents: 'Hello world! asdfasdfasdfasdfasdfsdafasdf' }],
    usernameNeeded: false,
    usernameError: '',
  }),
  mounted: function mounted() {
    if (this.initialSocket) {
      this.socket = this.initialSocket;
    } else {
      this.socket = io();
    }
    this.socket.on('recommend username', () => {
      this.usernameNeeded = true;
    });
  },
  components: {
    UsernamePicker,
    Navbar,
    Chatroom,
    UserList,
    MessageList,
    MessageInput,
  },
  methods: {
    usernameSelected: function usernameSelected(username) {
      this.socket.emit('set username', username, (ok) => {
        this.usernameNeeded = !ok;
        if (!ok) this.usernameError = `Username "${username}" is not available.`;
      });
    },
  },
};
</script>
