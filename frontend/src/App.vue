<template>
  <div>
    <username-picker
      ref="usernamePicker"
      :username-needed="usernameNeeded"
      :error="usernameError"
      @usernameSelected="usernameSelected"></username-picker>
  </div>

</template>

<script>
import UsernamePicker from 'components/UsernamePicker';

export default {
  props: ['initialSocket'],
  data: () => ({
    socket: null,
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
