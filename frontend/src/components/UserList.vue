<template>
  <div>
    <ul id="userList" class="side-nav fixed">
      <h5 class="center-align">Users</h5>
      <div class="divider"></div>
      <li v-for="user in users">
        <a href="#">
          <i class="material-icons">message</i>
          {{ user }}
        </a>
      </li>
    </ul>
    <a href="#" data-activates="userList" class="button-collapse"></a>
  </div>
</template>

<script>
export default {
  props: ['users', 'username'],
  mounted: function mount() {
    $('.button-collapse').sideNav({ edge: 'right' });
  },
};
</script>

<style lang="less">
header, main, footer {
  padding-right: 300px;

  @media only screen and (max-width : 992px) {
    padding-right: 0;
  }
}
</style>
