<template>
  <div>
    <ul class="collection">
      <li v-for="message in messages" class="collection-item">
        <div class="chip">{{ message.username }}</div>
        {{ message.message }}
      </li>
    </ul>

    <form @submit.prevent="sendMessage">
      <input ref="messageInput" type="text" placeholder="Message" id="message">
    </form>
  </div>
</template>

<script>
export default {
  props: ['username'],
  data: () => ({
    messages: [],
  }),
  mount: function mount() {
    this.$on('message', function onMessage(message) {
      this.messages.push(message);
    });
  },
  methods: {
    sendMessage: function sendMessage() {
      const message = {
        username: this.username,
        message: this.$refs.messageInput.value,
      };
      this.messages.push(message);
      this.$emit('message', message);
      this.$refs.messageInput.value = '';
    },
  },
};
</script>
