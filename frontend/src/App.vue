<template>
  <div>
    <username-picker
      :visible="userPickerVisible"
      :suggestedUsername="suggestedUsername"
      :error="userPickerError"
      @namePicked="namePicked"></username-picker>
    <chatroom
      :username="username"
      @message="sendMessage"></chatroom>
  </div>

</template>

<script>
import UsernamePicker from 'components/UsernamePicker';
import Chatroom from 'components/Chatroom';

export default {
  name: 'app',
  data: () => ({
    socket: null,
    username: '',
    userPickerVisible: false,
    userPickerError: '',
    suggestedUsername: '',
    chatroomVisible: false,
  }),
  components: {
    UsernamePicker,
    Chatroom,
  },
  methods: {
    namePicked: function namePicked(username) {
      this.socket.emit('set username', username, (ok) => {
        if (ok) {
          this.userPickerVisible = false;
          this.chatroomVisible = true;
          this.username = username;
        } else {
          this.userPickerError = `Username "${username}" is not available.`;
        }
      });
    },
    sendMessage: function sendMessage(message) {
      this.socket.emit('message', message);
    },
  },
  mounted: function created() {
    this.socket = io();
    this.socket.on('recommend username', (username) => {
      this.suggestedUsername = username;
      this.userPickerVisible = true;
    });
    const that = this;
    this.socket.on('message', (message) => {
      that.$broadcast('message', message);
    });
  },
};
</script>
