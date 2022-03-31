<template>
  <div class="item-out">
    <div
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      :class="activeStatus ? 'item_in active' : 'item_in'"
      :style="flag ? 'outline: 1px solid #409eff;' : ''"
      draggable="true"
      @dragstart="handleDragStart"
      @drag="dragMove"
      @dragend="dragFlag = false"
    >
      <div class="">
        <div class="item_in_img">
          <slot name="img"></slot>
        </div>
        <div class="item_in-info">
          <slot name="info"></slot>
        </div>
        <div class="item_in-overflow">
          <slot name="overflow"></slot>
        </div>
        <div
          class="item_in_hookWrap"
          v-if="!hasAddToClue"
          @click.stop="flagChange"
        >
          <img :src="imgSrc" alt />
        </div>
        <transition name="fade">
          <div class="item_in-picCompare" v-if="picCompareSend">
            <div class="item_in-picCompare-title">发送到图片比对位置</div>
            <div class="item_in-picCompare-location" @click="sendToCompare(1)">
              1
            </div>
            <div class="item_in-picCompare-location" @click="sendToCompare(2)">
              2
            </div>
          </div>
        </transition>
        <div class="item_in-alreadyAdd" v-if="hasAddToClue">已添加</div>
      </div>
    </div>
  </div>
</template>

<script>
import icon1 from "@/assets/images/clueManage/hook_icon_01.png";
import icon2 from "@/assets/images/clueManage/hook_icon_02.png";
import icon3 from "@/assets/images/clueManage/hook_icon_03.png";
import Bus from "@/bus";

export default {
  name: "clueManageCardListItem",
  props: ["hasAddToClue", "itemFlag"],
  data() {
    return {
      activeStatus: false,
      flag: false,
      imgSrc: icon1,
      picCompareSend: false,
      picCompareFlag: false,
      dragFlag: false,
    };
  },
  mounted() {
    Bus.$on("picCompareFlag", (data) => {
      this.picCompareFlag = data;
    });
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
      this.flag = !this.flag;
      this.$emit("flagChange");
    },
    handleMouseEnter() {
      this.activeStatus = true;
      this.picCompareFlag && (this.picCompareSend = true);
      !this.picCompareFlag && (this.picCompareSend = false);
    },
    handleMouseLeave() {
      this.activeStatus = false;
      this.dragFlag = false;
      this.picCompareFlag && (this.picCompareSend = false);
      !this.picCompareFlag && (this.picCompareSend = false);
    },
    sendToCompare(type) {
      this.$emit("sendToCompare", type);
    },
    dragMove(e) {
      if (!this.dragFlag) {
        return;
      }
      let scrollPane = document.getElementById("car-model-pane-wrap"); //滚动条部分
      if (e.screenY >= 990) {
        scrollPane.scrollTop += 8;
      }
      if (e.screenY <= 150) {
        scrollPane.scrollTop -= 8;
      }
    },
    handleDragStart() {
      this.dragFlag = true;
      this.flag = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.item-out {
  position: relative;
  width: 216px;
  height: 240px;
  margin: 0 6px 36px;
  &:hover {
    z-index: 1000;
  }
  .item_in {
    width: 100%;
    height: 100%;
    outline: 1px solid #ccc;
    overflow: hidden;
    animation: close 0.3s;
    animation-fill-mode: forwards;
    background: #fff;
    transition: all 0.5s;
    z-index: -1;
    &_img {
      height: 150px;
      width: 220px;
    }
    &-info {
      width: 220px;
      height: 70px;
      margin-top: 20px;
    }
    &-overflow {
      width: 220px;
      height: 90px;
    }
    &_hookWrap {
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      width: 5rem; /*以下开始放大热区*/
      height: 5rem;
      z-index: 100;
      & > img {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    &-picCompare {
      position: absolute;
      top: 0;
      left: 0;
      width: 220px;
      height: 158px;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      color: white;
      &-title {
        width: 220px;
        height: 26px;
        text-align: center;
        margin-top: 60px;
      }
      &-location:nth-child(2) {
        width: 44px;
        height: 28px;
        background: url(~@/assets/images/clueManage/picCompareNormal1.png);
        background-size: 100% 100%;
        margin-bottom: 60px;
        margin-right: 1em;
        cursor: pointer;
        text-align: center;
        line-height: 28px;
        &:hover {
          background: url(~@/assets/images/clueManage/picCompareClick1.png);
          background-size: 100% 100%;
        }
      }
      &-location:last-child {
        width: 44px;
        height: 28px;
        background: url(~@/assets/images/clueManage/picCompareNormal2.png);
        background-size: 100% 100%;
        margin-bottom: 60px;
        margin-left: 1em;
        cursor: pointer;
        text-align: center;
        line-height: 28px;
        &:hover {
          background: url(~@/assets/images/clueManage/picCompareClick2.png);
          background-size: 100% 100%;
        }
      }
    }
    &-alreadyAdd {
      position: absolute;
      top: 0;
      left: 0;
      background: #f3c486;
      border-radius: 0 10px 10px 0;
      padding: 0 8px;
      display: inline-block;
      color: #000;
    }
    &.active {
      box-shadow: 2px 2px 10px 2px #999;
      animation: open 0.4s;
      animation-fill-mode: forwards;
    }
  }
}
@keyframes open {
  from {
  }
  to {
    height: 330px;
    position: absolute;
    z-index: 1000;
  }
}
@keyframes close {
  from {
    height: 330px;
    position: absolute;
    z-index: 1000;
  }
  to {
    height: 240px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active, 2.1.8 版本以下 */ {
  opacity: 0;
}
</style>
