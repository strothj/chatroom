<template>
  <div ref="modal" class="modal">
    <div class="modal-content">
      <span>test</span>
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
};
</script>
