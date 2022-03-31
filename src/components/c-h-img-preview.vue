<template>
  <div>
    <h-img-preview
      ref="hImgPreview"
      :visible.sync="imgPreview.dark"
      :data="imgPreview.urls"
      :currentIndex="imgPreview.currentIndex"
      :viewData.sync="imgPreview.viewData"
      @on-change="handleChange"
      @on-closed="handleOnClose"
      show-album
    >
      <template slot="top" slot-scope="scope">
        <div v-if="imgPreview.pageType == 'clusterAnalysis'">
          <h4
            class="h-img-preview__title"
          >抓拍时间：{{ scope.item.passTime ? scope.item.passTime : "暂无" }}</h4>
          <h4 class="h-img-preview__description">
            抓拍点位：{{
            scope.item.cameraName ? scope.item.cameraName : "暂无"
            }}
          </h4>
        </div>
        <div v-if="imgPreview.pageType == 'researchReport'">
          <h4
            class="h-img-preview__title"
          >抓拍时间：{{ scope.item.passTime ? scope.item.passTime : "暂无" }}</h4>
          <h4 class="h-img-preview__description">
            抓拍点位：{{
            scope.item.placeAddress ? scope.item.placeAddress : "暂无"
            }}
          </h4>
        </div>
        <div v-if="imgPreview.pageType == 'clueSearch'">
          <h4 class="h-img-preview__title">
            抓拍时间：{{
            scope.item.createTime ? scope.item.createTime : "暂无"
            }}
          </h4>
          <h4 class="h-img-preview__description">
            抓拍点位：{{
            scope.item.collect_address ? scope.item.collect_address : "暂无"
            }}
          </h4>
        </div>
      </template>
      <template slot="btnGroup" slot-scope="data">
        <el-button icon="h-icon-search" @click="imgPreviewPrev">上一个</el-button>
        <el-button icon="h-icon-search" @click="imgPreviewNext">下一个</el-button>
        <h-img-snippets-zoom
          @zoom-out="zoomOut"
          @zoom-in="zoomIn"
          :scale="imgPreview.viewData.ratio"
        />
        <el-button icon="h-icon-search" @click="imgPreviewReset">适当尺寸</el-button>
        <el-button
          type="primary"
          size="small"
          @click="addToClueList(data, imgPreview.pageType)"
          v-if="
            imgPreview.pageType == 'clueSearch' ||
              imgPreview.pageType == 'clusterAnalysis'
          "
        >加入线索集</el-button>
      </template>
    </h-img-preview>
  </div>
</template>

<script>
import api from "@/api";
import rest from "@/rest";
import helper from "@/helper";
export default {
  data() {
    return {
      imgPreview: {
        dark: false,
        urls: [],
        currentIndex: 0,
        viewData: {},
        ref: null,
        pageType: null, // 页面类型
        requestUrl: "", //无限下一张时需要进行请求的url
        requestObj: {}, //请求时有关分页的信息传参
        lastIndex: 0, //上一次父组件进行翻页操作时的index
        lastFlag: false,
      },
      startPageNo: 0,
    };
  },
  methods: {
    imgPreviewShow(list, index, pageType, requestUrl, requestObj) {
      this.imgPreview.urls = list;
      this.imgPreview.dark = true;
      this.imgPreview.pageType = pageType;
      this.imgPreview.currentIndex = index;
      this.imgPreview.requestUrl = requestUrl;
      //let tempObj = JSON.parse(JSON.stringify(requestObj)); //防止因为引用类型的调用影响了父组件的显示(会造成父组件进行下一页的切换)
      // this.imgPreview.requestObj = tempObj;
      // this.startPageNo = tempObj.pageNo;
    },
    imgPreviewPrev() {
      this.$refs.hImgPreview.$prev();
    },
    imgPreviewNext() {
      this.$refs.hImgPreview.$next();
    },
    selected(index) {
      this.$refs.hImgPreview.$selected(index);
    },
    handleOnChange(item, index) {
      this.reset();
    },
    zoomIn(type) {
      this.$refs.hImgPreview.$zoomIn();
    },
    zoomOut(type) {
      this.$refs.hImgPreview.$zoomOut();
    },
    imgPreviewReset() {
      this.$refs.hImgPreview.$resetImgView();
    },
    // 加入到线索管理
    addToClueList(data, pageType) {
      let that = this;
      let paramsList = [];
      let params = {};
      if (data.item.hasAddToClue === 1) {
        that.$message.info("线索已经添加！");
        return false;
      }
      if (pageType === "clueSearch") {
        params = {
          certificateNumber: data.item.certificateNumber,
          humanId: data.item.humanId,
          rowKey: data.item.rowKey,
          picUrl: data.item.url,
          passTime: data.item.createTime,
          placeAddress: data.item.collect_address,
          longitude: data.item.longitude,
          latitude: data.item.latitude,
          clueSource: 3,
          clueType: 1,
        };
      } else {
        params = {
          certificateNumber: data.item.certificateNumber,
          humanId: data.item.humanId,
          rowKey: data.item.rowKey,
          picUrl: data.item.url,
          passTime: data.item.passTime,
          placeAddress: data.item.cameraName,
          longitude: data.item.longitude,
          latitude: data.item.latitude,
          clueSource: 3,
          clueType: 1,
        };
      }
      paramsList.push(params);
      if (paramsList.length == 0) {
        that.$message.info("请选择线索！");
      } else {
        rest
          .post(api.clueSearch.saveOnlineClue, paramsList)
          .done(function (res) {
            if (helper.isSuccess(res)) {
              that.$message.success("添加成功! ");
            } else {
              that.$message.error(res.msg);
            }
          });
      }
    },
    handleChange(data, index) {
      //监控图片切换，以及添加下一页图片或上一页图片
      // let _this = this;
      // if (this.imgPreview.lastFlag) {
      //   this.imgPreview.lastIndex = this.imgPreview.currentIndex;
      // }
      // this.imgPreview.lastFlag = true;
      // this.imgPreview.currentIndex = index;
      // if (index === this.imgPreview.urls.length - 1) {
      //   //当前项为已有数组中的最后一项
      //   this.imgPreview.requestObj.pageNo++;
      //   rest
      //     .post(_this.imgPreview.requestUrl, _this.imgPreview.requestObj)
      //     .done(function (res) {
      //       if (helper.isSuccess(res)) {
      //         let temp = _this.imgPreview.urls;
      //         res.data.list.forEach(item => {
      //           item.url =
      //             _this.imgPreview.pageType === "clueSearch"
      //               ? item.target_pic_url
      //               : item.image;
      //         });
      //         temp = temp.concat(res.data.list);
      //         _this.imgPreview.urls = temp;
      //       } else {
      //         _this.$message.error(res.msg);
      //       }
      //     });
      //   this.imgPreview.requestObj.pageNo--; //又减一的原因是因为调整页数的工作已经交给了watch部分在持续观察，为了请求下一页上面加了一，这里不多于加一
      // } else if (index === 0 && this.startPageNo > 1) {
      //   this.imgPreview.requestObj.pageNo--;
      //   this.startPageNo--;
      //   rest
      //     .post(_this.imgPreview.requestUrl, _this.imgPreview.requestObj)
      //     .done(function (res) {
      //       if (helper.isSuccess(res)) {
      //         let temp = _this.imgPreview.urls;
      //         res.data.list.forEach(item => {
      //           item.url =
      //             _this.imgPreview.pageType === "clueSearch"
      //               ? item.target_pic_url
      //               : item.image;
      //         });
      //         temp = res.data.list.concat(temp);
      //         _this.imgPreview.urls = temp;
      //         _this.imgPreview.currentIndex += 20;
      //       } else {
      //         _this.$message.error(res.msg);
      //       }
      //     });
      //   this.imgPreview.requestObj.pageNo++; //原因和上面相同
      // }
    },
    handleOnClose() {
      this.$emit("getCloseMes", this.imgPreview.currentIndex);
    },
  },
  computed: {
    getCurrentIndex() {
      return this.imgPreview.currentIndex;
    },
  },
  watch: {
    getCurrentIndex() {
      //下面的变量代表页数差值，是当前页面和上一次的页面的页面差值
      let pageNum =
        Math.floor(this.imgPreview.currentIndex / 20) -
        Math.floor(this.imgPreview.lastIndex / 20);
      if (this.imgPreview.requestObj.pageNo) {
        if (this.imgPreview.currentIndex > this.imgPreview.lastIndex) {
          this.imgPreview.requestObj.pageNo += Math.abs(pageNum);
        } else {
          this.imgPreview.requestObj.pageNo -= Math.abs(pageNum);
        }
      }
      if (Math.floor(this.imgPreview.currentIndex / 20) === 0) {
        pageNum = this.startPageNo - this.imgPreview.requestObj.pageNo;
        this.imgPreview.requestObj.pageNo = this.startPageNo;
      }
      pageNum =
        this.startPageNo + Math.floor(this.imgPreview.currentIndex / 20);
      this.$emit("goToOnePage", pageNum);
    },
  },
};
</script>

<style lang="scss">
.h-img-preview__wrapper {
  .h-img-carousel__prev,
  .h-img-carousel__next {
    border: none;
  }
}
</style>
