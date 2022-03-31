<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-09-09 15:30:23
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-10 09:17:02
-->
<template>
  <div
    class="checkbox-item"
    :style="{
      background: backColor,
      color: fontColor,
      textAlign: itemMes.needCenter ? 'center' : '',
      textIndent: itemMes.needCenter ? '0' : '',
    }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    {{ itemMes.text }}
    <div
      :class="activeFlag || clickFlag ? 'check active' : 'check'"
      v-if="itemMes.needCheck"
    >
      <i class="h-icon-done" />
    </div>
  </div>
</template>

<script>
export default {
  name: "CheckBoxItem",
  props: {
    itemMes: Object,
  },
  mounted() {
    this.backColor = this.itemMes.backNormalColor;
    this.fontColor = this.itemMes.fontColor;
  },
  data() {
    return {
      backColor: "",
      fontColor: "",
      activeFlag: false,
      clickFlag: false,
    };
  },
  methods: {
    handleMouseEnter() {
      this.backColor = this.itemMes.backActiveColor;
      this.activeFlag = true;
      if (this.itemMes.activeFontColor) {
        this.fontColor = this.itemMes.activeFontColor;
      }
    },
    handleMouseLeave() {
      if (!this.clickFlag) {
        this.backColor = this.itemMes.backNormalColor;
        this.fontColor = this.itemMes.fontColor;
      }
      this.activeFlag = false;
    },
    handleClick() {
      this.clickFlag = !this.clickFlag;
      this.backColor = this.itemMes.backActiveColor;
      if (this.itemMes.activeFontColor) {
        this.fontColor = this.itemMes.activeFontColor;
      }
      this.$emit("checkChange", {
        checked: this.clickFlag,
        text: this.itemMes.text,
      });
    },
    checked() {
      this.clickFlag = true;
      this.backColor = this.itemMes.backActiveColor;
      if (this.itemMes.activeFontColor) {
        this.fontColor = this.itemMes.activeFontColor;
      }
    },
    unchecked() {
      this.clickFlag = false;
      this.backColor = this.itemMes.backNormalColor;
      this.fontColor = this.itemMes.fontColor;
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox-item {
  width: 100%;
  height: 100%;
  border: 1px solid #BEBEBE;
  border-radius: 2px;
  cursor: pointer;
  font-size: 12px;
  line-height: 24px;
  text-indent: 8px;
  position: relative;
  .check {
    position: absolute;
    top: 0;
    right: 0;
    width: 16px;
    height: 16px;
    font-size: 1rem;
    color: #bababa;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    &::before {
      position: absolute;
      content: "";
      top: 0;
      right: 0;
      width: 16px;
      height: 16px;
      border: 8px solid;
      border-color: #e6e6e6 #e6e6e6 transparent transparent;
    }
    > i {
      font-weight: 800;
      z-index: 1;
      margin-top: -4px;
    }
    &.active {
      color: white;
      &::before {
        position: absolute;
        content: "";
        top: 0;
        right: 0;
        width: 16px;
        height: 16px;
        border: 8px solid;
        border-color: #2080f7 #2080f7 transparent transparent;
      }
    }
  }
}
</style>