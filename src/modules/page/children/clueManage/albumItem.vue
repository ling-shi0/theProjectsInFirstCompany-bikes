<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-06-16 15:29:39
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-16 17:02:14
-->
<template>
  <div
    class="album"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <h-img-view :src="itemData.url" :title="itemData.title" mode="fill" />
    <div class="album-item" @click.stop="flagChange">
      <img :src="imgSrc" alt />
    </div>
  </div>
</template>

<script>
import icon1 from "@/assets/images/clueManage/hook_icon_01.png";
import icon2 from "@/assets/images/clueManage/hook_icon_02.png";
import icon3 from "@/assets/images/clueManage/hook_icon_03.png";
export default {
  name: "AlbumItem",
  data() {
    return {
      imgSrc: icon1,
      activeStatus: false,
      flag: false,
    };
  },
  mounted() {
    this.flag = this.itemFlag;
  },
  props: {
    itemData: Object,
    itemFlag: Boolean,
  },
  watch: {
    itemFlag(val) {
      this.flag = val;
    },
    flag(val) {
      this.imgSrc = val ? icon3 : icon1;
    },
    activeStatus(val) {
      this.imgSrc = val ? icon2 : icon1;
      this.flag && (this.imgSrc = icon3);
    },
  },
  methods: {
    flagChange() {
      this.$emit("flagChange", this.flag);
    },
    handleMouseEnter() {
      this.activeStatus = true;
    },
    handleMouseLeave() {
      this.activeStatus = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.album {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%; /*以下开始放大热区*/
  height: 100%;
  z-index: 100;
  .album-item {
    position: absolute;
    top: 0;
    right: 0;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    & > img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
