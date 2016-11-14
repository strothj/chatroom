<template>
  <div ref="modal" class="modal">
    <div class="modal-content">

      <h4>Pick your username</h4>
      <div class="row">
        <form class="col s12"
          @submit.prevent="submit">

          <div class="input-field col s12">
            <label>Username<input ref="username" type="text" placeholder="Username"></label>
          </div>

        </form>
      </div>

      <div class="row">
        <span>{{ error }}</span>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: ['error'],
  mounted: function mount() {
    $(this.$refs.modal).modal();
  },
  computed: {
    username: {
      get: function getUsername() { return this.$refs.username.value; },
      set: function setUsername(val) { this.$refs.username.value = val; },
    },
    usernameNeeded: {
      set: function usernameNeeded(val) {
        if (val) $(this.$refs.modal).modal('open');
        else $(this.$refs.modal).modal('close');
      },
    },
  },
  methods: {
    submit: function submit() {
      this.$emit('submit', this.username);
    },
  },
};
</script>
