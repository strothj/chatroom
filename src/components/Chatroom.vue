<template>
  <div class="container">
    <div class="row">
      <div class="s12 m8">
        <chatbox
          :username="username"
          @message="sendMessage"></chatbox>
      </div>
      <div class="s12 m4">
        <userlist></userlist>
      </div>
    </div>
  </div>
</template>

<script>
import Chatbox from './Chatbox.vue';

export default {
  props: ['username'],
  data: () => ({

  }),
  components: {
    Chatbox,
  },
  methods: {
    sendMessage: function sendMessage(message) {
      this.$emit('message', message);
    },
  },
};
</script>
