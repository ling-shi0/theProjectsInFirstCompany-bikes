<template>
  <div class="caseManage">
    <iframe
      :src="iframeSrc"
      height="100%"
      width="100%"
      name="demo"
      frameborder="0"
      scrolling="auto"
      sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts"
    ></iframe>
  </div>
</template>

<script>
export default {
  data () {
    return {
      iframeSrc: window.location.origin + "/casemgr-web/index.do"
      //iframeSrc:'https://10.19.141.75/casemgr-web/index.do',
    };
  }
};
</script>

<style lang="scss" scoped>
.caseManage {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
