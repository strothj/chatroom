<template>
  <div class="message-input">
    <div class="card">
      <div class="row">
        <form class="col s12">
          <input type="text" placeholder="Message">
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.message-input {
  position: fixed;
  padding-right: 300px;
  width: 100%;
  bottom: 10px;
  text-align: center;

  @media only screen and (max-width: 992px) {
    padding-right: 0;
  }

  .card {
    width: 70%;
    display: inline-block;
    margin: auto 0;

    @media only screen and (max-width: 992px) {
      width: 85%;
    }
  }
}
</style>
