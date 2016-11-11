<template>
  <div id="app">
    <username-picker
      :visible="userPickerVisible"
      :suggestedUsername="suggestedUsername"
      :error="userPickerError"
      @namePicked="namePicked">
  </div>
</template>

<script>
import UsernamePicker from './components/UsernamePicker.vue';

export default {
  name: 'app',
  data: () => ({
    socket: null,
    userPickerVisible: false,
    userPickerError: '',
    suggestedUsername: '',
    chatroomVisible: false,
  }),
  components: {
    UsernamePicker,
  },
  methods: {
    namePicked: function namePicked(username) {
      this.socket.emit('set username', username, (ok) => {
        if (ok) {
          this.userPickerVisible = false;
          this.chatroomVisible = true;
        } else {
          this.userPickerError = `Username "${username}" is not available.`;
        }
      });
    },
  },
  mounted: function created() {
    this.socket = io();
    this.socket.on('recommend username', (username) => {
      this.suggestedUsername = username;
      this.userPickerVisible = true;
    });
  },
};
</script>
