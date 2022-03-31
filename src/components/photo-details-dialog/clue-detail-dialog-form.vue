<template>
  <div style="border-left: #e6e6e6 1px solid; border-bottom: #e6e6e6 1px solid">
    <div class="form-title">基本信息</div>
    <el-form
      ref="clueDetailForm"
      class="clue-preview-form"
      label-width="91px"
      :rules="clueDetailRules"
      :model="formData"
      v-if="formType == 'clueDetail'"
    >
      <!-- <el-tabs v-model="activePane" tab-position="top">
        <el-tab-pane
          label="基本信息"
          name="base"
          class="clue-form-base-tab"
          v-if="contentType == 'photo' || contentType == 'video'"
      >-->
      <el-form-item prop="passTime">
        <span class="item-title">抓拍时间</span>
        <el-date-picker
          v-model="formData.passTime"
          type="datetime"
          placeholder="请选择日期时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item prop="placeAddress">
        <span class="item-title">点位名称</span>
        <el-input
          placeholder="请输入内容"
          v-model="formData.placeAddress"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="longitude" class="latitudeLongitude-longitude">
        <span class="item-title">经纬度</span>
        <div>
          <el-input
            placeholder="请输入经度"
            v-model="formData.longitude"
            clearable
            class="longitude-input"
          >
            <template slot="append"><span>°</span></template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item prop="latitude" class="latitudeLongitude-latitude">
        <div style="display: flex">
          <el-input
            placeholder="请输入纬度"
            v-model="formData.latitude"
            clearable
            class="latitude-input"
          >
            <template slot="append"><span>°</span></template>
          </el-input>
          <div style="display: inline-block">
            <div class="map-button">
              <i
                class="h-icon-location fs20 por cup"
                style="top: 5px"
                @click="openMap()"
              ></i>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="commentInfo">
        <span class="item-title">备注</span>
        <el-input
          type="textarea"
          :rows="4"
          resize
          placeholder="请输入内容"
          v-model="formData.commentInfo"
        ></el-input>
      </el-form-item>
      <!-- </el-tab-pane> -->
      <!-- <el-tab-pane
          label="关联案件"
          name="case"
          v-if="contentType == 'photo' || contentType == 'video'"
        >
          <el-scrollbar wrap-class="form-scrollbar-wrap">
            <template>
              <div class="mb30" v-if="caseInfo && caseInfo.code">
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n mb5">案件编号</h3>
                  <p class="fs14 color_333 lh24 pl5 bg_f2f2f2 bd_e3e3e3">
                    {{ caseInfo.code }}
                  </p>
                </div>
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n mb5">案件名称</h3>
                  <p class="fs14 color_333 lh24 pl5 bg_f2f2f2 bd_e3e3e3">
                    {{ caseInfo.name }}
                  </p>
                </div>
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n mb5">案发时间</h3>
                  <p class="fs14 color_333 lh24 pl5 bg_f2f2f2 bd_e3e3e3">
                    {{ caseInfo.happenTime }}
                  </p>
                </div>
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n mb5">案发地点</h3>
                  <p class="fs14 color_333 lh24 pl5 bg_f2f2f2 bd_e3e3e3">
                    {{ caseInfo.happenPlace }}
                  </p>
                </div>
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n mb5">简要案情</h3>
                  <p class="fs14 color_333 lh24 pl5 bg_f2f2f2 bd_e3e3e3">
                    {{ caseInfo.detail }}
                  </p>
                </div>
                <div class="mb15">
                  <el-button @click="cancelRelation()">取消关联</el-button>
                </div>
              </div>
              <div class="mt50" v-else>
                <h-empty size="sm" description="暂无关联案件" />
              </div>
            </template>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          label="标注信息"
          name="tagging"
          class="clueDetail-taggingInfo"
          v-if="contentType == 'photo'"
        >
          <div v-if="formData.bikeLabel">
            <div
              class="clueDetail-taggingInfo-vehicle mb15"
              v-if="formData.bikeLabel == '1'"
            >
              <h3 class="fs14 color_333 fw_n mb10">
                可疑车辆
                <i
                  class="h-icon-delete fs26 fr cup"
                  @click="deleteCarClassify(formData)"
                ></i>
              </h3>
              <div>
                <el-row class="clueDetail-taggingInfo-vehicle-row">
                  <el-col
                    :span="8"
                    class="clueDetail-taggingInfo-vehicle-row-colItem pr5 mb5 cup"
                  >
                    <div style="height: 80px;">
                      <img :src="formData.picUrl" class="wh100" />
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div
              class="clueDetail-taggingInfo-vehicle mb15"
              v-if="formData.bikeLabel == '2'"
            >
              <h3 class="fs14 color_333 fw_n mb10">
                自用车辆
                <i
                  class="h-icon-delete fs26 fr cup"
                  @click="deleteCarClassify(formData)"
                ></i>
              </h3>
              <div>
                <el-row class="clueDetail-taggingInfo-vehicle-row">
                  <el-col
                    :span="8"
                    class="clueDetail-taggingInfo-vehicle-row-colItem pr5 mb5 cup"
                  >
                    <div style="height: 80px;">
                      <img :src="formData.picUrl" class="wh100" />
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="clueDetail-taggingInfo-type mb15">
              <h3 class="fs14 color_333 fw_n">电动车类型</h3>
              <el-radio-group
                v-model="taggingInfo.vehicleType"
                class="clueDetail-taggingInfo-type-radio"
              >
                <el-radio :label="1">可疑车辆</el-radio>
                <el-radio :label="2">自用车辆</el-radio>
              </el-radio-group>
            </div>
            <div
              class="clueDetail-taggingInfo-vehicle mb15"
              v-if="taggingInfo.vehicleType == '1'"
            >
              <h3 class="fs14 color_333 fw_n mb10">可疑车辆聚类</h3>
              <div>
                <el-row class="clueDetail-taggingInfo-vehicle-row">
                  <el-col
                    :span="8"
                    class="clueDetail-taggingInfo-vehicle-row-colAdd pr5 mb5 cup"
                  >
                    <div
                      class="clueDetail-taggingInfo-vehicle-row-colAdd-wrap bg_f2f2f2 txt_c pt15"
                      @click="addCarClassify(formData, null, 1)"
                    >
                      <i class="h-icon-add fs24"></i>
                      <p>新增车辆</p>
                    </div>
                  </el-col>
                  <el-col
                    :span="8"
                    class="clueDetail-taggingInfo-vehicle-row-colItem pr5 mb5 cup"
                    v-for="(item) in suspiciousVehicleList"
                    :key="item.bike_code"
                  >
                    <div
                      class="clueDetail-taggingInfo-vehicle-row-colItem-imgWrap"
                      @click="addCarClassify(formData, item, 2)"
                    >
                      <el-tooltip placement="bottom">
                        <div slot="content">
                          <img
                            :src="item.pic_url"
                            style="width:400px;height: 400px;"
                          />
                        </div>
                        <img :src="item.pic_url" class="wh100" />
                      </el-tooltip>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div
              class="clueDetail-taggingInfo-vehicle mb15"
              v-if="taggingInfo.vehicleType == '2'"
            >
              <h3 class="fs14 color_333 fw_n mb10">自用车辆聚类</h3>
              <div>
                <el-row class="clueDetail-taggingInfo-vehicle-row">
                  <el-col
                    :span="8"
                    class="clueDetail-taggingInfo-vehicle-row-colAdd pr5 mb5 cup"
                  >
                    <div
                      class="clueDetail-taggingInfo-vehicle-row-colAdd-wrap bg_f2f2f2 txt_c pt15"
                      @click="addCarClassify(formData, null, 3)"
                    >
                      <i class="h-icon-add fs24"></i>
                      <p>新增车辆</p>
                    </div>
                  </el-col>
                  <el-col
                    :span="8"
                    class="clueDetail-taggingInfo-vehicle-row-colItem pr5 mb5 cup"
                    v-for="(item) in commonVehicleList"
                    :key="item.bike_code"
                  >
                    <div
                      class="clueDetail-taggingInfo-vehicle-row-colItem-imgWrap"
                      @click="addCarClassify(formData, item, 4)"
                    >
                      <el-tooltip placement="bottom">
                        <div slot="content">
                          <img
                            :src="item.pic_url"
                            style="width:400px;height: 400px;"
                          />
                        </div>
                        <img :src="item.pic_url" class="wh100" />
                      </el-tooltip>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
      </el-tab-pane>-->
      <!-- </el-tabs> -->
    </el-form>
    <map-dialog
      :longitude="parseFloat(formData.longitude)"
      :latitude="parseFloat(formData.latitude)"
      :visible="mapVisible"
      @saveMap="getLnglat"
      @changeVisible="mapVisible = false"
    />
  </div>
</template>

<script>
import MapDialog from "./map-dialog";
import helper from "@/helper";
import api from "@/api";
import rest from "@/rest";
import Bus from "@/bus";
import moment from "moment";

export default {
  name: "ClueDetailDialogForm",
  components: {
    MapDialog,
  },
  props: {
    model: {
      // 每一条数据
      type: Object,
      default: null,
    },
    formType: {
      // 弹框右侧展示哪个表格
      type: String,
      default: "",
    },
    contentType: {
      // 内容类型（图片、视频）
      type: String,
      default: "",
    },
    startTime: {
      type: [String, Date],
      default: "",
    },
    endTime: {
      type: [String, Date],
      default: "",
    },
  },
  data() {
    return {
      activePane: "base",
      mapVisible: false, // 地图显隐
      // 线索详情弹框的 ==================================================== 开始
      formData: {
        // 基本信息
        passTime: "", // 抓拍时间
        placeAddress: "", // 抓拍地点
        longitude: "", // 经度
        latitude: "", // 纬度
        commentInfo: "", // 备注
        clueType: this.getContentType(this.contentType), // 线索类型（photo、video...）
        rect: "", // 矩形框
      },
      clueDetailRules: {
        // 基本信息规则
        passTime: [
          { required: true, message: "请选择抓拍时间", trigger: "blur" },
        ],
        longitude: [
          {
            validator: (rule, value, callback) => {
              if (value && value.toString().split(".").length > 2) {
                callback(new Error("请输入正确的经度"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        latitude: [
          {
            validator: (rule, value, callback) => {
              if (value && value.toString().split(".").length > 2) {
                callback(new Error("请输入正确的纬度"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
      caseInfo: {}, // 案件信息
      taggingInfo: {
        // 标注信息
        vehicleType: 1,
      },
      suspiciousVehicleList: [], // 可疑车辆列表
      commonVehicleList: [], // 可疑车辆列表
      clueId: 0, // 线索 id
      caseId: 0, // 案件 id
      // 线索详情弹框的 ==================================================== 开始
    };
  },
  watch: {
    model(val) {
      if (this.formType == "clueDetail") {
        this.getClueInfo(val ? val.id : null);
        this.formData.clueType = this.getContentType(this.contentType); // 线索类型（photo、video...）
      }
    },
    "formData.longitude"(val) {
      if (val && typeof val === "string") {
        this.formData.longitude = val.replace(
          new RegExp(helper.lngLatReplace, "g"),
          ""
        );
      }
    },
    "formData.latitude"(val) {
      if (val && typeof val === "string") {
        this.formData.latitude = val.replace(
          new RegExp(helper.lngLatReplace, "g"),
          ""
        );
      }
    },
  },
  mounted() {
    if (this.formType == "clueDetail") {
      this.getClueInfo(this.model ? this.model.id : null); // 基本信息
      // this.getSuspiciousVehicle(this.model && this.model.certificateNumber); // 可疑车辆（身份证）
      // this.getCommonVehicle(this.model && this.model.certificateNumber); // 自用车辆（身份证）
    }
    Bus.$on("draw-complete", (data) => {
      this.formData.rect = JSON.stringify(data);
    });
  },
  methods: {
    // 公共事件 =============================================================== 开始
    // 打开地图
    openMap() {
      this.mapVisible = true;
    },
    // 获取经纬度
    getLnglat(data) {
      this.$set(this.formData, "longitude", +JSON.parse(data).longitude);
      this.$set(this.formData, "latitude", +JSON.parse(data).latitude);
    },
    // 公共事件 =============================================================== 结束

    // 线索详情弹框的 form ==================================================== 开始
    // 获取基本信息
    getClueInfo(id) {
      let that = this;
      // 获取基本信息
      rest
        .get(api.clueDetails.getClueInfo, {
          id: id,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            let result = res.data;
            if (result) {
              result.clueType = +result.clueType;
              that.formData = result;
              that.clueId = result.id;
              that.codeId = result.archiveCode;
            }
            that.getRelationCaseInfo();
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 获取关联案件信息
    getRelationCaseInfo() {
      let that = this;
      rest
        .get(api.clueDetails.findArchiveCase, {
          caseCode: that.codeId,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.caseInfo = res.data;
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 基本信息保存
    saveClueInfo(formName) {
      let that = this;
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid, invalidFields) => {
          if (valid) {
            rest
              .post(api.clueDetails.updateClueInfo, that.formData)
              .done((res) => {
                if (helper.isSuccess(res)) {
                  that.$message.success("保存成功!");
                } else {
                  that.$message.error(res.msg);
                }
              })
              .always(() => {
                resolve();
              });
          } else {
            this.$refs[formName].focusFirstField();
            resolve();
          }
        });
      });
    },
    // 判断内容类型
    getContentType(contentType) {
      switch (contentType) {
        case "photo":
          return 1;
        case "video":
          return 2;
        default:
          return 1;
      }
    },
    // 获取可疑车辆
    getSuspiciousVehicle(certificateNumber) {
      let that = this;
      rest
        .get(api.clueManage.findBikeLabelAndCodes, {
          certificateNumber: certificateNumber,
          bikeLabel: 1,
          startTime: moment(this.startTime).format("YYYY-MM-DD HH:mm:ss"),
          endTime: moment(this.endTime).format("YYYY-MM-DD HH:mm:ss"),
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.suspiciousVehicleList = res.data;
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 获取自用车辆
    getCommonVehicle(certificateNumber) {
      let that = this;
      rest
        .get(api.clueManage.findBikeLabelAndCodes, {
          certificateNumber: certificateNumber,
          bikeLabel: 2,
          startTime: moment(this.startTime).format("YYYY-MM-DD HH:mm:ss"),
          endTime: moment(this.endTime).format("YYYY-MM-DD HH:mm:ss"),
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.commonVehicleList = res.data;
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 取消关联案件
    cancelRelation() {
      let that = this;
      rest
        .get(api.clueDetails.cancelArchiveCaseRelation, {
          id: that.clueId,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.$message.success("取消成功");
            that.caseInfo = {};
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 车辆归类
    // addCarClassify(formData, item, num) {
    //   let that = this;
    //   var bikeLabel, bikeCode;
    //   let tip = "";
    //   if (num == 1) {
    //     bikeLabel = "1";
    //     bikeCode = null;
    //     tip = "确定新增可疑车辆吗？";
    //   } else if (num == 2) {
    //     bikeLabel = "1";
    //     bikeCode = item.bike_code;
    //     tip = "确定添加至该可疑车辆吗？";
    //   } else if (num == 3) {
    //     bikeLabel = "2";
    //     bikeCode = null;
    //     tip = "确定新增自用车辆吗？";
    //   } else {
    //     bikeLabel = "2";
    //     bikeCode = item.bike_code;
    //     tip = "确定添加至该自用车辆吗？";
    //   }
    //   let pamars = {
    //     clueIds: [formData.id],
    //     bikeLabel, // 可疑车辆、自用车辆
    //     bikeCode,
    //     certificateNumber: this.model && this.model.certificateNumber
    //   };
    //   this.$confirm(tip)
    //     .then((_) => {
    //       rest
    //         .post(api.clueManage.clueGroup, pamars)
    //         .done(function (res) {
    //           if (helper.isSuccess(res)) {
    //             that.$message.success(res.msg);
    //             that.getClueInfo(that.model.id);
    //           } else {
    //             that.$message.error(res.msg);
    //           }
    //         });
    //     })
    //     .catch((_) => {});
    // },
    // 删除可以车辆归类
    deleteCarClassify(formData) {
      let that = this;
      rest
        .post(api.clueManage.updateBikeLabel, {
          id: formData.id,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.getClueInfo(that.model.id);
            that.$message.success("删除成功");
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 线索详情弹框的 form ==================================================== 结束
  },
};
</script>

<style lang="scss" scoped>
.clue-preview-form {
  .el-form-item {
    width: 100%;
    margin-top: 16px;
    margin-bottom: 0 !important;
    ::v-deep .el-form-item__content {
      margin-left: 40px !important;
    }
  }
  .latitudeLongitude-longitude {
    width: 194px;
    display: inline-block;
    ::v-deep .el-input {
      width: 100%;
    }
  }
  .latitudeLongitude-latitude {
    width: 196px;
    display: inline-block;
    ::v-deep .el-input {
      width: 100%;
    }
    ::v-deep .el-form-item__content {
      margin-left: 0 !important;
    }
    .map-button {
      border: 1px #b3b3b3 solid;
      border-radius: 2px;
      width: 34px;
      height: 34px;
      display: flex;
      justify-content: center;
      margin-left: 6px;
      &:hover {
        background: rgba(0, 0, 0, 0.07);
      }
    }
  }
  .clueDetail-taggingInfo {
    .clueDetail-taggingInfo-type {
      display: flex;
      min-width: 350px;
      h3 {
        flex: 0 0 80px;
      }
      .clueDetail-taggingInfo-type-radio {
        flex: 1;
        position: relative;
        top: 1px;
        font-size: 14px;
        ::v-deep .el-radio__label {
          font-size: 14px;
        }
        ::v-deep .el-radio:first-child {
          margin-right: 10px;
        }
      }
    }
    .clueDetail-taggingInfo-vehicle {
      &-row {
        &-colAdd {
          &-wrap {
            border: 1px dashed #ccc;
            height: 80px;
          }
        }
        &-colItem {
          &-imgWrap {
            width: 120px;
            height: 80px;
            overflow: hidden;
          }
        }
      }
    }
  }
}
.item-title {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #4d4d4d;
  letter-spacing: 0;
  text-align: right;
  line-height: 20px;
}
.form-title {
  width: 100%;
  height: 35px;
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
  letter-spacing: 0;
  text-align: center;
  line-height: 35px;
  border-bottom: #e6e6e6 1px solid;
  font-weight: bold;
}
</style>
<style lang="scss">
.longitude-input {
  width: 100% !important;
  border: 1px solid #b3b3b3;
  border-radius: 2px;
  border-right: none;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  .el-input-group__append {
    background: rgba(0, 0, 0, 0.07) !important;
    border: none;
    border-radius: 0;
  }
  > input {
    border: none;
    :hover {
      border: none !important;
    }
  }
}
.latitude-input {
  width: 100% !important;
  border: 1px solid #b3b3b3;
  border-radius: 2px;
  border-left: none;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  .el-input-group__append {
    background: rgba(0, 0, 0, 0.07) !important;
    border: none;
    border-radius: 0;
  }
  > input {
    border: none;
    :hover {
      border: none !important;
    }
  }
}
.latitudeLongitude-longitude .el-input,
.latitudeLongitude-latitude .el-input {
  > input:hover {
    border: none !important;
  }
  > input:focus {
    border: none !important;
  }
}
</style>