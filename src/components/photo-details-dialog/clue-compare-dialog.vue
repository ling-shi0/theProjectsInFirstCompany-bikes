<!--
 * @Description:
 * @Version:
 * @Author: wangXiaoMing
 * @Date: 2022-02-16 15:28:44
 * @LastEditors: DengDu
 * @LastEditTime: 2022-03-21 09:44:09
-->
<template>
  <div>
    <el-dialog
      title="线索详情"
      :visible="visible"
      :area="[1200, 650]"
      top="middle"
      class="pic-compare-dialog"
      @close="close"
    >
      <div class="info-and-video">
        <!-- <div class="title-and-info">
        <div class="left">
          <div class="title">
            <h4>上传视频</h4>
            <span></span>
          </div>
          <div class="info">
            <el-row :gutter="10">
              <el-col :span="24">
                文件名称：{{fileName}}
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="right">
          <div class="title">
            <h4>比中视频</h4>
            <span>{{currentHumanInfo && currentHumanInfo.name}}</span>
          </div>
          <div class="info">
            <el-row :gutter="10">
              <el-col :span="8" :title="currentHumanInfo && currentHumanInfo.certificateNumber">
                身份证号：{{(currentHumanInfo && currentHumanInfo.certificateNumber) || '未知'}}
              </el-col>
              <el-col :span="8" :title="currentHumanInfo && currentHumanInfo.libName">
                采集地点：{{(currentHumanInfo && currentHumanInfo.libName) || '未知'}}
              </el-col>
              <el-col :span="8" :title="currentHumanInfo && currentHumanInfo.collectTime">
                采集时间：{{(currentHumanInfo && currentHumanInfo.collectTime) || '未知'}}
              </el-col>
            </el-row>
          </div>
        </div>
      </div> -->
        <div class="video">
          <div class="left">
            <h-img-view
              ref="carsoul"
              :view-data.sync="viewData"
              :src="targetImg"
              mode="adjust"
            >
              <h-img-snippets-rect
                v-if="dialogData.list"
                :rect="getItemRect(targetRect)"
              />
            </h-img-view>
            <div class="lr-div">原图 (共1张)</div>
            <h-img-snippets-btn-group class="clue-btnGroup">
              <h-img-snippets-zoom
                :scale="viewData.ratio"
                @zoom-out="zomOut"
                @zoom-in="zomIn"
              />
            </h-img-snippets-btn-group>
          </div>

          <div class="right">
            <h-img-view
              ref="view"
              :view-data.sync="vwData"
              style="width: 100%; height: 100%"
              :src="currentImg"
              mode="adjust"
            >
              <h-img-snippets-rect
                v-if="dialogData.list"
                :rect="
                  getItemRect(JSON.parse(dialogData.list[currentIndex].rect))
                "
              />
            </h-img-view>
            <div class="lr-div">抓拍对比</div>
            <h-img-snippets-btn-group class="clue-btnGroup">
              <h-img-snippets-zoom
                :scale="vwData.ratio"
                @zoom-out="zoomOut"
                @zoom-in="zoomIn"
              />
            </h-img-snippets-btn-group>
          </div>
        </div>
        <!-- 两张图片之间的一根线 -->
        <div
          style="
            width: 1px;
            height: 347px;
            border: 1px solid #e0e0e0;
            position: absolute;
            top: 22px;
            left: 586px;
          "
        ></div>

        <div class="similarity">
          <div class="img-box">
            <span>{{ itemSimilarity + "%" }}</span>
          </div>
        </div>
        <!-- <div class="similarity">
          <div class="img-box">
            <span>{{ itemSimilarity + "%" }}</span>
          </div>
        </div> -->
        <div class="album-title">
          共
          <span>{{ dialogData && dialogData.list && dialogData.list.length }}</span>
          条线索
        </div>
        <div class="album">
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
            <template slot="item" slot-scope="{ item }">
              <div class="custom-item" mode="fill">
                <img :src="item.image" class="img" />
              </div>
            </template>
            <!-- <template slot="item" slot-scope="{ item }">
              <div class="custom-item" mode="fill">
                <img :src="targetImg" class="img" />
                <div style="border:1px solid #fff"></div>
                <img :src="item.image" class="img" />
                <img :src="circleGaitIcon" class="similarity-icon" />
                <span class="similarity-text">{{
                  parseInt(item.similarity * 100) + "%"
                }}</span>
              </div>
            </template> -->
          </h-album>
        </div>
      </div>
      <div class="line"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveClueInfo">确定</el-button>
        <el-button @click="close">取消</el-button>
      </span>
    </el-dialog>
    <div class="info-switch-angles" v-if="visible">
      <div class="angles-left">
        <i class="h-icon-angle_left" @click="turnPrev"></i>
      </div>
      <div class="angles-right">
        <i class="h-icon-angle_right" @click="turnNext"></i>
      </div>
    </div>
  </div>
</template>

<script>
import circleGaitIcon from "@/assets/images/carSearch/car-similarity.png";

export default {
  name: "clueCompareDialog",
  props: {
    visible: {
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
      circleGaitIcon,
      currentIndex: this.dialogData.currentIndex || 0,
      viewData: {},
      vwData: {},
      scale: null,
      targetRect:"",
    };
  },
  computed: {
    targetImg() {
      this.targetRect = this.dialogData.targetRect
      return this.dialogData.targetImg;
    },
    currentImg() {
      const { list, currentIndex } = this.dialogData;
      if (list && list.length && currentIndex >= 0) {
        return list[currentIndex].image;
      } else {
        return "";
      }
    },
    itemSimilarity() {
      const { list, currentIndex } = this.dialogData;
      if (list && list.length && currentIndex >= 0) {
        return Math.ceil(list[currentIndex].similarity * 100);
      } else {
        return "";
      }
    },
  },
  methods: {
    zoomIn(type) {
      this.$refs.view.$zoomIn();
    },
    zoomOut(type) {
      this.$refs.view.$zoomOut();
    },
    reset() {
      this.$refs.view.$resetView();
      this.scale = 1;
    },
    zomIn(type) {
      this.$refs.carsoul.$zoomIn();
    },
    zomOut(type) {
      this.$refs.carsoul.$zoomOut();
    },
    rset() {
      this.$refs.carsoul.$resetView();
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
      // console.log(item);
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


<style lang="scss" scoped>
.clue-btnGroup {
  width: 100%;
  height: 40px;
  position: relative;
  bottom: 25px;
}
.pic-compare-dialog {
  .info-and-video {
    width: 100%;
    height: 100%;
    padding: 0 10px;
  }
  .video {
    width: 100%;
    height: 360px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .left,
    .right {
      width: calc(50% - 15px);
      height: 360px;
    }
    .lr-div {
      position: relative;
      bottom: 22px;
      width: 100%;
      height: 30px;
      background-color: #000000;
      opacity: 0.7;
      color: #ffffff;
      text-align: center;
      line-height: 30px;
    }
  }
  .similarity {
    position: absolute;
    top: 140px;
    left: 538px;
    width: 100px;
    height: 100px;
    // display: flex;
    // justify-content: center;
    // margin: 8px 0 0 0;
    .img-box {
      width: 100%;
      height: 100%;
      line-height: 100px;
      text-align: center;
      background-image: url("~@/assets/images/carSearch/car-c.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      color: #fff;
      font-size: 25px;
      font-weight: 600;
    }
  }
  .line {
    width: 100%;
    background-color: #f5f5f5;
    height: 8px;
    position: realative;
    margin-top: 46px;
  }
  .album-title {
    position: absolute;
    bottom: 82px;
    left: 0;
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
    width: 99%;
    .custom-item {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      position: relative;
      .img {
        width: 84px;
        height: 84px;
      }
      // .similarity-icon {
      //   width: 56px;
      //   height: 56px;
      //   position: absolute;
      //   top: calc(50% - 28px);
      //   left: calc(50% - 28px);
      // }
      // .similarity-text {
      //   width: 56px;
      //   height: 30px;
      //   line-height: 30px;
      //   text-align: center;
      //   position: absolute;
      //   top: calc(50% - 22px);
      //   left: calc(50% - 28px);
      //   color: #fff;
      //   background: none;
      // }
    }
  }
  .info-switch-angles {
    position: absolute;
  }
}
.info-switch-angles {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 710px;
  pointer-events: none;
  .angles-left,
  .angles-right {
    width: 130px;
    height: 100%;
    color: #eee;
    font-size: 10rem;
    line-height: 710px;
    pointer-events: all;
    > i {
      cursor: pointer;
    }
  }
}
</style>

<style lang="scss">
.pic-compare-dialog {
  .el-dialog {
    margin-bottom: 0;
  }
  .album {
    padding: 0;
    .h-album__item {
      width: 100%;
      height: 100%;
      &.is-active {
        border: 4px solid #2080f7;
      }
    }
  }
}
</style>