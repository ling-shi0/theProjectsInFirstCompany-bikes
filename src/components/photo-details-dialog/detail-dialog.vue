<template>
  <el-dialog
    :visible="visible"
    :area="[1200, 650]"
    top="middle"
    class="clue-dialog"
    @close="close"
  >
    <div class="clue-preview">
      <div>
        <!--轮播图切换-->
        <h-img-view
          ref="carousel"
          style="width: 100%; height: 100%"
          :src="currentImg"
          mode="adjust"
          @on-change="
            (item, index) => {
              currentIndex = index;
            }
          "
        >
          <h-img-snippets-rect
            v-if="dialogData.list"
            :rect="getItemRect(JSON.parse(dialogData.list[currentIndex].rect))"
          />
        </h-img-view>

        <!-- <h-img-carousel
          ref="carousel"
          class="clue-preview-carousel"
          theme="dark"
          :data="dialogData.list"
          :view-data.sync="viewData"
          :current-index.sync="dialogData.currentIndex"
        >
        <h-img-snippets-rect
            v-if="dialogData.list"
            :rect="getItemRect(JSON.parse(dialogData.list[currentIndex].rect))"
          />
        </h-img-carousel> -->

        <!--工具集-->
        <h-img-snippets-btn-group theme="light-gray" class="clue-btnGroup">
          <h-img-snippets-zoom
            :scale="viewData.ratio"
            @zoom-out="zoomOut"
            @zoom-in="zoomIn"
          />
          <el-button class="suit-size" @click="reset"
            >&nbsp;&nbsp;合适尺寸</el-button
          >
        </h-img-snippets-btn-group>
      </div>
    </div>

    <div class="info-switch-angles" v-if="visible">
      <div class="angles-left">
        <i class="h-icon-angle_left" @click="turnPrev"></i>
      </div>
      <div class="angles-right">
        <i class="h-icon-angle_right" @click="turnNext"></i>
      </div>
    </div>

    <div class="album-title">
      共
      <span>{{ dialogData.list.length }}</span>
      条线索
    </div>
    <div class="album-fill">
      <!--相册-->
      <h-album
        :data="dialogData.list"
        mode="fill"
        theme="light"
        ref="album"
        class="album"
        :shadow="false"
        :current-index.sync="dialogData.currentIndex"
        @on-change="
          (item, index) => {
            currentIndex = index;
          }
        "
      >
      </h-album>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveClueInfo">确定</el-button>
      <el-button @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "detailDialog",
  props: {
    visible: {
      // 弹框显隐
      type: Boolean,
      default: false,
    },
    dialogData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentIndex: this.dialogData.currentIndex || 0,
      viewData: {},
      scale: null,
    };
  },
  computed: {
    currentImg() {
      const { list, currentIndex } = this.dialogData;
      if (list && list.length && currentIndex >= 0) {
        return list[currentIndex].image;
      } else {
        return "";
      }
    },
  },
  methods: {
    zoomIn(type) {
      this.$refs.carousel.$zoomIn();
    },
    zoomOut(type) {
      this.$refs.carousel.$zoomOut();
    },
    reset() {
      this.$refs.carousel.$resetView();
      this.scale = 1;
    },
    saveClueInfo() {
      this.close();
    },
    close() {
      this.$emit("closeDialog");
    },
    turnPrev() {
      // 这么做不好 不该在子组件里面改父组件prop的值 但lazy了 就这样吧 后续再说吧
      if (this.dialogData.currentIndex > 0) this.dialogData.currentIndex--;
    },
    turnNext() {
      const { list } = this.dialogData;
      if (list && list.length && this.dialogData.currentIndex < list.length - 1)
        this.dialogData.currentIndex = this.dialogData.currentIndex + 1;
    },
    getItemRect(item) {
      return {
        top: (item && item.top) || 0,
        left: (item && item.left) || 0,
        width: (item && item.width) || 0,
        height: (item && item.height) || 0,
      };
    },
  },
};
</script>

<style lang="scss" scope>
.clue-preview {
  width: 100%;
  height: 420px;
  display: flex;
  margin-top: 15px;
  > div {
    width: 100%;
    display: flex;
    flex-direction: column;
    .clue-preview-carousel {
      flex: 1;
      width: 100%;
    }
    .clue-btnGroup {
      width: 100%;
      height: 40px;
      margin-top: 10px;
      border-bottom: #e6e6e6 1px solid;
      border-top: #e6e6e6 1px solid;
    }
  }
}
.info-switch-angles {
  position: absolute;
  bottom: 50%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  pointer-events: none;
  .angles-left,
  .angles-right {
    color: #eee;
    font-size: 5rem;
    pointer-events: all;
    > i {
      cursor: pointer;
    }
  }
}
.album-title {
  position: absolute;
  bottom: 80px;
  height: 42px;
  width: 100%;
  line-height: 42px;
  text-indent: 39px;
  font-family: MicrosoftYaHeiUI;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
  letter-spacing: 0;
  > span {
    color: #ec7f12;
  }
}
.album {
  width: 100%;
  position: absolute;
  bottom: 0;
  .h-album__item {
    &.is-active {
      border: 3px solid #2080f7;
    }
  }
}
.custom-item {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  position: relative;
  .img {
    width: 70px;
    height: 70px;
  }
}
.clue-dialog .el-dialog__body {
  padding: 0;
}

.suit-size {
  background: rgba(0, 0, 0, 0);
  border: none;
  display: flex;
  align-items: center;
  padding-left: 0.3rem;
  width: 6em;
  &::before {
    content: url(~@/assets/images/clueManage/suit-size-icon.png);
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-top: -4px;
  }
}
</style>

