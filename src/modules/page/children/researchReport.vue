<!--
 * @Descripttion: 研判报告
 * @version:
 * @Author: xueyilu
 * @Date: 2020-10-12 13:12:02
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-25 13:54:14
 -->
<template>
  <h-layout class="researchReport">
    <h-layout-header style="height: 40px">
      <breadcrumb-nav
        :breadcrumbNavObj="breadcrumbNavObj"
        :type="1"
        @goBack="goBack()"
      ></breadcrumb-nav>
    </h-layout-header>
    <h-layout class="pl10 pt10 pb20">
      <h-layout-content class="scroll-bar-wrap bg_fff">
        <main
          class="researchReport-main scroll-bar pl10 pt10 pr10 pb10"
          v-loading="loading"
        >
          <div class="researchReport-main-content bg_fff">
            <header class="researchReport-main-content-header por">
              <h2
                class="researchReport-main-content-header-title txt_c por pt20 pb20 fs18"
              >
                初步研判报告
              </h2>
              <div
                class="researchReport-main-content-header-export"
                :style="
                  timeAxisTitle === 'basic_info'
                    ? 'background: none;'
                    : 'background: rgba(255,255,255,0.8);border-bottom: 1px solid #e6e6e6;'
                "
              >
                <el-button
                  class="researchReport-main-content-header-export-button"
                  type="info"
                  @click="handleExportReport"
                  ><p v-show="!exportLoading">导出报告</p>
                  <el-load-icon
                    v-if="exportLoading"
                    style="color: #fff"
                  ></el-load-icon
                ></el-button>
              </div>
            </header>
            <div class="researchReport-main-content-info">
              <div
                id="basic_info"
                class="researchReport-main-content-info-basic pl50 mt10 pr10"
              >
                <div class="researchReport-main-content-info-comTitle por">
                  <h2 class="fs14 color_333 pl5 pr30 por">
                    <p>嫌疑人基本信息</p>
                    <span
                      :class="[
                        'iconfont arrow cup fs24',
                        mainObj.showBasicInfo ? '' : 'active',
                      ]"
                      @click="mainObj.showBasicInfo = !mainObj.showBasicInfo"
                      >&#xf98b;</span
                    >
                  </h2>
                </div>
                <div
                  class="researchReport-main-content-info-basic-flex pt15 mb30"
                  v-if="mainObj.showBasicInfo"
                >
                  <div
                    class="researchReport-main-content-info-basic-flex-imgWrap bd_f2f2f2 pl5 pt5 pr5 pb5"
                  >
                    <img
                      :src="personInfoObj.picUrl"
                      class="w100"
                      style="width: 138px; height: 138px"
                      v-if="personInfoObj.picUrl"
                    />
                    <template v-else>
                      <img
                        src="../../../assets/images/personList/head_sex_01.png"
                        style="width: 138px; height: 138px"
                        v-if="researchResult.gender == '男'"
                      />
                      <img
                        src="../../../assets/images/personList/head_sex_02.png"
                        style="width: 138px; height: 138px"
                        v-else
                      />
                    </template>
                  </div>
                  <div
                    class="researchReport-main-content-info-basic-flex-wordWrap pl10 pt10"
                  >
                    <h3 class="fs18 mb10">{{ personInfoObj.name }}</h3>
                    <el-row class="lh20 fs14">
                      <el-col :span="12"
                        >证件号码：{{ personInfoObj.idCard }}</el-col
                      >
                      <el-col :span="12">
                        居住地：{{
                          personInfoObj.address ? personInfoObj.address : "暂无"
                        }}
                      </el-col>
                      <el-col :span="12"
                        >性别：{{ researchResult.gender }}</el-col
                      >
                      <el-col :span="12">
                        户籍地：{{
                          personInfoObj.censusRegister
                            ? personInfoObj.censusRegister
                            : "暂无"
                        }}
                      </el-col>
                    </el-row>
                    <ul
                      class="researchReport-main-content-info-basic-flex-wordWrap-labelList mt20"
                      v-if="personInfoObj.labelList"
                    >
                      <li
                        v-for="itemLabel in personInfoObj.labelList"
                        :key="itemLabel.labelInfoId"
                        style="
                          max-width: 6rem;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                          overflow: hidden;
                        "
                        :title="itemLabel.labelName"
                      >
                        {{ itemLabel.labelName }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                id="research_results"
                class="researchReport-main-content-info-results pl50 mt10 pr10"
              >
                <div class="researchReport-main-content-info-comTitle por">
                  <h2 class="fs14 color_333 pl5 pr30 por">
                    <p>研判结果</p>
                    <span
                      :class="[
                        'iconfont arrow cup fs24',
                        mainObj.showResearchResults ? '' : 'active',
                      ]"
                      @click="
                        mainObj.showResearchResults = !mainObj.showResearchResults
                      "
                      >&#xf98b;</span
                    >
                  </h2>
                </div>
                <div
                  class="researchReport-main-content-info-results-details pt15 mb30 fs14"
                  v-if="mainObj.showResearchResults"
                >
                  通过已有线索信息分析出 {{ researchResult.name }}({{
                    researchResult.certNum
                  }}) 在 {{ researchResult.startTime }} 到
                  {{ researchResult.endTime }} 期间，总共换车
                  <span>{{ researchResult.bikeNum }}</span> 辆，其中可疑车辆
                  <span>{{ researchResult.suspiciousBikeNum }}</span>
                  辆，关联案件
                  <span>{{ researchResult.caseNum }}</span> 起，涉及到图片线索
                  <span>{{ researchResult.imageClueNum }}</span> 张。
                </div>
              </div>
              <div
                v-for="item in suspiciousCarList"
                :key="item.suspiciousBikeName"
                :id="item.suspiciousBikeName"
                class="researchReport-main-content-info-suspiciousVehicle pl50 mt10 pr10"
              >
                <div class="researchReport-main-content-info-comTitle por">
                  <h2 class="fs14 color_333 pl5 pr30 por">
                    <p>
                      {{ item.suspiciousBikeName }}
                      <span v-if="item.archiveCaseDO"
                        >---关联案件{{ item.archiveCaseDO.code }}</span
                      >
                    </p>
                    <span
                      :class="[
                        'iconfont arrow cup fs24',
                        item.flag ? '' : 'active',
                      ]"
                      @click="item.flag = !item.flag"
                      >&#xf98b;</span
                    >
                  </h2>
                </div>
                <div
                  class="researchReport-main-content-info-suspiciousVehicle-list pt15 mb30"
                  v-if="item.flag"
                >
                  <div
                    v-if="item.archiveCaseDO"
                    class="researchReport-main-content-info-suspiciousVehicle-info pt15 mb30"
                  >
                    <p>案件基本信息</p>
                    <div>
                      <div>
                        <span>案件编号:</span>
                        {{ item.archiveCaseDO.code }}
                      </div>
                      <div>
                        <span>报案时间：</span>
                        {{ item.archiveCaseDO.createTime }}
                      </div>
                      <div>
                        <span>发案时间：</span>
                        {{ item.archiveCaseDO.happenTime }}
                      </div>
                      <div>
                        <span>案件名称:</span>
                        {{ item.archiveCaseDO.name }}
                      </div>
                      <div>
                        <span>发案地点：</span>
                        {{ item.archiveCaseDO.happenPlace }}
                      </div>
                      <div>
                        <span>简要案情：</span>
                        {{ item.archiveCaseDO.detail }}
                      </div>
                    </div>
                  </div>
                  <div class="clearfix" v-if="suspiciousCarList.length">
                    <p
                      class="researchReport-main-content-info-suspiciousVehicle-listTitle"
                    >
                      图像线索信息
                      <span>共 {{ item.clueInfoDOList.length }} 张</span>
                    </p>
                    <div style="display: flex; flex-wrap: wrap">
                      <div
                        class="researchReport-main-content-info-suspiciousVehicle-list-item bd_f2f2f2 color_4d4d4d"
                        v-for="(items, index) in item.clueInfoDOList"
                        :key="index"
                      >
                        <div
                          class="researchReport-main-content-info-suspiciousVehicle-list-item-img"
                          @click="showImgPreview(items.id)"
                        >
                          <img
                            :src="items.picUrl"
                            style="width: 88px; height: 88px"
                            v-if="items.picUrl"
                          />
                          <img
                            src="@/assets/images/clueManage/default_img.png"
                            class="w100"
                            v-else
                          />
                        </div>
                        <div>
                          <div
                            class="researchReport-main-content-info-suspiciousVehicle-list-item-flex"
                          >
                            <i class="h-icon-info_time fs20 color_999"></i>
                            <p :title="items.passTime">{{ items.passTime }}</p>
                          </div>
                          <div
                            class="researchReport-main-content-info-suspiciousVehicle-list-item-flex"
                          >
                            <i class="h-icon-info_location fs20 color_999"></i>
                            <p :title="items.placeAddress">
                              {{
                                items.placeAddress
                                  ? items.placeAddress
                                  : "暂无地点"
                              }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <p>暂无数据</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </h-layout-content>
      <h-layout-aside width="300px" class="researchReport-aside">
        <div class="pl20 pt10">
          <ul class="researchReport-aside-list">
            <li
              v-for="item in timeAxisList"
              :key="item.id"
              :class="[
                'fs14 lh40 por pl20 cup',
                timeAxisTitle == item.id ? 'active' : '',
              ]"
              @click="scrollDistance(item.distance, item.id)"
            >
              {{ item.content }}
              <div
                v-if="item.archiveCaseDO"
                class="researchReport-aside-list-archiveCaseDO"
              >
                关联案件{{ item.archiveCaseDO }}
              </div>
            </li>
          </ul>
        </div>
      </h-layout-aside>
    </h-layout>
    <c-h-img-preview ref="cHImgPreview"></c-h-img-preview>
  </h-layout>
</template>

<script>
import helper from "@/helper";
import "@/filters";
import $ from "jquery";
import api from "@/api";
import rest from "@/rest";
import breadcrumbNav from "../../../components/breadcrumbNav.vue";
import cHImgPreview from "../../../components/c-h-img-preview.vue";

export default {
  data() {
    return {
      loading: false,
      idCard: this.$route.query.idCard,
      source: this.$route.query.source,
      humanId: this.$route.query.humanId,
      breadcrumbNavObj: [
        {
          name: "疑似人员管理",
          color: "#666",
        },
        {
          name: "研判报告",
          color: "#333",
        },
      ],
      mainObj: {
        // main 内容的显隐
        showBasicInfo: true,
        showResearchResults: true,
      },
      timeAxisTitle: "basic_info",
      timeAxisList: [],
      resetTimeAxisList: [
        {
          content: "嫌疑人基本信息",
          id: "basic_info",
        },
        {
          content: "研判结果",
          id: "research_results",
        },
      ],
      personInfoObj: {}, // 人员信息
      researchResult: {}, // 研判报告结果
      suspiciousCarList: [], // 可疑车辆
      exportLoading: false,
    };
  },
  components: {
    breadcrumbNav,
    cHImgPreview,
  },
  mounted() {
    this.init();
  },
  methods: {
    throttle: helper.throttle,
    handleExportReport() {
      if (this.researchResult.imageClueNum > 500) {
        this.$message.error(
          "研判报告中线索图片超过500条，请删除后再导出！",
          3000
        );
        return;
      }
      if (!this.exportLoading) {
        this.exportLoading = true;
        // 导出研判报告接口
        let researchResult = this.researchResult;
        for (let i in researchResult) {
          researchResult[i] == null && (researchResult[i] = "");
        }
        rest
          .downloadReport(api.researchReport.exportReport, {
            humanId: this.personInfoObj.humanId,
          })
          .always(() => {
            this.exportLoading = false;
          });
      }
    },
    init() {
      let that = this;
      this.loading = true;
      this.timeAxisList = [];
      let asideList = [];
      that.getPersonInfo();
      that.reportResult(asideList);
    },
    reportResult(asideList) {
      let that = this;
      // 研判报告结果接口
      rest
        .post(api.researchReport.reportSummary, {
          humanId: that.humanId,
        })
        .done(function (res) {
          if (helper.isSuccess(res)) {
            let result = res.data;
            asideList = [...that.resetTimeAxisList];
            for (let item of result.suspiciousBikeInfoVOList) {
              asideList.push({
                id: item.suspiciousBikeName,
                content: item.suspiciousBikeName,
                archiveCaseDO: item.archiveCaseDO && item.archiveCaseDO.code,
              });
            }
            result.suspiciousBikeInfoVOList.forEach((item) => {
              item.picUrlDefault = false;
              item.flag = true;
            });
            that.suspiciousCarList = result.suspiciousBikeInfoVOList;
            that.researchResult = result;
            that.$nextTick(() => {
              asideList.forEach((item) => {
                that.timeAxisList.push({
                  distance: $(`#${item.id}`).offset().top,
                  id: item.id,
                  content: item.content,
                  archiveCaseDO: item.archiveCaseDO,
                });
              });
              let timeAxisListCopy = [...that.timeAxisList].reverse();
              $(".researchReport-main").scroll(() => {
                let scrollHeight = $(".researchReport-main").scrollTop();
                for (let item of timeAxisListCopy) {
                  if (scrollHeight > item.distance - 100) {
                    that.timeAxisTitle = item.id;
                    return false;
                  }
                }
              });
            });
            that.loading = false;
          } else {
            that.$message.error(res.msg);
            that.loading = false;
          }
        })
        .catch((err) => {
          this.$message.error(err);
          this.loading = false;
        });
    },
    getPersonInfo() {
      // 获取人员信息接口
      let that = this;
      rest
        .get(api.clueManage.clueFindPersonInfo, {
          humanId: that.humanId,
        })
        .done(function (res) {
          if (helper.isSuccess(res)) {
            that.personInfoObj = res.data;
            console.log(that.personInfoObj);
          } else {
            that.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
          that.loading = false;
        });
    },
    // 返回上一页
    goBack() {
      if (this.source == "personList") {
        this.$router.push(`/home/${this.source}`);
      } else if (this.source == "clueManage") {
        this.$router.push({
          path: `/home/${this.source}`,
          query: { idCard: this.humanId },
        });
      }
    },
    // 查看大图
    showImgPreview(id) {
      let list = [];
      let num = 0;
      this.suspiciousCarList.forEach((items) => {
        items.clueInfoDOList.forEach((item) => {
          item.picUrl && list.push(item);
        });
      });
      list.forEach((item, index) => {
        item.url = item.picUrl;
        if (item.id == id) {
          num = index;
        }
      });
      this.$refs.cHImgPreview.imgPreviewShow(list, num, "researchReport");
    },
    // 滚动距离
    scrollDistance(distance, id) {
      this.timeAxisTitle = id;
      $(".researchReport-main")
        .stop()
        .animate({ scrollTop: distance - 50 }, 200);
    },
    errorImgFn(itemImg) {
      itemImg.picUrlDefault = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.researchReport {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #f2f2f2;
  &-main {
    &-content {
      width: 1343px;
      margin: 0 auto;
      &-header {
        &-title {
          &:before {
            content: "";
            width: 206px;
            height: 12px;
            background: url("../../../assets/images/researchReport/header_decorate.png");
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        &-export {
          position: fixed;
          width: calc(100% - 300px - 10px);
          height: 48px;
          background: rgba(255, 255, 255, 0.8);
          top: 50px;
          right: 300px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          &-button {
            margin-right: 2rem;
          }
          z-index: 200;
        }
      }
      &-info {
        &-comTitle {
          width: 100%;
          h2 {
            border: none;
            display: inline-block;
            box-sizing: border-box;
            background-image: linear-gradient(#fff, #fff),
              linear-gradient(to right, #3c90f8, #f2f2f2);
            font-weight: 300;
            color: #333;
            padding: 1px;
            border-radius: 100px;
            background-clip: content-box, padding-box;
            transition: filter 0.5s ease;
            z-index: 1;
            p {
              padding: 0 30px 0 10px;
            }
            .arrow {
              position: absolute;
              top: -6px;
              right: 0;
              color: #77b2fb;
              transition: all 0.2s;
              &.active {
                transform: rotate(-180deg);
              }
            }
          }
          &:before {
            content: "";
            width: 100%;
            height: 1px;
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            transform: translateY(-50%);
            background: #ddd;
          }
          &:after {
            content: "";
            background: url("../../../assets/images/researchReport/title_icon_04.png");
            -webkit-background-size: 100% 100%;
            background-size: 100% 100%;
            width: 28px;
            height: 28px;
            position: absolute;
            top: 43%;
            left: -35px;
            transform: translateY(-50%);
          }
        }
      }
      .researchReport-main-content-info-basic {
        .researchReport-main-content-info-comTitle {
          &:after {
            background: url("../../../assets/images/researchReport/title_icon_01.png");
          }
        }
        &-flex {
          display: flex;
          &-imgWrap {
            width: 150px;
          }
          &-wordWrap {
            flex: 1;
            &-labelList {
              width: 350px;
              li {
                font-size: 12px;
                color: #666;
                display: inline-block;
                padding: 1px 7px 0;
                margin-right: 3px;
                margin-bottom: 4px;
                border: 1px solid rgba(0, 0, 0, 0.12);
                border-radius: 2px;
                background: #f6f6f6;
              }
            }
          }
        }
      }
      &-results {
        .researchReport-main-content-info-comTitle {
          &:after {
            background: url("../../../assets/images/researchReport/title_icon_02.png");
          }
        }
        &-details {
          text-align: justify;
          span {
            color: #f15a00;
          }
        }
      }
      .researchReport-main-content-info-suspiciousVehicle {
        .researchReport-main-content-info-comTitle {
          &:after {
            background: url("../../../assets/images/researchReport/title_icon_03.png");
          }
        }
        &-listTitle {
          margin-bottom: 1rem;
          font-family: PingFangSC-Semibold;
          font-size: 14px;
          color: #374a6a;
          font-weight: bold;
          &::before {
            content: "";
            display: inline-block;
            width: 10px;
            height: 10px;
            transform: rotate(45deg);
            background: #627c8f;
            border-radius: 1px;
            margin-right: 0.3rem;
          }
          > span {
            font-weight: normal;
          }
        }
        .researchReport-main-content-info-suspiciousVehicle-info {
          > p {
            font-family: PingFangSC-Semibold;
            font-size: 14px;
            color: #374a6a;
            font-weight: bold;
            &::before {
              content: "";
              display: inline-block;
              width: 10px;
              height: 10px;
              transform: rotate(45deg);
              background: #627c8f;
              border-radius: 1px;
              margin-right: 0.5rem;
            }
          }
          > div {
            margin-top: 1rem;
            display: flex;
            flex-wrap: wrap;
            opacity: 0.7;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #000000;
            > div {
              width: 30%;
              margin-top: 0.5rem;
              > span {
                opacity: 0.7;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #000000;
              }
              &:last-child {
                width: 100%;
              }
              &:nth-last-child(2) {
                flex: 1;
              }
            }
          }
        }
        .researchReport-main-content-info-suspiciousVehicle-list {
          &-item {
            display: flex;
            margin: 0 10px 10px 0;
            width: 254px;
            align-items: center;
            &-img {
              margin: 0;
              height: 88px;
              width: 88px;
            }
            &-flex {
              width: 160px;
              display: flex;
              i {
                position: relative;
                top: -2px;
              }
              > p {
                overflow: hidden;
                text-emphasis: none;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
      .researchReport-main-content-info-case {
        &-details {
          &-base {
            &-flex {
              display: flex;
              span {
                flex: 0 0 70px;
              }
              p {
                flex: 1;
                text-align: justify;
                padding-right: 20px;
                line-height: 24px;
              }
            }
          }
          &-photo {
            &-item {
              margin: 0 10px 10px 0;
              width: 224px;
              float: left;
              &-img {
                height: 222px;
              }
              &-flex {
                display: flex;
                i {
                  flex: 0 0 23px;
                  position: relative;
                  top: 0;
                }
                p {
                  flex: 1;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
              }
            }
          }
          &-file {
            &-list {
              p {
                border: 1px solid #b1c4f9;
              }
            }
          }
          &-other {
            &-list {
              &-item {
                border: 1px solid #b1c4f9;
                ::v-deep .el-checkbox__input {
                  padding: 0;
                }
              }
            }
          }
        }
      }
    }
  }
  .researchReport-aside {
    background: #f2f2f2;
    .researchReport-aside-list {
      li {
        &:before {
          content: "";
          width: 1px;
          height: 100%;
          background: #ccc;
          position: absolute;
          top: 0;
          left: 0;
        }
        &:after {
          content: "";
          width: 7px;
          height: 7px;
          border-radius: 100%;
          background: #ccc;
          position: absolute;
          top: 17px;
          left: -3px;
        }
        &.active {
          color: #77b2fb;
          &:after {
            width: 9px;
            height: 9px;
            background: #77b2fb;
            left: -4px;
          }
        }
        &:hover {
          color: #77b2fb;
          &:after {
            width: 9px;
            height: 9px;
            background: #77b2fb;
            left: -4px;
          }
        }
      }
      &-archiveCaseDO {
        width: 168px;
        background: rgba(216, 216, 216, 0.18);
        font-family: PingFangSC-Regular;
        color: #999999;
        letter-spacing: 0;
        line-height: 24px;
      }
    }
  }
}
</style>
