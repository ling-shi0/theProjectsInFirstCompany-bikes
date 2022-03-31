<template>
  <div class="pic-compare-pane">
    <div class="pic-compare-pane-item">
      <div class="pic-compare-pane-item-title">
        <div class="pic-compare-pane-item-title-img">1</div>
        图片比对位置
      </div>
      <div class="pic-compare-pane-item-pic">
        <h-img-view
          :src="picData && picData[0] && picData[0].picUrl"
          mode="adjust"
        >
          <div slot="defaultPlaceholder">
            <img src="@/assets/images/emptyPic.png" />
          </div>
        </h-img-view>
      </div>
      <div class="pic-compare-pane-item-info">
        <i class="h-icon-info_time fs20 color_999" style="font-size: 24px"></i>
        <div style="width: 35%">
          {{ picData[0] ? picData[0].passTime.substr(5) : "暂无" }}
        </div>
        <i
          class="h-icon-info_location fs20 color_999 por"
          style="font-size: 24px"
        ></i>
        <div>
          {{ (picData[0] && picData[0].placeAddress) || "暂无抓拍地点" }}
        </div>
      </div>
    </div>
    <div class="pic-compare-pane-item">
      <div class="pic-compare-pane-item-title">
        <div class="pic-compare-pane-item-title-img">2</div>
        图片比对位置
      </div>
      <div class="pic-compare-pane-item-pic">
        <h-img-view
          :src="picData && picData[1] && picData[1].picUrl"
          mode="adjust"
        >
          <div slot="defaultPlaceholder">
            <img src="@/assets/images/emptyPic.png" />
          </div>
        </h-img-view>
      </div>
      <div class="pic-compare-pane-item-info">
        <i class="h-icon-info_time fs20 color_999" style="font-size: 24px"></i>
        <div style="width: 35%">
          {{ picData[1] ? picData[1].passTime.substr(5) : "暂无" }}
        </div>
        <i
          class="h-icon-info_location fs20 color_999 por"
          style="font-size: 24px"
        ></i>
        <div>
          {{ (picData[1] && picData[1].placeAddress) || "暂无抓拍地点" }}
        </div>
      </div>
    </div>
    <div class="pic-compare-pane-button">
      <el-button @click="quit" type="info">退出图片比对</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "picCompare",
  props: {
    picData: {
      type: [Array, Object],
      default: () => [],
    },
  },
  watch: {
    picData(val) {
      console.log("sadfasdas");
      console.log(val);
    },
  },
  methods: {
    quit() {
      this.$emit("closePicCompare");
    },
  },
};
</script>

<style lang="scss" scope>
.pic-compare-pane {
  width: 100%;
  height: 100%;
  &-item {
    width: 437px;
    height: 339px;
    margin: 6px auto;
    border-bottom: 1px solid #e0e0e0;
    &-title {
      width: 100%;
      height: 40px;
      background: rgba(202, 237, 255, 0.3);
      border-radius: 2px;
      display: flex;
      align-items: center;
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      color: #000000;
      line-height: 40px;
      &-img {
        width: 44px;
        height: 28px;
        background: url(~@/assets/images/clueManage/picCompareNormal1.png);
        background-size: 100% 100%;
        margin: 5px 19px 7px 9px;
        text-align: center;
        line-height: 28px;
        color: #0056ae;
      }
    }
    &:nth-child(2) {
      margin-top: 16px;
      .pic-compare-pane-item-title {
        background: rgba(255, 237, 207, 0.3);
        &-img {
          background: url(~@/assets/images/clueManage/picCompareNormal2.png);
          background-size: 100% 100%;
          color: #c47a00;
        }
      }
    }
    &-pic {
      width: 437px;
      height: 250px;
      margin-top: 2px;
      background: #f8f8f8;
    }
    &-info {
      width: 100%;
      height: 32px;
      margin-top: 4px;
      background: rgba(216, 216, 216, 0.3);
      display: flex;
      align-items: center;
    }
  }
  &-button {
    width: 97%;
    display: flex;
    justify-content: flex-end;
    margin-top: 1em;
  }
}
</style>
