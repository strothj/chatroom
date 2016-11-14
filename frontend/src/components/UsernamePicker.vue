<template>
  <div ref="modal" class="modal">
    <div class="modal-content">

      <h4>Pick your username</h4>
      <div class="row">
        <form class="col s12"
          @submit.prevent="submit">

          <div class="input-field col s12">
            <label>Username<input ref="username" type="text"></label>
          </div>

        </form>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  mounted: function mount() {
    $(this.$refs.modal).modal();
  },
  computed: {
    usernameNeeded: {
      set: function usernameNeeded(val) {
        if (val) $(this.$refs.modal).modal('open');
        else $(this.$refs.modal).modal('close');
      },
    },
  },
  methods: {
    submit: function submit(username) {
      this.$emit('submit', this.$refs.username.value);
    },
  },
};
</script>
