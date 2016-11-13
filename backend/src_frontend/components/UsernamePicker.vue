<template>
  <div class="modal" id="username-picker">
    <div class="modal-content">

      <h4>Select Username</h4>
      <div class="row">
        <form class="col s12"
          @submit.prevent="namePicked">

          <div class="input-field col s12">
            <input ref="usernameInput" type="text" 
              id="new_username" 
              :placeholder="suggestedUsername"
              @input="updateUsername($event.target.value)">

            <label for="new_username">Username</label>
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
  props: [
    'visible',
    'suggestedUsername',
    'error',
  ],
  methods: {
    updateUsername: function updateValue(value) {
      const formattedValue = value.trim();
      if (formattedValue !== value) this.$refs.usernameInput.value = formattedValue;
      this.$emit('usernameInput', formattedValue);
    },
    namePicked: function namePicked() {
      this.$emit('namePicked', this.username);
    },
  },
  computed: {
    username: function username() {
      return this.$refs.usernameInput.value;
    },
  },
  mounted: function mounted() {
    $('#username-picker').modal({ dismissible: false });
  },
  watch: {
    suggestedUsername: function suggestedUsername(val) {
      this.$refs.usernameInput.value = val;
    },
    visible: function visible(val) {
      if (val) $('#username-picker').modal('open');
      else $('#username-picker').modal('close');
    },
  },
};
</script>
