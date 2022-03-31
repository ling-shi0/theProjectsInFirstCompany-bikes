<template>
  <h-layout class="clueDetails fs14">
    <h-layout-header class="clueDetails-header">
      <breadcrumb-nav :breadcrumbNavObj="breadcrumbNavObj"></breadcrumb-nav>
    </h-layout-header>
    <h-layout-content
      class="clueDetails-content scroll-bar-wrap"
      v-loading="loading"
    >
      <el-row class="scroll-bar pt10 pl10 pr10">
        <el-col :span="18" class="clueDetails-content-imgWrap pr10">
          <div class="clueDetails-content-imgWrap-imgView pt5 pb5 pl5 pr5">
            <h-img-view
              :src="formObj.formType.picUrl"
              mode="adjust"
              cursor="grab"
            ></h-img-view>
          </div>
          <el-row class="pb50">
            <el-col :span="4">
              <p>
                <span class="iconfont arrow">&#xe629;</span>
                标注
              </p>
            </el-col>
            <el-col :span="20" class="txt_r">
              <p class="dib ml10">
                <img
                  src="../../../../assets/images/clueManage/icon_06.png"
                  class="por mr5"
                  style="width:13px;left:3px;top:3px;"
                />
                以人搜人
              </p>
              <p class="dib ml10">
                <img
                  src="../../../../assets/images/clueManage/icon_04.png"
                  class="por mr5"
                  style="width:13px;left:3px;top:3px;"
                />
                以脸搜脸
              </p>
              <p class="dib ml10">
                <img
                  src="../../../../assets/images/clueManage/icon_03.png"
                  class="por mr5"
                  style="width:13px;left:3px;top:3px;"
                />
                目标追踪
              </p>
              <p class="dib ml10" @click="goCaseIntelligence()">
                <i class="h-icon-copy fs20 por" style="top:5px;"></i>
                周边案件
              </p>
              <p class="dib ml10">
                <i class="h-icon-location fs20 por" style="top:5px;"></i>
                坐标定位
              </p>
              <p class="dib ml10">
                <img
                  src="../../../../assets/images/clueManage/icon_05.png"
                  class="por mr5"
                  style="width:13px;left:3px;top:3px;"
                />
                线索查询
              </p>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="sidebar">
          <el-tabs v-model="tabType">
            <el-tab-pane label="基本信息" name="baseInfo" class="formObj">
              <el-form
                :inline="true"
                :model="formObj.formType"
                class="demo-form-inline"
              >
                <el-row>
                  <el-col :span="24" class="mb15">
                    <p>抓拍时间</p>
                    <el-date-picker
                      v-model="formObj.formType.passTime"
                      type="datetime"
                      placeholder="请选择日期时间"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      style="width: 100%"
                    />
                  </el-col>
                  <el-col :span="24" class="mb15">
                    <p>抓拍地点</p>
                    <el-input
                      placeholder="请输入内容"
                      v-model="formObj.formType.placeAddress"
                      clearable
                    >
                    </el-input>
                  </el-col>
                  <el-col :span="24" class="mb15 latitudeLongitude">
                    <p>经纬度</p>
                    <el-row>
                      <el-col :span="12">
                        <el-input
                          placeholder="请输入内容"
                          v-model="formObj.formType.longitude"
                          clearable
                        >
                        </el-input>
                        <span class="color_999">&nbsp;—</span>
                      </el-col>
                      <el-col :span="12">
                        <el-input
                          placeholder="请输入内容"
                          v-model="formObj.formType.latitude"
                          clearable
                        >
                        </el-input>
                        <i
                          class="h-icon-location fs20 por"
                          style="top:5px;"
                        ></i>
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="24" class="mb15">
                    <p>备注</p>
                    <el-input
                      type="textarea"
                      :rows="4"
                      resize
                      placeholder="请输入内容"
                      v-model="formObj.formType.commentInfo"
                    ></el-input>
                  </el-col>
                  <el-col :span="24" class="btn_box mb15">
                    <el-form-item>
                      <el-button type="primary" @click="saveClueInfo()"
                        >保存</el-button
                      >
                      <el-button
                        @click="formObj.formType = formObj.resetFormType"
                        >恢复默认值</el-button
                      >
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="关联案件" name="caseInfo" class="related_ase">
              <div class="mb30" v-if="caseInfo">
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n">案件编号</h3>
                  <p class="fs14 color_333 lh24 pl5 bg_f2f2f2 bd_e3e3e3">
                    {{ caseInfo.code }}
                  </p>
                </div>
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n">案件名称</h3>
                  <p class="fs14 color_333 lh24 pl5 bg_f2f2f2 bd_e3e3e3">
                    {{ caseInfo.name }}
                  </p>
                </div>
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n">案发时间</h3>
                  <p class="fs14 color_333 lh24 pl5 bg_f2f2f2 bd_e3e3e3">
                    {{ caseInfo.happenTime }}
                  </p>
                </div>
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n">案发地点</h3>
                  <p class="fs14 color_333 lh24 pl5 bg_f2f2f2 bd_e3e3e3">
                    {{ caseInfo.happenPlace }}
                  </p>
                </div>
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n">简要案情</h3>
                  <p class="fs14 color_333 lh24 pl5 bg_f2f2f2 bd_e3e3e3">
                    {{ caseInfo.detail }}
                  </p>
                </div>
                <!-- <div class="mb15" v-if="0">
                                    <h3 class="fs14 color_333 fw_n">被盗车辆图片</h3>
                                    <img src="../../../../assets/images/clueManage/clue_details_img.jpg" alt="" style="width:60%">
                                </div> -->
                <div class="mb15">
                  <el-button @click="cancelRelation()">取消关联</el-button>
                </div>
              </div>
              <h-empty v-else />
            </el-tab-pane>
            <el-tab-pane
              label="标注信息"
              name="markInfo"
              class="annotation_info"
            >
              <div>
                <div class="mb15 type">
                  <h3 class="fs14 color_333 fw_n">画面时间</h3>
                  <el-radio-group
                    v-model="annotationInfoObj.type.electricVehicleType"
                    class="vehicle_type"
                  >
                    <el-radio :label="1">可疑车辆</el-radio>
                    <el-radio :label="2">自用车辆</el-radio>
                  </el-radio-group>
                </div>
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n">可疑车辆聚类</h3>
                  <div>
                    <el-row style="width:calc(100% + 5px)">
                      <el-col :span="8" class="pr5 mb5">
                        <div
                          class="bg_f2f2f2 upload txt_c pt5"
                          style="border:1px dashed #ccc; height: 60px;"
                        >
                          <span class="iconfont arrow">&#xe629;</span>
                          <p>单击上传图片</p>
                        </div>
                      </el-col>
                      <el-col :span="8" class="pr5 mb5">
                        <div style="height: 60px;">
                          <img
                            src="../../../../assets/images/clueManage/clue_details_img.jpg"
                            alt=""
                            class="w100"
                            style="height:100%;"
                          />
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div class="mb15">
                  <h3 class="fs14 color_333 fw_n">备注</h3>
                  <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="annotationInfoObj.type.remarks"
                  >
                  </el-input>
                </div>
                <div class="mb15 btn_box">
                  <el-button type="primary">保存</el-button>
                  <el-button>重置</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </h-layout-content>
  </h-layout>
</template>

<script>
import breadcrumbNav from "../../../../components/breadcrumbNav.vue";
import helper from "@/helper";
import "@/filters";
import api from "@/api";
import rest from "@/rest";

export default {
  data() {
    return {
      loading: true,
      id: this.$route.query.id, // 线索 id
      caseCode: "", // 关联案件 id
      breadcrumbNavObj: [
        {
          // 面包屑导航
          name: "疑似人员管理",
          color: "#666"
        },
        {
          name: "线索管理",
          color: "#666"
        },
        {
          name: "线索详情",
          color: "#333"
        }
      ],
      tabType: "baseInfo", // tab 类型
      formObj: {
        // 基本信息
        formType: {
          passTime: "", // 抓拍时间
          placeAddress: "", // 抓拍地点
          longitude: "", // 经度
          latitude: "" // 纬度
        },
        resetFormType: {
          passTime: "", // 抓拍时间
          placeAddress: "", // 抓拍地点
          longitude: "", // 经度
          latitude: "" // 纬度
        }
      },
      caseInfo: {}, // 案件信息
      annotationInfoObj: {
        // 标注信息
        type: {
          electricVehicleType: 1, // 车辆类型
          remarks: "" // 备注
        }
      }
    };
  },
  watch: {
    "fromObj.formType.longitude"(val) {
      if (val && typeof val === 'string') {
        this.fromObj.formType.longitude = val.replace(
          new RegExp(helper.lngLatReplace, "g"),
          ""
        );
      }
    },
    "fromObj.formType.latitude"(val) {
      if (val && typeof val === 'string') {
        this.fromObj.formType.latitude = val.replace(
          new RegExp(helper.lngLatReplace, "g"),
          ""
        );
      }
    }
  },
  mounted() {
    this.init();
  },
  components: {
    breadcrumbNav
  },
  methods: {
    init() {
      let that = this;
      // 获取基本信息
      rest
        .get(api.clueDetails.getClueInfo, {
          id: that.id
        })
        .done(function(res) {
          if (helper.isSuccess(res)) {
            that.formObj.formType = { ...that.formObj.formType, ...res.data };
            that.formObj.resetFormType = {
              ...that.formObj.formType,
              ...res.data
            };
            that.caseCode = res.data.archiveCode;
            that.getRelationCaseInfo();
          } else {
            that.$message.error(res.msg);
          }
          setTimeout(() => {
            that.loading = false;
          }, 200);
        });
    },
    // go 周边案件
    goCaseIntelligence() {
      this.$router.push("/home/caseIntelligence");
    },
    // 基本信息保存
    saveClueInfo() {
      let that = this;
      rest
        .post(api.clueDetails.updateClueInfo, this.formObj.formType)
        .done(function(res) {
          if (helper.isSuccess(res)) {
            that.$message.success("保存成功!");
            that.getClueInfo();
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
          caseCode: that.caseCode
        })
        .done(function(res) {
          if (helper.isSuccess(res)) {
            that.caseInfo = res.data;
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
          id: that.id
        })
        .done(function(res) {
          if (helper.isSuccess(res)) {
            that.$message.success("取消成功");
            that.init();
            that.tabType = "caseInfo";
          } else {
            that.$message.error(res.msg);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.clueDetails {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .clueDetails-header {
    height: 40px;
  }
  .clueDetails-content {
    .clueDetails-content-imgWrap {
      .clueDetails-content-imgWrap-imgView {
        height: 480px;
        border: 1px solid #ddd;
      }
    }
  }
  .sidebar {
    ::v-deep .el-tabs__nav {
      width: 100%;
      text-align: center;
      > div {
        padding: 0;
        width: 33.33%;
      }
    }
    ::v-deep .el-tabs__header {
      margin-bottom: 10px;
    }
    ::v-deep .el-tabs__content {
      overflow: visible;
    }
    .formObj {
      ::v-deep .el-input__inner {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        padding-left: 5px;
      }
      ::v-deep .el-select {
        width: 100%;
      }
      ::v-deep .el-input__icon {
        line-height: 31px;
      }
      .latitudeLongitude {
        ::v-deep .el-input {
          width: 80%;
        }
      }
      .btn_box {
        ::v-deep button {
          font-size: 14px;
          padding: 7px 0;
          width: 80px;
        }
      }
    }
    .related_ase {
      ::v-deep button {
        font-size: 14px;
        padding: 7px 0;
        width: 80px;
      }
    }
    .annotation_info {
      .type {
        display: flex;
        min-width: 350px;
        h3 {
          flex: 0 0 60px;
        }
        .vehicle_type {
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
      ::v-deep textarea {
        font-size: 14px;
        padding-left: 10px;
      }
      .btn_box {
        ::v-deep button {
          font-size: 14px;
          padding: 7px 0;
          width: 80px;
        }
      }
    }
  }
}
</style>
