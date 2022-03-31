<!--
 * @Description: 
 * @Version: 
 * @Author: wangXiaoMing
 * @Date: 2022-02-09 19:49:06
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-02-14 17:31:52
-->
<template>
  <div class="drag-circle-wrap">
    <div class="btn-distance-tips">
      {{ (propsData.distance || 3000) + "米" }}
      <div class="btn-distance-tips-triangle"></div>
    </div>
    <div class="btn-direction" ref="btnDirection">
      <i class="h-icon-angles_right_sm"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "DragCircle",
  props: {
    propsData: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.initMouseEvent();
  },
  methods: {
    initMouseEvent() {
      this.$refs["btnDirection"].addEventListener("mousedown", (e) => {
        this.propsData.mouseMoveFun(e);
        //取消事件默认行为
        e.preventDefault();
      },
      // 阻止默认滑动行为
      { passive: false }
      );
    },
  },
  beforeDestroy() {
    this.$refs["btnDirection"].removeEventListener("mousedown");
  },
};
</script>

<style lang="scss" scoped>
.drag-circle-wrap {
  position: relative;
  z-index: 1000;
  transform: translate(-50%, 0);
  .btn-direction {
    width: 32px;
    height: 32px;
    border: 1px red solid;
    border-radius: 16px;
    background: white;
    font: 800 30px/32px serief;
    color: red;
    text-align: center;
  }
  .btn-distance-tips {
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translate(-50%, 0);
    height: 24px;
    background: white;
    border: 1px solid red;
    border-radius: 4px;
    text-align: center;
    padding: 0 6px;
    white-space: nowrap;
    cursor: default;
    &-triangle {
      position: absolute;
      left: 50%;
      bottom: -8px;
      z-index: 10;
      transform: translate(-50%, 0);
      border: 4px solid transparent;
      border-top-color: white;
    }
    &::after {
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translate(-50%, 0);
      border: 6px solid transparent;
      border-top-color: red;
      content: "";
    }
  }
}
</style>
