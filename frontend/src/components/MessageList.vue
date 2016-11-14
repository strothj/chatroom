<template>
  <div>
    <message
      ref="messages"
      v-for="message in messages"
      :username="message.username"
      :contents="message.contents">
    </message>
  </div>
</template>

<script>
import Message from './Message';

export default {
  props: ['messages'],
  components: {
    Message,
  },
};
</script>
