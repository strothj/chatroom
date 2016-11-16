<template>
  <div v-bind:class="{ blue: currentUser }" class="card-panel">
    <div class="chip message-username">{{ username }}</div>
    <span v-bind:class="{ 'white-text': currentUser, 'black-text': !currentUser }">{{ contents }}</span>
  </div>
</template>

<script>
export default {
  props: ['username', 'contents', 'currentUser'],
};
</script>
