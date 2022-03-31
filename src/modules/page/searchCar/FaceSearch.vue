<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-31 10:38:34
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-15 15:16:40
-->
<template>
  <h-page-container class="search-car">
    <h-page-content>
      <header class="header">
        <el-popover
          placement="top-start"
          trigger="hover"
          width="160"
          popper-class="searchCar-upload-popover"
        >
          <p>
            只支持像素在256*256~900w内，文件大小在128字节~4M内，文件格式为.jpg/.jpeg/.png/.bmp的文件
          </p>
          <div slot="reference" style="position: relative">
            <el-upload
              ref="upload"
              action=""
              :http-request="handleRightButtonClick"
              :on-success="handleFileUploadSuccess"
              :on-error="handleFileUploadError"
              :on-remove="handleRemove"
              accept="image/*"
              list-type="picture-card"
              single-file
              class="upload-image"
            >
              <i class="h-icon-add"></i>
              <div class="upload-img-text">上传图片</div>
              <div class="hover-tip" v-show="url && rect">点击重选目标</div>
            </el-upload>
            <h-img-snippets-thumbnail
              v-if="url && rect"
              class="image"
              :rect="rect"
              :img-url="url"
              mode="contain"
              bg="gray"
              original
            />
          </div>
        </el-popover>
        <h-page-search
          ref="search"
          :model="search"
          label-position="left"
          :options="{
            xl: 2400,
            lg: 1500,
            md: 1100,
            sm: 720,
          }"
        >
          <h-page-search-item label="选择时段" prop="interval">
            <el-date-picker
              v-model="search.interval"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </h-page-search-item>
          <h-page-search-item label="最小相似度" prop="similarity"
            ><el-input
              v-model="search.similarity"
              @change="handleSimlarity"
            ></el-input>
          </h-page-search-item>
          <h-page-search-item label="选择范围" prop="range">
            <sui-select-point
              ref="selectPoint"
              inner-title="组织树"
              :request-data="requestTreeData"
              :parent-checkable="true"
              :show-map="true"
              :expand-on-checked="false"
              parent-key="orgIndexCode"
              :tree-props="treeProps"
              extraDesc="（默认全选）"
              @change="handleChange"
              style="width: 100%"
            ></sui-select-point>
          </h-page-search-item>
          <template slot="pageSearchAction">
            <el-button type="primary" @click="getData(true)">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </template>
        </h-page-search>
      </header>
      <!-- <section class="content"> -->
      <div class="cards" v-if="cars.length">
        <div class="extra">
          <el-button @click="positionMap"> 坐标定位 </el-button>
        </div>
        <el-scrollbar
          class="card-scrollbar"
          overflowX="hidden"
          wrap-class="scrollbar-wrap"
          view-class="scrollbar-view"
        >
          <div v-for="(item, index) in cars" :key="item.id">
            <h-img-result-card
              class="car-card"
              choosable
              show-title
              :is-choosed="item.isChoosed"
              @click-pic="
                showPreview = true;
                currentIndex = index;
              "
              @choose="
                item.isChoosed === undefined
                  ? $set(item, 'isChoosed', true)
                  : (item.isChoosed = !item.isChoosed)
              "
              :data="{
                pic: item.image,
                info: [
                  {
                    icon: 'h-icon-info_vs',
                    similarity: item.similarity,
                    content: Math.round(item.similarity * 1000) / 10 + '%',
                  },
                  {
                    icon: 'h-icon-info_location',
                    content: item.placeAddress,
                  },
                  {
                    icon: 'h-icon-info_time',
                    content: item.passTime,
                  },
                ],
                btns: [
                  {
                    icon: 'h-icon-info_time',
                    title: '以车搜车',
                    click(data) {
                      searchCar(data);
                    },
                  },
                ],
              }"
            >
              <template slot="info" slot-scope="{ item }">
                <i v-if="item.icon" :class="item.icon" />
                <label v-if="item.label" v-text="item.label" />
                <el-progress
                  style="display: inline-block"
                  v-if="item.similarity"
                  small
                  :show-text="false"
                  color="#3bcd8d"
                  :percentage="item.similarity * 100"
                ></el-progress>
                <span v-if="item.content" v-text="item.content" />
              </template>
            </h-img-result-card>
          </div>
        </el-scrollbar>
        <h-img-preview
          ref="showImgPreview"
          :data="cars"
          :visible.sync="showPreview"
          show-album
          :viewData.sync="viewData"
          :currentIndex="currentIndex"
          @on-change="onChangePreview"
          :album-props="{
            alwaysCenter: false,
          }"
        >
          <template slot="top" slot-scope="scope">
            <ul class="detail-list">
              <li>
                <i class="h-icon-info_vs icon"></i
                ><el-progress
                  small
                  :show-text="false"
                  color="#3bcd8d"
                  :percentage="scope.item.similarity * 100"
                ></el-progress>
                <p>
                  {{ Math.round(scope.item.similarity * 10000) / 100 + "%" }}
                </p>
              </li>
              <li>
                <i class="h-icon-info_location icon"></i>
                <p>{{ scope.item.placeAddress }}</p>
              </li>
              <li>
                <i class="h-icon-info_time icon"></i>
                <p>{{ scope.item.passTime }}</p>
              </li>
            </ul>
          </template>
          <template slot="btnGroup">
            <h-img-snippets-zoom
              :scale="viewData.ratio"
              @zoom-out="zoomOut"
              @zoom-in="zoomIn"
            />
            <el-button icon="h-icon-search" @click="reset">
              原始尺寸
            </el-button>
          </template>
          <template slot="imgCarouselItem" slot-scope="scope">
            <h-img-view
              :ref="`imgViewItem${scope.item.$$index}`"
              :src="scope.item.image"
            >
              <h-img-snippets-rect :rect="JSON.parse(scope.item.rect)"
            /></h-img-view>
          </template>
        </h-img-preview>
        <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handlePageNoChange"
          :current-page.sync="currentPageNo"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="currentPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <h-empty v-else size="md" description="暂无数据" />
      <!-- </section> -->
    </h-page-content>
    <multiple-display
      ref="multipleDisplay"
      :visible="multipleMapVisible"
      :lonlat="lonlat"
      @update:visible="updateMapVisible"
    ></multiple-display>
  </h-page-container>
</template>

<script>
import moment from "moment";
import helper from "@/helper";
import api from "@/api";
import rest from "@/rest";
import TargetImgUpload from "./target-img-upload";
import multipleDisplay from "@/components/map/multipleDisplay.vue";
import SuiSelectPoint from "@/components/selectPoint/selectPoint";
import { loadNode } from "@/utils/index.js";
import Vue from "vue";
import { isUndefined } from "@hui-pro/utils";
import Bus from "@/bus";

export default {
  name: "FaceSearch",
  data() {
    return {
      message: null,
      url: this.$route.query.faceUrl,
      search: {
        modelData: "",
        interval: [
          moment(new Date())
            .subtract(1, "months")
            .format("YYYY-MM-DD HH:mm:ss"),
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ],
        similarity: "80%",
        areaCode: "",
        cameraIndexCode: "",
      },
      selectArr: [],
      total: 0,
      currentPageNo: 1,
      currentPageSize: 20,
      currentIndex: 0,
      cars: [],
      showPreview: false,
      lonlat: [],
      multipleMapVisible: false,
      treeProps: {
        label: "name",
        children: "children",
        icon: "iconSkin",
        isLeaf: function (data) {
          return !data.parent;
        },
      },
      targetImgUpload: null,
      rect: null,
      viewData: {},
    };
  },
  components: {
    multipleDisplay,
    SuiSelectPoint,
  },
  methods: {
    createTargetImgUpload(opts, others) {
      if (this.targetImgUpload) {
        this.targetImgUpload.propsData = opts;
        if (!isUndefined(opts.slots)) {
          const { confirmText, cancelText } = opts.slots;
          if (!isUndefined(confirmText)) {
            this.targetImgUpload.$slots.confirmText = confirmText;
          }
          if (!isUndefined(cancelText)) {
            this.targetImgUpload.$slots.cancelText = cancelText;
          }
        }
        return this.targetImgUpload;
      }
      const ImgCtor = Vue.extend(TargetImgUpload);
      const imgCtorInstance = new ImgCtor({
        propsData: opts,
      });
      if (!isUndefined(opts.slots)) {
        const { confirmText, cancelText } = opts.slots;
        if (!isUndefined(confirmText)) {
          imgCtorInstance.$slots.confirmText = confirmText;
        }
        if (!isUndefined(cancelText)) {
          imgCtorInstance.$slots.cancelText = cancelText;
        }
      }
      imgCtorInstance.vm = imgCtorInstance.$mount();
      this.targetImgUpload = imgCtorInstance;
      return imgCtorInstance;
    },
    async handleRightButtonClick(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      this.message = this.$message("图片上传中");
      let request = rest.upload(api.searchCar.uploadPic, formData);
      return new Promise((resolve, reject) => {
        request
          .done((res) => {
            if (helper.isSuccess(res)) {
              // if (res.data) {
              resolve(res);
              // } else {
              //   this.message.close();
              //   this.$message.error("图片上传失败");
              // }
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
      // res.prototype.abort = request.abort;
      // console.log(res);
      // return res;
    },
    scan() {
      return new Promise((resolve, reject) => {
        rest
          .post(api.searchCar.faceBuildModel, { image: this.url })
          .done((res) => {
            if (helper.isSuccess(res)) {
              // res.data = [
              //   {
              //     rect:
              //       '{"x":0.577344,"width":0.103125,"y":0.234722,"height":0.391667}',
              //     modelData:
              //       "QMAlEAACBAMI/v0EAPsA/fz5DgH4A/0IC/v++wP9/QkI/fwCB/4E/gD+/fz/BAX8AQr9+ggD/AwKAe/1Afz9+gP+BwME/wf5/wEDA/X7BPwBBQQFBwUEAPfzAgEICAb6B/4F/fkACf4D+gkBAQv6BvMBBQIC/QEGDfsDBP4ACAPzB/0AAv379gEDAfn4/wAA/QUF+AP5/fwIAQXx/P8IBwH7DQEC//kE+gb5+wb7Av4G+wIAAwb9/wb8AfUG8/8D/QIHAfwKBgP69f8CAwUG9wUEAQPyBP8G/QwB/fkF/QYE+wIA+v0G/Q7+BAj7AP0P+gEBCggA/gUA/gEGBgP9BgL9//74BAYG/vUF/gIJ9QgDCPf6AQr/AQME///2/QYI/wT2Af/9/wb/BP/0AQcABgkD+QMAAf8BAwICAP0CCP4JBgEO/Pz9/AD//gMEBf0J///8+P0BBvMDDP4E/gT/Afv6BgD9+gH+Cf8LB/n4/fgFBPP6AP7//gL8/PgB9/IGAPoCCfkA/gYDAwEBDQX//P/3/P39/wEA/wn1/f4L/fgFAwMB/woEBAX8BAMBAP/8/AEB/vgA/PoE9fwA/Qn8BPIC+Qj/AQX9//4E+gQGB//6+vv/Bv36BP8EAQgGAQP+BwcFAwH5Bvn99v75Af///fgCAQP/BAED//8G/vj+Cvz49/j7+fg="
              //   }
              // ];
              if (res.data && res.data.length) {
                resolve({
                  face: res.data.map((item) => {
                    if (item.recommendFaceRect) {
                      const temp = JSON.parse(item.recommendFaceRect);
                      if (temp) {
                        if (temp.x) {
                          temp.left = temp.x;
                        }
                        if (temp.y) {
                          temp.top = temp.y;
                        }
                      }
                      item.rect = temp;
                    }
                    // Object.assign(item, JSON.parse(item.rect));
                    return item;
                  }),
                });
              } else {
                reject("未检测到人脸信息");
              }
            } else {
              reject(res.msg);
            }
          })
          .catch(() => {
            reject("未检测到人脸信息");
          });
      });
    },
    createImgUpload() {
      const instance = this.createTargetImgUpload({
        scan: this.scan,
        dataProps: {
          face: {
            key: "face",
            rect: {
              key: "rect",
              height: "height",
              width: "width",
              left: "left",
              top: "top",
            },
          },
        },
        types: ["face"],
        limitData: {
          total: 1,
        },
      });
      instance.$scan(this.url);
      instance.$on("on-confirm", this.handleConfirm);
      instance.$on("on-error", this.handleScanError);
      instance.$on("on-cancel", () => {
        if (this.$refs.upload) this.$refs.upload.clearFiles();
      });
    },
    handleScanError() {
      if (this.$refs.upload) this.$refs.upload.clearFiles();
    },
    async handleConfirm(data) {
      const select = data[0].rectData.face.filter((item) => item.$$active);
      if (select[0].model) {
        this.setImage(select[0]);
      } else {
        this.$message({
          type: "error",
          message: "所选取的图片建模失败",
        });
        if (this.$refs.upload) this.$refs.upload.clearFiles();
      }
    },
    setImage(item) {
      this.search.modelData = item.model;
      this.rect = item.rect;
    },
    handleFileUploadSuccess(res) {
      this.message.close();
      this.url = res.data;
      if (this.url) {
        this.$message.success("图片上传成功");
        this.createImgUpload();
      } else {
        if (this.$refs.upload) this.$refs.upload.clearFiles();
        this.$message({
          type: "error",
          message: "图片链接为空，请联系管理员",
        });
      }
    },
    handleFileUploadError(res) {
      if (this.$refs.upload) this.$refs.upload.clearFiles();
      this.message.close();
    },
    handleRemove() {
      this.rect = null;
      this.search.modelData = "";
    },
    handleReset() {
      this.$refs.search.getForm().resetFields();
      this.$set(this.search, "areaCode", "");
      this.$set(this.search, "cameraIndexCode", "");
      this.$refs.selectPoint && this.$refs.selectPoint.setValue({});
      // this.handleRemove();
    },

    getData(isUpdate) {
      // if (!this.search.modelData) {
      //   this.$message("请上传人脸图片");
      //   return;
      // }
      if (isUpdate === true) {
        this.currentPageNo = 1;
      }
      let { modelData, interval, similarity, areaCode, cameraIndexCode } =
        this.search;
      let [startTime, endTime] = interval;
      if (similarity.indexOf("%") === -1) {
        this.search.similarity += "%";
      }
      similarity = +similarity.replace("%", "");
      rest
        .post(api.searchCar.faceSearch, {
          startTime: moment(startTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          endTime: moment(endTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          areaCode,
          cameraIndexCode,
          similarity: similarity / 100,
          modelData,
          pageNo: this.currentPageNo,
          pageSize: this.currentPageSize,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            if (res.data && res.data.list && res.data.list.length) {
              res.data.list.forEach((item) => {
                item.type = 0;
                item.url = item.image;
                item.key = item.id;
                if (item.rect) {
                  const temp = JSON.parse(item.rect);
                  if (temp) {
                    let change = false;
                    if (temp.x) {
                      temp.left = temp.x;
                      delete temp.x;
                      change = true;
                    }
                    if (temp.y) {
                      temp.top = temp.y;
                      delete temp.y;
                      change = true;
                    }
                    if (change) item.rect = JSON.stringify(temp);
                  }
                }
              });
            }
            this.cars = (res.data && res.data.list) || [];
            this.total = (res.data && res.data.count) || 0;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    handlePageSizeChange(size) {
      if (this.currentPageSize !== size) {
        this.currentPageSize = size;
      }
      this.getData(false);
    },
    handlePageNoChange(currentPage) {
      if (this.currentPageNo !== currentPage) {
        this.currentPageNo = currentPage;
      }
      this.getData(false);
    },
    positionMap() {
      let choosedItems = this.cars.filter(
        (item) => item.isChoosed && item.longitude && item.latitude
      );
      if (choosedItems.length === 0) {
        this.$message.error("请勾选线索,或勾选的线索没有经纬度！", 3000);
        return;
      }
      this.multipleMapVisible = true;
      this.lonlat = choosedItems;
    },
    updateMapVisible(sta) {
      this.multipleMapVisible = sta;
    },
    requestTreeData(params) {
      return loadNode(params);
    },
    handleChange(nameValue, keyValue, nodes) {
      let cameraIndexCode = [];
      let areaCode = [];
      nodes.forEach((item) => {
        if (!item.parent) {
          cameraIndexCode.push(item.id || item.indexCode);
        } else {
          areaCode.push(item.id || item.indexCode);
        }
      });
      this.$set(this.search, "areaCode", areaCode.join(","));
      this.$set(this.search, "cameraIndexCode", cameraIndexCode.join(","));
    },
    zoomIn(type) {
      this.$nextTick(() => {
        this.$refs[`imgViewItem${this.currentIndex}`].$zoomIn();
      });
    },
    zoomOut(type) {
      this.$nextTick(() => {
        this.$refs[`imgViewItem${this.currentIndex}`].$zoomOut();
      });
    },
    reset() {
      this.$refs[`imgViewItem${this.currentIndex}`].$reset();
    },
    onChangePreview(item, index) {
      this.currentIndex = index;
    },
    searchCar(data) {
      Bus.$emit("changeTab", {
        props: data.pic,
        tabName: "car",
      });
    },
    handleSimlarity(val) {
      val = val.replace("%", "");
      if (+val > 100) {
        this.search.similarity = "100";
      } else if (+val === 0 || !val || +val < 0) {
        this.search.similarity = "0";
      } else {
        this.search.similarity = +val + "";
      }
    },
  },
};
</script>

<style lang="scss">
.search-car {
  height: 100% !important;
  .header {
    flex: none;
    width: 100%;
    height: 127px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    padding: 12px 0;
    padding-left: 12px;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
    & > .h-page-search {
      flex: 1;
      border: none;
      .el-form {
        margin: 0;
      }
      .el-form-item {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
      }
      .el-form-item__content {
        flex: 1;
        & > * {
          width: 100%;
          max-width: none;
        }
      }
    }
  }
  .upload-image {
    width: 102px;
    height: 102px;
    .el-upload {
      // font-size: 12px;
      // width: 72px;
      // height: 72px;
      padding: 3px;
      background-clip: content-box;
      i {
        margin-top: 16px;
      }
    }
  }
  .card-scrollbar {
    .scrollbar-wrap {
      overflow-x: hidden;
      height: 100%;
      .scrollbar-view {
        padding-top: 8px;
        padding-left: 8px;
        display: grid;
        grid-template-columns: repeat(auto-fill, 230px);
        justify-content: space-evenly;
        align-items: center;
      }
    }
  }
  .car-card .h-image-result-card__item-info i {
    font-size: 24px;
  }
  .uploading-close {
    z-index: 1;
  }
}
.searchCar-upload-popover {
  padding: 5px;
}
.h-image-result-card__item-btns-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss" scoped>
.h-page-content {
  padding: 0;
  display: flex;
  flex-flow: column nowrap;
}
.content {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 8px;
  height: 0;
  flex: 1;
}
.cards {
  display: flex;
  flex-flow: column nowrap;
  height: calc(100% - 130px);
  flex: 1;
  background-color: #fff;
}
.extra {
  width: calc(100% - 16px);
  padding: 8px;
  margin: 0 8px;
  border-bottom: 1px solid #e5e5e5;
}
.card-scrollbar {
  flex: 1;
}
.el-pagination {
  padding: 0 12px;
  border-top: 1px solid #e5e5e5;
}
.car-card {
  margin-right: 8px;
  margin-bottom: 8px;
}
.detail-list {
  line-height: 24px;
  display: flex;
  flex-flow: row nowrap;
  & > li {
    display: flex;
    flex-flow: row nowrap;
    margin-right: 16px;
  }
}
.icon {
  font-size: 24px;
  height: 24px;
  width: 24px;
}
.el-progress {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
}
.image {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.hover-tip {
  width: 100%;
  height: 20px;
  position: absolute;
  z-index: 1000;
  left: 0;
  bottom: 0;
  font-size: 14px;
  line-height: 20px;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  color: #fff;
}
</style>
