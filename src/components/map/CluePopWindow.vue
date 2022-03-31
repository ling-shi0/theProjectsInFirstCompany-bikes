<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-09-02 15:41:00
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-03 14:22:44
-->
<template>
  <div class="clue-pop-window">
    <div class="icon">
      <div><div></div></div>
    </div>
    <div class="pop" @click="previewPic" v-if="propsData.showPop">
      <img
        :src="propsData.picUrl || propsData.image"
        style="width: 132px; height: 132px"
      />
      <div>{{ propsData.passTime }}</div>
    </div>
  </div>
</template>

<script>
import Bus from "@/bus";
export default {
  name: "CluePopWindow",
  props: {
    propsData: Object,
  },
  methods: {
    previewPic() {
      Bus.$emit("previewMapPic", this.propsData);
    },
  },
};
</script>

<style lang="scss" scoped>
.clue-pop-window {
  width: 24px;
  height: 24px;
  position: relative;
  transform: translate(-50%, -50%);
  .icon {
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: rgba(236, 11, 11, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
      width: 12px;
      height: 12px;
      border-radius: 6px;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
      > div {
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #ec1b0b;
      }
    }
  }
  .pop {
    width: 136px;
    height: 160px;
    position: absolute;
    bottom: 36px;
    left: 0;
    background: #2080f7;
    border-radius: 2px;
    padding: 2px;
    color: white;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.12);
    transform: translateX(calc(-50% + 12px));
    > div {
      width: 100%;
      height: 20px;
      font-size: 14px;
      margin-top: -4px;
      text-align: center;
    }
    &::after {
      content: "";
      width: 0;
      height: 0;
      position: absolute;
      bottom: -16px;
      right: calc(50% - 8px);
      border: 8px solid;
      border-color: #2080f7 transparent transparent;
    }
  }
}
</style>
