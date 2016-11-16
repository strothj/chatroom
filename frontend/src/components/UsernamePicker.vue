<template>
  <div ref="modal" class="modal">
    <div class="modal-content">

      <div class="row">
        <h4>Pick your username</h4>
      </div>
      <div class="row">
        <form class="col s12"
          @submit.prevent="submit">

          <div class="input-field col s12">
            <input v-model="username" id="new_username" ref="username" type="text" placeholder="Username">
            <label for="new_username">Username</label>
          </div>

        </form>
      </div>

      <div class="row">
        <span ref="errorMessage">{{ error }}</span>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: ['error', 'usernameNeeded', 'initialUsername'],
  data: () => ({
    isVisible: false,
    username: '',
  }),
  mounted: function mount() {
    this.username = this.initialUsername;
    $(this.$refs.modal).modal({ dismissible: false });
  },
  computed: {
    visible: function visible() {
      return this.isVisible;
    },
  },
  watch: {
    initialUsername: function initialUsername(val) {
      this.username = val;
    },
    usernameNeeded: function usernameNeeded(val) {
      if (val) {
        $(this.$refs.modal).modal('open');
        this.isVisible = true;
      } else {
        $(this.$refs.modal).modal('close');
        this.isVisible = false;
      }
    },
  },
  methods: {
    submit: function submit() {
      this.$emit('usernameSelected', this.username);
    },
  },
};
</script>
