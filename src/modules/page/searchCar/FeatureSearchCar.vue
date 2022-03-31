<!--
 * @Description:
 * @Version:
 * @Author: wangXiaoMing
 * @Date: 2022-02-09 10:47:04
 * @LastEditors: DengDu
 * @LastEditTime: 2022-03-21 14:14:17
-->
<template>
  <h-page-container class="search-car" v-loading="loading" element-loading-text="加载中">
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
          <div slot="reference" style="position: relative" class="upload-container">
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
            <i v-if="url && rect && showUploadImgDeleteIcon" class="h-icon-close upload-img-delete-icon" @click="deleteUploadImg"></i>
          </div>
        </el-popover>
        <h-page-search
          style="margin: 10px"
          ref="search"
          :model="search"
          label-position="top"
          :options="{
            xl: 2400,
            lg: 1500,
            md: 1100,
            sm: 720,
          }"
          :rules="rules"
        >
          <h-page-search-item label="选择时段" prop="interval">
            <el-date-picker
              v-model="search.interval"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </h-page-search-item>
          <!-- <h-page-search-item label="选择点位" prop="range">
            <sui-select-point
              ref="selectPoint"
              inner-title="组织树"
              :request-data="requestTreeData"
              :parent-checkable="true"
              :expand-on-checked="false"
              parent-key="orgIndexCode"
              :tree-props="treeProps"
              extraDesc="（默认全选）"
              @change="handleChange"
              style="width: 100%"
            ></sui-select-point>
          </h-page-search-item> -->
          <h-page-search-item label="案件名称"
            ><el-autocomplete
              v-model="caseName"
              :props="{ value: 'caseName' }"
              :fetch-suggestions="searchCase"
              @select="selectCase"
              @input="handle"
              placeholder="请输入搜索关键词"
            ></el-autocomplete>
          </h-page-search-item>

          <h-page-search-item label="最小相似度" prop="similarity">
            <!-- <el-input-number
              ref="inputNumber"
              style="width: 100%"
              v-model="search.similarity"
              :controls="false"
            >
            </el-input-number> -->
            <el-input ref="similarityInput" v-model="search.similarity" placeholder="" >
            </el-input>
          </h-page-search-item>
          <template slot="pageSearchAction">
            <el-button type="primary" @click="getData(true)">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </template>
        </h-page-search>
      </header>

      <transition name="slide-fade">
        <div class="overflow-search">
          <FeatureSearchFilter
            @searchDataChange="searchDataChange"
          ></FeatureSearchFilter>
        </div>
      </transition>

      <div class="search-car-map">
        <car-map
          ref="carMapFun"
          :startTime="search.interval[0]"
          :endTime="search.interval[1]"
        ></car-map>
      </div>

      <div class="cards" v-if="cars.length">
        <el-scrollbar
          class="card-scrollbar"
          overflowX="hidden"
          wrap-class="scrollbar-wrap"
          view-class="scrollbar-view"
        >
          <div
            v-for="(item, index) in cars"
            :key="item.id"
            :style="{ height: item.similarity > 0 ? '330px' : '300px' }"
          >
            <h-img-result-card
              pic-mode="fill"
              class="car-card"
              @click-pic="clickCardPic(item, index)"
              :data="{
                item,
                pic: item.image,
                info: getInfoArr(item),
                btns: [
                  {
                    icon: 'target-imgCard-icon-searchPerson',
                    title: '以人搜人',
                    click(data) {
                      bodySearchHander(data);
                    },
                  },
                  {
                    icon: 'target-imgCard-icon-searchFace',
                    title: '以脸搜脸',
                    click(data) {
                      faceSearchFaceHander(data);
                    },
                  },
                  {
                    icon: 'target-imgCard-icon-car',
                    title: '以车搜车',
                    click(data) {
                      carSearchHander(data);
                    },
                  },
                  {
                    icon: 'target-imgCard-icon-location',
                    title: '线索定位',
                    click(item) {
                      locationSearchHander(item);
                    },
                  },
                ],
              }"
            >
              <h-img-snippets-rect
                v-if="item.rect"
                :rect="getItemRect(JSON.parse(item.rect))"
              />
              <template slot="info" slot-scope="{ item }">
                <i v-if="item.icon" :class="item.icon" />
                <label v-if="item.label" v-text="item.label" />
                <el-progress
                  style="display: inline-block"
                  v-if="item.similarity"
                  stroke-linecap="round"
                  small
                  :show-text="false"
                  :percentage="item.similarity * 100"
                  :color="colorChange(item.similarity * 100)"
                ></el-progress>
                <span v-if="item.content" v-text="item.content" />
              </template>
            </h-img-result-card>
          </div>
        </el-scrollbar>

        <!-- 貌似是没有用的代码 暂时 *********************-->

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
                  :color="colorChange(scope.item.similarity * 100)"
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
      </div>
      <el-pagination
        v-if="cars.length"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNoChange"
        :current-page.sync="currentPageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="currentPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <h-empty v-else size="md" description="暂无数据" style="width: 65%" />
      <component
        :is="dialogComponent"
        :dialogData="dialogData"
        :visible="dialogVisible"
        @closeDialog="closeDialog"
      >
      </component>
    </h-page-content>
  </h-page-container>
</template>

<script>
import moment from "moment";
import helper from "@/helper";
import api from "@/api";
import rest from "@/rest";
import TargetImgUpload from "./target-img-upload";
import SuiSelectPoint from "@/components/selectPoint/selectPoint";
import { loadNode } from "@/utils/index.js";
import Vue from "vue";
import Bus from "@/bus";
import { isUndefined } from "@hui-pro/utils";
import FeatureSearchFilter from "./FeatureSearchFilter";
import carMap from "@/components/map/CarMap.vue";
import clueCompareDialog from "@/components/photo-details-dialog/clue-compare-dialog.vue";
import detailDialog from "@/components/photo-details-dialog/detail-dialog.vue";
import mapUtils from "@/utils/mapUtils";
import CarImgOnMap from "./CarImgOnMap"

export default {
  name: "searchCar",
  props: {
    defaultProps: [Object, String, Array],
  },
  data() {
    var checkSimilarity = (rule, value, callback) => {
      if(!value) {
        return callback(new Error("最小相似度不能为空"));
      }
      if(/%$/.test(value)) {
        value = value.substring(0, value.length - 1)
      }
      if(!(/^([1-9][0-9]{0,1}|100)$/.test(value))) {
        callback(new Error("请输入1-100之间的数字"))
      } else{
        callback()
      }
    }
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
        // similarity: 70,
        similarity: "70%",
        areaCode: "",
        cameraIndexCode: "",
        vehicleColor: "",
        withFrontBasket: "",
        latitude: "",
        longitude: "",
        distance: "",
        queryParam4Map: {},
      },
      rules: {
        similarity: [
          {validator: checkSimilarity, trigger: "blur"}
        ]
      },
      total: 0,
      currentPageNo: 1,
      currentPageSize: 10,
      currentIndex: 0,
      cars: [],
      showPreview: false,
      lonlat: [],
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
      dialogComponent: clueCompareDialog,
      dialogData: {},
      dialogVisible: false,
      caseName: "",
      clickItem: "",
      loading: false,
      showUploadImgDeleteIcon: false
    };
  },
  watch: {
    "search.similarity": function (val) {
      // if (val > 100) {
      //   this.$refs.inputNumber.setCurrentValue(100);
      // } else if (val === 0 || !val) {
      //   this.$refs.inputNumber.setCurrentValue(0);
      // }
      // this.$refs.inputNumber.handleBlur();
      // this.$refs.inputNumber.handleFocus();
    },
    showUploadImgDeleteIcon(val) {
      if(val) {
        this.$refs.upload.clearFiles()
      }
    }
  },
  created() {
    // 默认进入页面查询一次数据
    this.getData(true);

    if (this.url) {
      this.createImgUpload();
    }
    if (this.defaultProps && JSON.stringify(this.defaultProps) !== "{}") {
      this.url = this.defaultProps;
      this.createImgUpload();
    }
  },
  components: {
    SuiSelectPoint,
    FeatureSearchFilter,
    carMap,
    clueCompareDialog,
    detailDialog,
    CarImgOnMap
  },
  beforeDestroy() {
    this.$emit("clearDefaultProps");
  },
  mounted() {
    // 地图中参数
    Bus.$on("dragCircleDistance", ({ newDistance, center }) => {
      this.search.distance = newDistance;
      this.search.longitude = center.lon;
      this.search.latitude = center.lat;
    });
    Bus.$on("wktResultInfo", (Info) => {
      this.search.queryParam4Map = {
        bbox: Info[0],
        width: Info[1],
        height: Info[2],
        collections: Info[3],
      };
    });
  },
  methods: {
    searchCase(str, cb) {
      rest
        .post(api.searchCar.searchCase, {
          startTime: moment(this.search.interval[0]).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          endTime: moment(this.search.interval[1]).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          pageNo: 1,
          pageSize: 100,
          caseName: str,
        })
        .then(({ data }) => {
          cb(data.caseInfoVOList || []);
        });
    },
    selectCase(item) {
      // 调用父组件中的方法
      this.$refs.carMapFun.selectCase(item);
    },
    handle(val) {
      if (val == "") {
        this.$refs.carMapFun.handle("");
      }
    },

    getInfoArr(item) {
      let arr = [
        {
          icon: "h-icon-info_location",
          content: item.placeAddress,
        },
        {
          icon: "h-icon-info_time",
          content: item.passTime,
        },
      ];
      if (item.similarity) {
        arr.unshift({
          icon: "target-imgCard-icon-vs",
          similarity: item.similarity,
          content: parseInt(item.similarity * 100) + "%",
        });
      }
      return arr;
    },

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
          .post(api.searchCar.buildModel, { image: this.url })
          .done((res) => {
            if (helper.isSuccess(res)) {
              if (res.data && res.data.length) {
                resolve({
                  vehicle: res.data.map((item) => {
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
                        if (change) item.rect = temp;
                      }
                    }
                    return item;
                  }),
                });
              } else {
                reject("未检测到电动车信息");
              }
            } else {
              reject(res.msg);
            }
          })
          .catch(() => {
            reject("未检测到电动车信息");
          });
      });
    },
    createImgUpload() {
      const instance = this.createTargetImgUpload({
        scan: this.scan,
        dataProps: {
          vehicle: {
            key: "vehicle",
            rect: {
              key: "rect",
              height: "height",
              width: "width",
              left: "left",
              top: "top",
            },
          },
        },
        types: ["vehicle"],
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
      const select = data[0].rectData.vehicle.filter((item) => item.$$active);
      if (select[0].modelData) {
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
      this.search.modelData = item.modelData;
      this.rect = item.rect;
    },
    handleFileUploadSuccess(res) {
      this.showUploadImgDeleteIcon = false
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
      this.$set(this.search, "vehicleColor", "");
      this.$set(this.search, "withFrontBasket", "");
      this.$refs.selectPoint && this.$refs.selectPoint.setValue({});
      Bus.$emit("reset", "true");
    },
    getData(isUpdate) {
      this.$nextTick(() => {
        this.$refs.search.getForm().validate((valid, invalidFields) => {
          if(valid) {
            if(!this.search.similarity.includes("%")) {
              this.search.similarity = this.search.similarity + "%"
            }
            // if (!this.search.modelData) {
            //   this.$message("请上传车辆图片");
            //   return;
            // }
            if (isUpdate) {
              this.currentPageNo = 1;
            }
            let {
              modelData,
              interval,
              similarity,
              areaCode,
              cameraIndexCode,
              longitude,
              latitude,
              distance,
              vehicleColor,
              withFrontBasket,
            } = this.search;
            let [startTime, endTime] = interval;
            let params = {
              startTime: moment(startTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
              endTime: moment(endTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
              areaCode,
              cameraIndexCode,
              similarity: parseInt(similarity.replace("%", "")) / 100,
              modelData,
              pageNo: this.currentPageNo,
              pageSize: this.currentPageSize,
              longitude,
              latitude,
              distance,
              vehicleColor,
              withFrontBasket,
            };
            if (JSON.stringify(this.search.queryParam4Map) != "{}") {
              params.queryParam4Map = this.search.queryParam4Map;
              params.hierarchy = 15;
            }
            this.loading = true
            rest.post(api.searchCar.search, params).done((res) => {
              if (helper.isSuccess(res)) {
                this.loading = false
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
                this.loading = false
                this.$message.error(res.msg);
              }
            });
          } else {
            console.log(invalidFields)
            this.$refs.search.getForm().focusFirstField()
            return false
          }
        })
      })
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
    searchDataChange(data) {
      // 注意这里的判断条件(length)
      if (
        data.vehicleColor.length === 101 &&
        data.withFrontBasket.length === 14
      ) {
        this.search.vehicleColor = "";
        this.search.withFrontBasket = "";
      } else {
        this.search.vehicleColor = data.vehicleColor;
        this.search.withFrontBasket = data.withFrontBasket;
      }
    },
    clickCardPic(item, index) {
      this.dialogComponent = item.similarity ? clueCompareDialog : detailDialog;
      this.$set(this, "dialogData", {
        currentIndex: index,
        list: this.cars,
        targetImg: this.url,
        targetRect: this.rect,
      });
      this.$nextTick(function () {
        this.dialogVisible = true;
      });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    // 控制百分比进度条
    colorChange(percentage) {
      if (percentage > 80) {
        return "#FE5332";
      } else if (percentage > 50) {
        return "#FFCC00";
      } else {
        return "#3BCD8D";
      }
    },
    //以人搜人
    bodySearchHander(item) {
      const { protocol, hostname, port } = location;
      let temp = item.pic;
      // temp = protocol + "//" + hostname + "/ngx/proxy?i=" + btoa(temp);
      temp = protocol + "//" + hostname + "/ngx/proxy?i=" + temp;
      if (top === window) {
        let path =
          protocol +
          "//" +
          hostname +
          ":" +
          port +
          "/ibody-web/index.do#personSearch?imageUrl=" +
          temp;
        window.open(path, "_blank");
        return false;
      }
      top.window.goToApp({
        url:
          protocol +
          "//" +
          hostname +
          ":" +
          port +
          "/ibody-web/index.do#personSearch?" +
          "imageUrl=" +
          temp,
        param: "",
        name: "以人搜人",
      });
    },
    //以脸搜脸
    faceSearchFaceHander(item) {
      // console.log(item);
      let { protocol, hostname, port } = location;
      let temp = item.pic;
      let linkParam = "faceUrl=" + temp;
      if (top === window) {
        let path =
          protocol +
          "//" +
          hostname +
          ":" +
          port +
          "/iface-web/index.do#snapshot?faceUrl=" +
          temp;
        window.open(path, "_blank");
        return false;
      }
      top.window.goToApp({
        url:
          protocol +
          "//" +
          hostname +
          ":" +
          port +
          "/iface-web/index.do#snapshot?" +
          linkParam,
        param: "",
        name: "以脸搜脸",
      });
    },
    // 以车搜车
    carSearchHander(data) {
      this.url = data.pic
      if (this.url) {
        this.$message.success("图片上传成功");
        // this.createImgUpload();
        let item = data && data.item
        if(item) {
          this.search.modelData = item && item.modelData
          if(item.rect) {
            const temp = JSON.parse(item.rect);
            if (temp) {
              if (temp.x) {
                temp.left = temp.x;
                delete temp.x;
              }
              if (temp.y) {
                temp.top = temp.y;
                delete temp.y;
              }
            }
            this.rect = temp
          }
        }
        this.showUploadImgDeleteIcon = true
      } else {
        if (this.$refs.upload) this.$refs.upload.clearFiles();
        this.$message({
          type: "error",
          message: "图片链接为空，请联系管理员",
        });
      }
    },
    locationSearchHander(item) {
      Bus.$emit("mapLocation", item);
    },
    getItemRect(item) {
      return {
        top: (item && item.top) || 0,
        left: (item && item.left) || 0,
        width: (item && item.width) || 0,
        height: (item && item.height) || 0,
      };
    },
    deleteUploadImg() {
      this.url = ""
      this.rect = null
      this.search.modelData = ""
      this.showUploadImgDeleteIcon = false
    }
  },
};
</script>

<style lang="scss">
.search-car {
  height: 100% !important;
  // overflow: hidden;
  .header {
    margin: 0 auto;
    width: 97%;
    height: 130px;
    padding: 50px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
    & > .h-page-search {
      flex: 1;
      border: none;
      .el-form {
        margin: 0;
      }
    }
    .upload-container {
      z-index: 10;
      position: relative;
      .upload-img-delete-icon {
        position: absolute;
        top: 4px;
        right: 4px;
        font-size: 24px;
        z-index: 10;
      }
    }

  }
  .upload-image {
    width: 102px;
    height: 102px;
    .el-upload {
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
        grid-template-columns: repeat(auto-fill, 210px);
        justify-content: space-evenly;
        align-items: center;
      }
    }
  }
  .car-card .h-image-result-card__item-info i {
    font-size: 24px;
  }
  // 以人搜人 以脸搜脸 间距调整
  // .h-image-result-card__item-btns-content {
  //   margin: 0 10px;
  //   > button:nth-child(2) {
  //     margin-left: 10px;
  //   }
  // }

  &-map {
    position: absolute;
    right: 0;
    top: 248px;
    width: 35%;
    height: 570px;
  }
  .uploading-close {
    z-index: 1;
  }
}
.search-car-map {
  height: 65%;
  width: 39%;
}
.searchCar-upload-popover {
  padding: 5px;
}
.target-imgCard-icon-searchPerson {
  &::before {
    content: url(~@/assets/images/clueManage/findPerson.png);
    width: 12px;
    display: inline-block;
    height: 20px;
    vertical-align: middle;
  }
}

.target-imgCard-icon-searchFace {
  &::before {
    content: url(~@/assets/images/clueManage/findFace.png);
    display: inline-block;
    width: 12px;
    height: 20px;
    vertical-align: middle;
  }
}
.target-imgCard-icon-car {
  &::before {
    content: url(~@/assets/images/clueManage/findCar.png);
    display: inline-block;
    width: 12px;
    height: 20px;
    vertical-align: middle;
  }
}
.target-imgCard-icon-location {
  &::before {
    content: url(~@/assets/images/clueManage/findLocation.png);
    display: inline-block;
    width: 12px;
    height: 27px;
    vertical-align: middle;
  }
}
.target-imgCard-icon-vs {
  &::before {
    content: url(~@/assets/images/clueManage/icon-07.png);
    display: inline-block;
    width: 24px;
    height: 27px;
    margin-left: 5px;
    vertical-align: middle;
  }
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
  width: 62%;
  display: flex;
  flex-flow: column wrap;
  height: calc(100% - 298px);
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
  background-color: #ffffff;
  z-index: 2022;
}
.car-card {
  margin-right: 8px;
  margin-bottom: 8px;

  .h-image-result-card__item {
    height: 219px;
    margin-top: 70px;
    position: relative;
    ul li span {
      display: inline-block;
      max-width: calc(100% - 24px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

  }
  .h-image-result-card__item-btns-wrapper {
    > button {
      width: 20px !important;
    }
  }

  // .h-img-view-wrapper{
  //   height: 215px;
  // }
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
.overflow-search {
  width: 100%;
  height: 115px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
.h-image-result-card {
  height: 219px !important;
  // margin-top: 70px;
}
.actice {
  height: 320px !important;
}
</style>
