<template>
  <div class="container chatroom">
    <div class="row">
      <div class="col s12">
        <slot name="messageList"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.chatroom {
  padding-bottom: 85px;
}
</style>
