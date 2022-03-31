<template>
  <div>
    <img src="../../assets/images/loading.gif" width="100" />
  </div>
</template>

<script>
export default {
  name: "loading",
  data () {
    return {};
  }
};
</script>

<style lang="scss" scoped>
div {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  img {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
  }
}
</style>
