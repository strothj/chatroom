<template>
  <div class="card-panel blue message">
    <div class="chip message-username">{{ username }}</div>
    <span class="white-text message-contents">{{ contents }}</span>
  </div>
</template>

<script>
export default {
  props: ['username', 'contents'],
};
</script>
