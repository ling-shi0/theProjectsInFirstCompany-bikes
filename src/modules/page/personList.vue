<!--
 * @Descripttion: 首页
 * @version:
 * @Author: xueyilu
 * @Date: 2020-10-23 10:29:25
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-01-05 15:54:00
 -->
<template>
  <div class="personList" v-loading="Loading">
    <el-row class="personList_header">
      <el-col :span="16">
        <ul class="clearfix header">
          <li
            :class="{ active: tabType === 'follow' }"
            @click="changeTab('follow')"
          >
            关注人员
            <span>({{ followObj.total }})</span>
            <i style="left: 84px" v-if="listIsUpdateObj.concernHasNew"></i>
          </li>
          <li
            :class="{ active: tabType === 'system' }"
            @click="changeTab('system')"
          >
            系统推送人员
            <span>({{ pushObj.total }})</span>
            <i style="left: 115px" v-if="listIsUpdateObj.systemHasNew"></i>
          </li>
        </ul>
      </el-col>
      <el-col
        :span="4"
        class="right pr10"
        style="
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        "
      >
        <el-button
          type="primary"
          icon="h-icon-export"
          class="import-button top-button art-icon-button"
          style="text-indent: 0px"
          @click="exportClues"
          >导出线索</el-button
        >
      </el-col>
      <el-col :span="4" class="right pr10">
        <el-row>
          <el-col :span="20" style="display: flex; flex-flow: row nowrap">
            按
            <el-select
              style="flex: 1; margin: 0 5px"
              v-model="fromObj.formType.sortType"
              placeholder="请选择"
              @change="goSearch"
            >
              <el-option key="" label="线索推送时间" value="" selected>
              </el-option>
              <el-option key="1" label="一人多骑数量" value="1"> </el-option>
            </el-select>
            排序
          </el-col>
          <el-col :span="4">
            <i
              style="position: relative; height: 42px"
              class="searchConditionIcon"
              @click="showSearchConditioFn"
            >
              <i
                :class="[
                  'fs24',
                  'cup',
                  showSearchCondition ? 'h-icon-filter_f' : 'h-icon-filter',
                ]"
              >
              </i>
            </i>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div class="personList_form" v-if="showSearchCondition">
      <el-form
        :inline="true"
        :model="fromObj.formType"
        class="demo-form-inline"
      >
        <el-row class="personList_form-row">
          <el-col :span="8" class="personList_form-row-col">
            <p>姓名</p>
            <el-form-item :error="errorMes.name" style="width: 100%">
              <el-input
                v-model="fromObj.formType.name"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="personList_form-row-col">
            <p>身份证号</p>
            <el-form-item :error="errorMes.idCard" style="width: 100%">
              <el-input
                v-model="fromObj.formType.idCard"
                placeholder="请输入身份证号"
              ></el-input
            ></el-form-item>
          </el-col>
          <el-col :span="8" class="personList_form-row-col">
            <p>线索采集区域</p>
            <tree-select
              ref="treeSelect"
              v-model="fromObj.formType.areasArr"
              clearable
              multiple
              collapse-tags
              node-key="indexCode"
              parent-key="parentIndexCode"
              :tree-data="infoObj.list.areaList"
              :display-labels="createDepartmentsLabels"
              lazy
              :load="loadNode"
              :props="{
                label: 'name',
                isLeaf: 'leaf',
                icon: 'h-icon-info_organization',
              }"
              placeholder="全部"
              :removeChildKeys="false"
            />
          </el-col>
          <el-col :span="8" class="personList_form-row-col">
            <p>前科人员</p>
            <el-form-item style="width: 100%">
              <el-select v-model="fromObj.formType.ifCriminal">
                <el-option label="全部人员" value="0"></el-option>
                <el-option label="前科人员" value="1"> </el-option>
                <el-option label="非前科人员" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="personList_form-row-col">
            <p>职业</p>
            <el-form-item style="width: 100%">
              <el-select
                v-model="fromObj.formType.personLabel"
                clear
                placeholder="未知"
              >
                <el-option
                  v-for="item in labelList"
                  :label="item.name"
                  :key="item.code"
                  :value="item.code"
                >
                </el-option> </el-select
            ></el-form-item>
          </el-col>
          <el-col :span="8" class="search_btn_box">
            <el-form-item>
              <el-button type="info" @click="throttle(obj, goSearch, 1000)()"
                >查询</el-button
              >
              <el-button @click="resetFrom()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div
      v-if="
        (tabType === 'follow' &&
          followObj.content.suspiciousPersonDTOList &&
          followObj.content.suspiciousPersonDTOList.length > 0) ||
        (tabType === 'system' &&
          pushObj.content.suspiciousPersonDTOList &&
          pushObj.content.suspiciousPersonDTOList.length > 0)
      "
      class="scroll-bar-wrap pt10"
    >
      <div class="scroll-bar" style="width: 100%; height: 100%">
        <el-row style="width: 100%; height: 100%">
          <el-col
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="8"
            class="main_list"
            v-for="(item, index) in tabType === 'follow'
              ? followObj.content.suspiciousPersonDTOList
              : pushObj.content.suspiciousPersonDTOList"
            :key="item.id"
          >
            <div @click="goClueManage(item.humanId)" style="cursor: pointer">
              <div
                style="height: 226px; display: flex; padding: 0"
                :class="
                  !item.readFlag
                    ? 'active pt10 pl10 pr10 pb10'
                    : 'pt10 pl10 pr10 pb10'
                "
              >
                <div class="one" style="width: 64%">
                  <div class="img_box">
                    <img
                      :src="item.picUrl"
                      v-if="item.picUrl"
                      style="height: 160px; width: 160px"
                    />
                    <div v-else>
                      <img
                        src="../../assets/images/personList/head_sex_01.png"
                        style="height: 160px; width: 160px"
                        v-if="item.gender === 'male'"
                      />
                      <img
                        src="../../assets/images/personList/head_sex_02.png"
                        style="height: 160px; width: 160px"
                        v-else
                      />
                    </div>
                    <div class="img_box-criminal" v-if="item.ifCriminal">
                      前科人员
                    </div>
                  </div>

                  <div class="word_box">
                    <div class="name-age">
                      <h2 class="name" :title="item.name || '未知姓名'">
                        {{ item.name || "未知姓名" }}
                      </h2>
                      <div class="por age-sex">
                        <img
                          :src="getIcon(item.gender)"
                          v-if="
                            item.gender === 'female' || item.gender === 'male'
                          "
                          class="sex"
                        />
                        <p class="age">{{ item.age && item.age + "岁" }}</p>
                      </div>
                    </div>
                    <p style="margin-top: 4px">
                      {{ item.idCard }}
                      <i
                        class="h-icon-copy fs20 por copy cup copyIconMain"
                        :data-clipboard-text="item.idCard"
                        title="点击复制身份证号"
                        v-if="item.idCard"
                        @click.stop="copyText(item.idCard)"
                      ></i>
                    </p>
                    <h3 class="location" :title="item.censusRegister">
                      籍贯: {{ item.censusRegister || "未知" }}
                    </h3>

                    <!-- 标签如果超过3个，则多出部分以省略号代替 -->
                    <div
                      v-if="item.labelList || item.personLabelName"
                      class="labelList"
                      style="margin-top: 23px; width: 200px"
                    >
                      <li v-if="item.personLabelName">
                        {{ item.personLabelName }}
                      </li>
                      <li
                        v-for="(itemLabel, index) in item.labelList"
                        :key="itemLabel.labelInfoId"
                        :title="itemLabel.labelName"
                        v-if="index < 2"
                      >
                        {{ itemLabel.labelName }}
                      </li>
                      <li
                        v-if="item.labelList.length > 2"
                        :title="showAllLabel(item.labelList)"
                      >
                        ...
                      </li>
                      <!-- <li class="more" v-if="0">
                      <span class="iconfont" style="font-size: 14px;"
                        >&#xe683;</span
                      >更多
                      </li>-->
                    </div>
                    <!-- ****** -->
                  </div>
                </div>
                <div class="two">
                  <el-badge
                    :is-dot="item.cycleIncrement > 0"
                    style="margin-top: 19.5px; margin-left: 12px"
                  >
                    <div
                      :class="{ active: item.cycleIncrement }"
                      v-if="item.cycleCount"
                      style="
                        width: 104px;
                        height: 28px;
                        font-size: 14px;
                        text-align: center;
                        line-height: 28px;
                        color: #e46115;
                        background: rgba(226, 107, 29, 0.02);
                        border: 1px solid #f0880b;
                      "
                    >
                      一人多骑 {{ item.cycleCount || 0 }}
                    </div>
                  </el-badge>
                  <h2 style="margin-left: 12px">
                    <img
                      src="@/assets/images/personList/arealist.png"
                      class="por"
                      style="vertical-align: middle; width: 16px; top: -2px"
                    />
                    活动区域
                  </h2>
                  <div class="area_list">
                    <!-- 活动区域如果超过5个，则多出部分以省略号代替 -->
                    <ul class="clearfix">
                      <!-- <li
                        v-for="itemArea in item.areaClueList"
                        :key="itemArea.activityRegionCode"
                      >
                        {{ itemArea.activityRegion }}
                      </li> -->
                      <li
                        v-for="(itemArea, index) in item.areaClueList"
                        :key="itemArea.activityRegionCode"
                        :title="itemArea.activityRegion"
                        v-if="index < 4"
                      >
                        {{
                          itemArea.activityRegion +
                          (index === 3 || index === item.areaClueList.length - 1
                            ? ""
                            : "、")
                        }}
                      </li>
                      <span>
                        <li
                          v-if="item.areaClueList.length > 4"
                          :title="showAllArea(item.areaClueList)"
                        >
                          ...
                        </li>
                      </span>
                    </ul>

                    <!-- ***** -->
                  </div>
                  <h2 style="margin: 0 12px">
                    <img
                      src="../../assets/images/personList/personListClue.png"
                      class="por"
                      style="vertical-align: middle; width: 16px; top: -2px"
                    />
                    线索汇总
                    {{
                      item.imageCount +
                      item.videoCount +
                      item.fileCount +
                      item.trackCount
                    }}
                  </h2>
                </div>
                <ul class="btn_box clearfix">
                  <li
                    v-if="holographic"
                    @click.stop="gpHolographicArchives(item)"
                    style="top: -2px; font-size: 14px"
                  >
                    <img
                      src="../../assets/images/personList/icon_01.png"
                      class="por"
                      style="vertical-align: middle; width: 22px; top: -2px"
                    />
                    全息档案
                  </li>
                  <li
                    v-if="relationship"
                    @click.stop="goRelationshipAnalysis(item)"
                    style="top: -2px; font-size: 14px"
                  >
                    <img
                      src="../../assets/images/personList/icon_02.png"
                      class="por"
                      style="vertical-align: middle; width: 22px; top: -2px"
                    />
                    关系分析
                  </li>
                  <li
                    @click.stop="goResearchReport(item.idCard, item.humanId)"
                    class="por"
                    style="top: -2px; font-size: 14px"
                  >
                    <i class="h-icon-plan fs24"></i>
                    <i class="por" style="top: -7px">研判报告</i>
                  </li>
                </ul>
                <i
                  class="h-icon-star_f fs20 star cup"
                  style="
                    color: #f5a623;
                    margin-top: 8px;
                    margin-right: 4px;
                    font-size: 1.5rem;
                  "
                  v-if="tabType == 'follow'"
                  @click.stop="unFollow(item, index)"
                ></i>
                <i
                  class="h-icon-star fs20 star cup"
                  style="
                    color: #f5a623;
                    margin-top: 8px;
                    margin-right: 4px;
                    font-size: 1.5rem;
                  "
                  v-else
                  @click.stop="addFollow(item, index)"
                ></i>
                <div class="deleteBut">
                  <i class="h-icon-delete" @click.stop="deleteItem(item)"></i>
                </div>

                <img
                  src="../../assets/images/personList/new1.png"
                  class="new"
                  v-if="tabType === 'system' && item.newFlag"
                />
                <h6 class="line"></h6>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="scroll-bar-wrap pt10" v-else>
      <h-empty size="md" description="暂无数据" />
    </div>
    <el-pagination
      class="pl10 pr10"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="fromObj.formType.pageNo"
      :page-sizes="[12, 24, 48]"
      :page-size="fromObj.formType.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tabType === 'follow' ? followObj.total : pushObj.total"
      style="width: 100%; background: white; height: 56px"
    ></el-pagination>
    <input v-show="0" id="copyinput" />
  </div>
</template>

<script>
import helper from "@/helper";
import "@/filters";
import $ from "jquery";
import api from "@/api";
import rest from "@/rest";
import { deepClone } from "@hui-pro/utils";
import Helper from "@/upload/helper";
import treeSelect from "@/components/tree-select.vue";
import maleIcon from "@/assets/images/personList/male.png";
import femaleIcon from "@/assets/images/personList/female.png";

export default {
  data() {
    return {
      Loading: true,
      tabType: "follow", // tab 的类型
      showSearchCondition: false, // 显示搜索条件
      fromObj: {
        // 搜素条件
        formList: {
          sortTypeList: [
            {
              // 排序类型下拉列表
              value: "1",
              label: "按一人多骑排序",
            },
            {
              value: "2",
              label: "按周边触网排序",
            },
            {
              value: "3",
              label: "按更新时间排序",
            },
          ],
          clueTagList: [], // 线索标签下拉列表
          areaList: [], // 活动区域下拉列表
        },
        formType: {
          clueTag: "", // 线索标签下拉类型
          personTags: "", // 人员标签下拉类型
          name: "", // 名字
          idCard: "", // 身份证
          areas: "", // 活动区域
          areasArr: [], // 活动区域
          ifCriminal: "0",
          sortType: "",
          personLabel: "", // 职业
          pageNo: 1, // 第几页
          pageSize: 12, // 一页展示几条
        },
        ResetformType: {
          clueTag: "", // 线索标签下拉类型
          personTags: "", // 人员标签下拉类型
          name: "", // 名字
          idCard: "", // 身份证
          areas: "", // 活动区域
          personLabel: "", // 职业
          areasArr: [], // 活动区域
          ifCriminal: "0",
          sortType: "",
          pageNo: 1, // 第几页
          pageSize: 12, // 一页展示几条
        },
      },
      followObj: {
        // 关注人员
        content: [],
        total: 0,
        isAdd: false,
      },
      pushObj: {
        // 系统推送人员
        content: [],
        total: 0,
      },
      // listObj: {
      //   // 关注人员、系统推送人员的列表
      //   content: [],
      //   total: 0
      // },
      listIsUpdateObj: {},
      holographic: false,
      relationship: false,
      createDepartmentsList: [],
      createDepartmentsLabels: [],
      existsChildList: [],
      infoObj: {
        list: {
          areaList: [],
        },
        type: {
          areasArr: [], // 区域类型
          pageNo: 1,
          pageSize: 20,
        },
      },
      errorMes: { idCard: "", name: "" },
      obj: { timer: null },
      labelList: [],
    };
  },
  components: {
    treeSelect,
  },
  mounted() {
    this.getLabelList();
    this.init();
  },
  computed: {
    getNameInput() {
      return this.fromObj.formType.name;
    },
    getIdcardInput() {
      return this.fromObj.formType.idCard;
    },
  },
  beforeDestroy() {
    if (this.obj.timer) {
      clearTimeout(this.obj.timer);
      this.obj.timer = null;
    }
  },
  watch: {
    getNameInput: function (val) {
      var regEn = /[`~!@#$%^&*()-=_+<>?:"{},.\/;'[\]]/im;
      var regCn = /[！#￥（——）：；“”‘’、，|《。》？、【】[\]]/im;
      if (regEn.test(val) || regCn.test(val) || val.length > 50) {
        this.errorMes.name = "姓名格式有误";
        return false;
      } else {
        this.errorMes.name = "";
      }
    },
    getIdcardInput: function (val) {
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证格式验证
      if (val && !regIdNo.test(val)) {
        this.errorMes.idCard = "身份证号格式有误";
        return false;
      } else {
        this.errorMes.idCard = "";
      }
    },
  },
  methods: {
    throttle: helper.throttle,
    init() {
      let that = this;
      // 关注人员、系统推送人员是否有更新
      rest
        .get(api.personList.suspiciousIsUpdate)
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.listIsUpdateObj = res.data;
            that.changeTab("follow");
            // ["holographicArchives", "relationshipAnalysis"].forEach(items => {
            //   if (that.listIsUpdateObj[items]) {
            //     sessionStorage.setItem(items, that.listIsUpdateObj[items]);
            //   }
            // });
          } else {
            that.$message.error(res.msg);
          }
        })
        .always(() => {
          that.Loading = false;
          // that.$message.error("网络连接有误，请检查网络！", 3000);
        });
      // 获取隐藏功能按钮
      rest
        .get(api.personList.getFunctionStatus, {})
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.holographic = res.data.holographic;
            that.relationship = res.data.relationship;
          } else {
            that.$message.error(res.msg);
          }
        })
        .catch(() => {
          // that.$message.error("网络连接有误，请检查网络！", 3000);
        });
    },
    // 关注人员接口
    followPeople(str) {
      let that = this;
      that.loading = true;
      rest
        .post(api.personList.findConcernPerson, that.fromObj.formType)
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.followObj = res.data;
            // if (str) {
            //   that.listObj = res.data;
            // }
            that.followObj.content.suspiciousPersonDTOList.forEach((item) => {
              if (item.pushState === 1) {
                that.followObj.isAdd = true;
              }
            });
          } else {
            that.$message.error(res.msg);
          }
          // that.setScrollHeight();
        })
        .always(() => {
          // that.$message.error("网络连接有误，请检查网络！", 3000);
          if (str) that.Loading = false;
          if (this.obj.timer && str) {
            clearTimeout(this.obj.timer);
            this.obj.timer = null;
          }
        });
    },
    // 系统推送人员接口
    pushPeople(str) {
      let that = this;
      that.loading = true;
      rest
        .post(api.personList.findUnConcernPerson, that.fromObj.formType)
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.pushObj = res.data;
            // if (str) {
            //   that.listObj = res.data;
            // }
          } else {
            that.$message.error(res.msg);
          }
          // that.setScrollHeight();
        })
        .always(() => {
          // that.$message.error("网络连接有误，请检查网络！", 3000);
          if (str) that.Loading = false;
          if (this.obj.timer && str) {
            clearTimeout(this.obj.timer);
            this.obj.timer = null;
          }
        });
    },
    // 关注人员、系统推送人员 tab切换
    changeTab(type) {
      this.tabType = type;
      this.resetFrom();
      if (helper.get("personListPageNo")) {
        helper.set({ personListPageNo: 1 });
      }
      if (type == "follow") {
        this.followPeople("dataToList");
        this.pushPeople();
      } else {
        this.pushPeople("dataToList");
        this.followPeople();
      }
    },
    // 分页 - 每页多少条
    handleSizeChange(val) {
      this.fromObj.formType.pageSize = val;
      if (this.tabType == "follow") {
        this.followPeople("dataToList");
      } else {
        this.pushPeople("dataToList");
      }
    },
    // 分页 - 当前页
    handleCurrentChange(val) {
      this.fromObj.formType.pageNo = val;
      if (this.tabType == "follow") {
        this.followPeople("dataToList");
      } else {
        this.pushPeople("dataToList");
      }
    },
    // go 研判报告
    goResearchReport(idCard, humanId) {
      this.$router.push({
        path: "/home/researchReport",
        query: { idCard: idCard, source: "personList", humanId },
      });
    },
    // go 线索管理
    goClueManage(idCard) {
      const { protocol, hostname, port } = location;
      let prefix = `${protocol}//${hostname}`;
      if (port) {
        prefix += `:${port}`;
      }
      helper.set({
        personTabType: this.tabType,
        personListPageNo: this.fromObj.formType.pageNo,
        personListPageSize: this.fromObj.formType.pageSize,
      });
      // this.$router.push({path:'/home/clueManage', query:{idCard: idCard}})
      if (top === window) {
        let routeData = this.$router.resolve({
          path: "/home/clueManage",
          query: { idCard: idCard },
        });
        window.open(routeData.href, "_blank");
        return false;
      }
      top.window.goToApp({
        name: "线索管理",
        url: `${prefix}/erim-web/#/home/clueManage?idCard=${idCard}`,
        param: ``,
        callback: { func: "", param: {} },
        reload: true,
      });
    },
    // 搜索条件显隐
    showSearchConditioFn() {
      this.showSearchCondition = !this.showSearchCondition;
      // this.setScrollHeight();
    },
    // 设置 main 的高度
    setScrollHeight() {
      this.$nextTick(() => {
        var windowHeight = $(window).height(); // 可视区高度
        var mainTop = document.getElementsByTagName("main")[0]["offsetTop"]; //滚动元素离顶部的距离
        var scrollHeight = windowHeight - mainTop - 58; // 滚动高度
        $("main").css({ height: scrollHeight + "px" });
      });
    },
    // 点击搜索
    goSearch() {
      if (this.errorMes.idCard || this.errorMes.name) {
        return false;
      }
      this.Loading = true;
      if (this.fromObj.formType.areasArr.length > 0) {
        this.fromObj.formType.areas = this.fromObj.formType.areasArr.join(",");
      } else {
        this.fromObj.formType.areas = "";
      }
      if (this.tabType == "follow") {
        this.followPeople("dataToList");
      } else {
        this.pushPeople("dataToList");
      }
    },
    // 点击重置
    resetFrom() {
      this.fromObj.formType = deepClone(this.fromObj.ResetformType);
      this.$refs.treeSelect && this.$refs.treeSelect.clearSelected();
    },
    // 取消关注
    unFollow(item, index) {
      let that = this;
      rest
        .post(api.personList.suspiciousDelete, {
          suspiciousPersonId: item.id,
          humanId: item.humanId,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            // that.init();
            // that.followPeople("dataToList");
            // that.pushPeople();
            that.followObj.content.suspiciousPersonDTOList.splice(index, 1);
            this.changeTotal();
            that.$message.success("取消成功！");
          } else {
            that.$message.error(res.msg);
          }
        })
        .always(() => {
          // that.$message.error("网络连接有误，请检查网络！", 3000);
          that.Loading = false;
        });
    },
    // 添加关注
    addFollow(item, index) {
      let that = this;
      rest
        .post(api.personList.suspiciousAdd, {
          suspiciousPersonId: item.id,
          humanId: item.humanId,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            // that.init();
            // that.followPeople();
            // that.pushPeople("dataToList");
            that.pushObj.content.suspiciousPersonDTOList.splice(index, 1);
            this.changeTotal();
            that.$message.success("关注成功！");
          } else {
            that.$message.error(res.msg);
          }
        })
        .always(() => {
          // that.$message.error("网络连接有误，请检查网络！", 3000);
          that.Loading = false;
        });
    },
    // go 全息档案
    gpHolographicArchives(item) {
      let that = this;
      rest
        .get(api.personList.personnelArchives, {
          val: item.idCard,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            window.open(res.data, "_blank");
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // go 关系分析
    goRelationshipAnalysis(item) {
      let that = this;
      rest
        .get(api.personList.personnelShip, {
          val: item.idCard,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            window.open(res.data, "_blank");
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 复制
    copyText(text) {
      let that = this;
      this.$copyText(text).then(
        function (e) {
          that.$message.success("复制成功！");
        },
        function (e) {
          that.$message.error(e);
        }
      );
    },
    async loadNode(node, resolve) {
      const data = await this.getNodeData();
      resolve(data);
    },
    getNodeData() {
      let that = this;
      return new Promise((resolve, reject) => {
        rest
          .post(api.personList.getActivityLocation, {
            requestType: 0,
            treeCode: 0,
            resourceType: "CAMERA",
            orgIndexCode: -1,
          })
          .done((res) => {
            if (helper.isSuccess(res)) {
              let temp = res.data;
              function allPrpos(obj) {
                for (var p in obj) {
                  if (
                    obj[p]["children"] &&
                    Array(obj[p]["children"])[0].length === 0
                  ) {
                    obj[p]["isLeaf"] = true;
                  }
                  allPrpos(obj[p]["children"]);
                }
              }
              allPrpos(temp);
              resolve(temp);
            } else {
              that.$message.error(res.msg);
            }
          })
          .catch(() => {
            // that.$message.error("网络连接有误，请检查网络！", 3000);
            that.Loading = false;
          });
      });
    },
    getCreateDepartments(indexCode) {
      const { data } = this.getNodeData(indexCode);
      this.createDepartmentsList = data;
    },
    // 显示人员的全部标签
    showAllLabel(data) {
      let temp = [];
      data.forEach((item) => {
        temp.push(item.labelName);
      });
      return temp.join("、");
    },
    // 显示全部活动区域
    showAllArea(data) {
      let temp = [];
      data.forEach((item) => {
        temp.push(item.activityRegion);
      });
      return temp.join("、");
    },
    getIcon(gender) {
      return gender === "male" ? maleIcon : femaleIcon;
    },
    getLabelList() {
      rest.post(api.clueManage.personLabelList, {}).done((res) => {
        if (helper.isSuccess(res)) {
          this.labelList = res.data;
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    deleteItem(item) {
      this.$confirm("确定删除该人员?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          rest
            .get(api.personList.deletePerson, {
              humanId: item.humanId,
            })
            .done((res) => {
              if (helper.isSuccess(res)) {
                this.$message.success("删除成功");
                this.goSearch();
              } else {
                this.$message.error(res.msg);
              }
            });
        })
        .catch(() => {});
    },
    changeTotal() {
      let that = this;
      rest
        .post(api.personList.findUnConcernPerson, that.fromObj.formType)
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.pushObj.total = res.data.total;
          } else {
            that.$message.error(res.msg);
          }
        });
      rest
        .post(api.personList.findConcernPerson, that.fromObj.formType)
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.followObj.total = res.data.total;
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    exportClues() {
      let ids;
      if (this.tabType === "follow") {
        if (!this.followObj.content.suspiciousPersonDTOList.length) {
          this.$message.warning("没有关注人员!");
          return;
        }
        ids = this.followObj.content.suspiciousPersonDTOList.map(
          (item) => item.humanId
        );
      } else {
        if (!this.pushObj.content.suspiciousPersonDTOList.length) {
          this.$message.warning("没有系统推送人员!");
          return;
        }
        ids = this.pushObj.content.suspiciousPersonDTOList.map(
          (item) => item.humanId
        );
      }
      if (!this.helper) this.helper = new Helper();
      rest
        .post(api.personList.exportHuman, {
          humanIds: ids,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.helper.run(res.data.url).listen((comment) => {});
          } else {
            that.$message.error(res.msg);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.personList {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .personList_header {
    width: 100%;

    height: 42px;
    line-height: 42px;
    border-bottom: 1px solid #ddd;
    ::v-deep .el-badge__content.is-fixed {
      top: 5px !important;
    }
    ul {
      li {
        float: left;
        padding: 0 20px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.7);
        cursor: pointer;
        line-height: 40px;
        position: relative;
        &.active {
          color: rgba(32, 128, 247, 0.9);
          border-bottom: 1px solid rgba(32, 128, 247, 0.9);
        }
        span {
          font-size: 14px;
        }
        i {
          width: 5px;
          height: 5px;
          background: #fa3239;
          border-radius: 100%;
          position: absolute;
          top: 8px;
        }
      }
    }
    .right {
      text-align: right;
      > i {
        width: 30px;
        height: 30px;
        display: inline-block;
        line-height: 30px;
        text-align: center;
        margin-left: 10px;
        &.active {
          background: #eee;
        }
      }
    }
  }
  .personList_form {
    width: 100%;
    height: 160px;
    background: rgba(0, 0, 0, 0.04);
    padding: 10px 0 10px 10px;
    font-size: 12px;
    ::v-deep .el-select,
    .el-input,
    .el-cascader {
      width: 100%;
    }
    .demo-form-inline {
      .personList_form-row {
        .personList_form-row-col {
          padding-right: 10px;
          margin-bottom: 10px;
          height: 60px;
          p {
            margin-bottom: 3px;
          }
          .el-form-item {
            margin-bottom: 0;
            margin-right: 0;
          }
          ::v-deep .el-select {
            .el-input__inner {
              height: 32px !important;
            }
          }
        }
        .search_btn_box {
          padding-right: 10px;
          padding-top: 10px;
          text-align: right;
          ::v-deep button {
            height: 32px;
            line-height: 32px;
            padding: 0 20px;
          }
        }
      }
    }
  }
  .scroll-bar-wrap {
    width: 100%;
    flex: 1;
    border: 1px solid #fff;
    .main_list {
      padding: 0 10px;
      margin-bottom: 10px;
      > div {
        > div {
          &:hover {
            background: #ffffff;
            border: 1px solid #d9e9ff;
            border-radius: 8px;
            box-shadow: 0 2px 10px 0 rgba(82, 142, 186, 0.44);
          }
          background: #ffffff;
          border: 1px solid #d9e9ff;
          box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.04);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          &.active {
            border: 1px solid #f2a520;
          }
          .one {
            display: flex;
            flex-flow: row nowrap;
            padding-top: 17.5px;
            .img_box {
              margin: 0 0 48.5px 13px;
              height: 160px;
              width: 160px;
              cursor: pointer;
              position: relative;
              img {
                width: 100%;
                height: 100%;
              }
              &-criminal {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2000;
                width: 60px;
                height: 20px;
                color: white;
                font-size: 12px;
                text-align: center;
                background: rgb(229, 75, 45);
                &::after {
                  content: "";
                  width: 10px;
                  height: 20px;
                  position: absolute;
                  left: 60px;
                  top: 0;
                  border-style: solid;
                  border-width: 10px 5px 10px 5px;
                  border-color: rgb(229, 75, 45) transparent transparent
                    rgb(229, 75, 45);
                }
              }
            }
            .word_box {
              padding: 0 8px;
              flex: 1;
              width: 0;
              & > .name-age {
                width: 100%;
                font-size: 20px;
                color: #333;
                display: flex;
                flex-flow: row nowrap;
                & > .name {
                  font-size: 20px;
                  width: 50%;
                  flex: 1;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                }
                & > .age-sex {
                  display: block;
                  margin-top: 0;
                  width: 50%;
                  flex: 1;
                  font-weight: normal;
                  font-size: 14px;
                  color: #000;
                  position: relative;
                  text-indent: 40px;
                  & > .sex {
                    position: absolute;
                    top: 50%;
                    transform: translate(calc(-100% - 5px), -50%);
                    left: 40px;
                    font-weight: normal;
                    color: #ccc;
                    font-size: 14px;
                  }
                  & > .age {
                    white-space: nowrap;
                    margin-top: 0;
                    line-height: 30px;
                  }
                }
              }
              p {
                display: flex;
                font-size: 14px;
                color: #666;
              }
              h3 {
                color: #666;
                font-size: 14px;
                font-weight: normal;
              }
              div {
                margin-top: 5px;
                width: 150px;
                display: flex;
                flex-wrap: wrap;

                // display: -webkit-box;
                // text-overflow: ellipsis;
                // overflow: hidden;
                // -webkit-line-clamp: 1;
                // -webkit-box-orient: vertical;
                //
                li {
                  font-size: 14px;
                  color: #666;
                  list-style: none;
                  padding: 1px 5px;
                  margin-right: 2px;
                  margin-bottom: 4px;
                  border: 1px solid rgba(0, 0, 0, 0.12);
                  border-radius: 2px;
                  background: #f6f6f6;
                  max-width: 6rem;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                  &.more {
                    font-size: 14px;
                    border: 1px solid #fff;
                    color: #2196f3;
                  }
                }
              }
            }
          }
          .two {
            flex: 1;
            padding: 0;
            margin-left: 6px;
            h2 {
              font-weight: normal;
              color: #666;
              font-size: 14px;
              margin-top: 16px;
            }
            ul {
              li {
                font-size: 14px;
                position: relative;
                img {
                  display: none;
                }
                &.active {
                  color: #e46115;
                  border: 1px solid #e46115;
                  img {
                    display: inline-block;
                    position: absolute;
                    top: -11px;
                    right: -16px;
                  }
                }
              }
            }
            .area_list {
              height: 47px;
              width: calc(100% - 28px);
              margin-left: 28px;
              ul {
                width: 100%;
                li {
                  display: inline;
                  font-size: 14px;
                }
              }
            }
          }
          .btn_box {
            position: absolute;
            bottom: 5px;
            left: 10px;
            li {
              float: left;
              font-size: 12px;
              margin-right: 10px;
              cursor: pointer;
            }
          }
          .star {
            position: absolute;
            top: 0;
            right: 5px;
          }
          .new {
            width: 36px;
            position: absolute;
            top: 0;
            left: 0;
          }
          .line {
            &:before {
              content: "";
              width: 1px;
              height: 100%;
              background: #f2f2f2;
              position: absolute;
              transform: translate(-50%, -50%);
            }
            &:before {
              top: 50%;
              left: 65%;
            }
          }
        }
      }
    }
  }
  .el-pagination {
    font-weight: normal;
    border-top: 1px solid #ddd;
    text-align: right;
    ::v-deep .el-pagination__total {
      float: left;
    }
    ::v-deep .el-pagination__sizes {
      float: left;
    }
  }
}
.copyIconMain:hover {
  color: #0cb3ff;
}
.location {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.header {
  display: flex;
  flex-flow: row nowrap;
  & > li {
    white-space: nowrap;
  }
}
.searchConditionIcon {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.07);
  }
  > i {
    font-size: 24px;
  }
}
.deleteBut {
  font-size: 1.5rem;
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  &:hover {
    background: rgba(0, 0, 0, 0.07);
  }
}

.art-icon-button {
  text-indent: 6px;
  border: none;
  &::before {
    content: "";
    display: inline-block;
    width: 32px;
    height: 32px;
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 4px;
    margin-left: 2px;
  }
}

.top-button {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  &:hover {
    background: rgba(200, 200, 200, 0.5);
    color: black;
  }
}
.import-button {
  padding-top: 2px;
  height: 28px;
  font-size: 14px;
  background: rgba(0, 0, 0, 0);
  color: black;
  opacity: 0.8;
  ::v-deep {
    .h-icon-loading {
      margin-top: -1rem;
      color: black;
    }
    .h-icon-import {
      font-size: 20px;
    }
  }
}
</style>
<style>
.personList_form-row-col .el-form-item .el-form-item__content {
  width: 100% !important;
}
</style>
