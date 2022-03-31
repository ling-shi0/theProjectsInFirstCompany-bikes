<!--
 * @Descripttion: 线索管理
 * @version:
 * @Author: someone
 * @Date: 2020-10-15 19:15:51
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-01-05 15:59:15
 -->
<template>
  <div class="clueManage" v-loading="loading">
    <div class="left-sidebar" :class="leftAsideSwapFlag ? 'close' : 'active'">
      <div class="left-sidebar-img">
        <img :src="headImage" class="w100" />
      </div>
      <div class="left-sidebar-info">
        <div class="left-sidebar-info-main">
          <!-- 收起信息栏时，缩小字体 -->
          <div
            :style="leftAsideSwapFlag ? 'font-size:14px; font-weight:900;' : ''"
          >
            {{ clueManageMainContentHeader_personInfo.name || "未知姓名" }}
          </div>
          <div style="display: flex; align-items: center">
            <img
              :src="getIcon(clueManageMainContentHeader_personInfo.gender)"
              v-if="
                clueManageMainContentHeader_personInfo.gender === 'female' ||
                clueManageMainContentHeader_personInfo.gender === 'male'
              "
              class="sex"
            />
            {{
              (clueManageMainContentHeader_personInfo.age &&
                clueManageMainContentHeader_personInfo.age + "岁") ||
              "未知年龄"
            }}
          </div>
        </div>
        <div
          v-if="clueManageMainContentHeader_personInfo.idCard"
          :style="leftAsideSwapFlag ? 'display: none;' : 'display: flex;'"
        >
          {{ clueManageMainContentHeader_personInfo.idCard }}
          <i
            class="h-icon-copy fs20 por copy cup copyIcon"
            :data-clipboard-text="clueManageMainContentHeader_personInfo.idCard"
            style="font-size: 24px"
            title="点击复制身份证号"
            @click="copyText()"
          ></i>
        </div>
        <div
          :class="leftAsideSwapFlag ? 'close-hide' : ''"
          class="left-sidebar-info-address"
          :title="clueManageMainContentHeader_personInfo.censusRegister"
        >
          籍贯:{{
            clueManageMainContentHeader_personInfo.censusRegister || "未知"
          }}
        </div>
        <div
          :style="leftAsideSwapFlag ? 'display: none;' : 'display: flex;'"
          style="display: flex; align-items: center"
        >
          职业:
          <el-select
            v-model="occupation"
            placeholder="未知"
            clear
            @change="occupationChange"
            style="width: 70%"
          >
            <el-option
              v-for="item in labelList"
              :label="item.name"
              :key="item.code"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="left-sidebar-operation">
        <p
          :style="
            clueManageMainContentHeader_personInfo.concernPerson
              ? 'color:#2080F7;'
              : ''
          "
          @click="
            addCancelFollow(
              clueManageMainContentHeader_personInfo.concernPerson
                ? 'cancel'
                : 'add'
            )
          "
          :title="
            clueManageMainContentHeader_personInfo.concernPerson
              ? '已关注'
              : '未关注'
          "
        >
          <i
            :class="`clueManage-main-content-star fs24 por star cup h-icon-star${
              clueManageMainContentHeader_personInfo.concernPerson ? '_f' : ''
            }`"
          ></i>
          <span :class="leftAsideSwapFlag ? 'close-hide' : ''">
            {{
              clueManageMainContentHeader_personInfo.concernPerson
                ? "已关注"
                : "未关注"
            }}
          </span>
        </p>
        <p @click="goResearchReport()" title="研判报告">
          <i class="h-icon-plan fs24 por"></i>
          <span :class="leftAsideSwapFlag ? 'close-hide' : ''">研判报告</span>
        </p>
        <p @click="jumpPage(2)" title="聚类研判">
          <i class="judgeicon fs24 por"></i>
          <span :class="leftAsideSwapFlag ? 'close-hide' : ''">聚类研判</span>
        </p>
        <p
          v-if="holographic"
          @click="gpHolographicArchives(fromObj.formType.certificateNumber)"
          title="全息档案"
        >
          <i class="h-icon-plan fs24 por"></i>
          <span :class="leftAsideSwapFlag ? 'close-hide' : ''">全息档案</span>
        </p>
        <p
          v-if="relationship"
          @click="goRelationshipAnalysis(fromObj.formType.certificateNumber)"
          title="关系分析"
        >
          <i class="judgeicon fs24 por"></i>
          <span :class="leftAsideSwapFlag ? 'close-hide' : ''">关系分析</span>
        </p>
      </div>
      <div class="left-sidebar-footer">
        <i
          :class="
            leftAsideSwapFlag ? 'h-icon-arrow_right' : 'h-icon-arrow_left'
          "
          @click="leftAsideSwapFlag = !leftAsideSwapFlag"
        ></i>
      </div>
    </div>

    <div class="main-content">
      <div class="main-content-header">
        <div class="main-content-header-left" style="height: 48px">
          <el-button
            type="primary"
            class="import-button top-button art-icon-button move-button"
            @click="moveGroup"
            >移到其他分组</el-button
          >
          <el-button
            type="primary"
            class="import-button top-button art-icon-button compare-button"
            @click="openPicCompare"
            >图片比对</el-button
          >
          <el-button
            type="primary"
            class="import-button top-button art-icon-button importBut"
            @click="jumpPage(3)"
            >本地导入</el-button
          >
          <el-button
            type="primary"
            class="import-button top-button art-icon-button delete-button"
            @click="deleteClue"
            >删除线索</el-button
          >
          <el-button
            type="primary"
            class="import-button top-button art-icon-button location-button"
            @click="coordinate()"
            >坐标定位</el-button
          >
          <el-button
            type="primary"
            icon="h-icon-export"
            class="import-button top-button art-icon-button"
            style="text-indent: 0px"
            @click="exportClues"
            >导出线索</el-button
          >
        </div>
        <div class="main-content-header-right">
          <el-date-picker
            style="width: 360px; margin-right: 32px"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="fromObj.formType.defaultDate"
          />
          <span
            :style="
              paneType === 'car'
                ? 'color: rgba(0, 0, 0, 0.3)'
                : 'color: #2080F7'
            "
            >时间轴模式</span
          >
          <el-switch
            v-model="paneType"
            active-color="rgba(213,232,255,0.73)"
            inactive-color="rgba(213,232,255,0.73)"
            active-value="car"
            inactive-value="time"
            style="margin: 0 12px"
          >
          </el-switch>
          <span
            :style="
              paneType === 'time'
                ? 'color: rgba(0, 0, 0, 0.3)'
                : 'color: #2080F7'
            "
            >车辆模式</span
          >
        </div>
      </div>
      <div class="main-content-pane">
        <div class="main-content-pane-left">
          <transition name="fade">
            <div class="main-content-pane-left-list" v-if="paneType === 'time'">
              <div class="main-content-pane-left-list-tip" v-if="showTip">
                <img src="@/assets/images/tip.gif" />
                <i class="h-icon-close" @click="showTip = false"></i>
              </div>
              <div
                class="main-content-pane-left-list-header"
                :style="
                  fromObj.formType.arrayType === 'time'
                    ? 'margin: 0.5rem 1rem;'
                    : 'display: none;'
                "
              >
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  @change="handleCheckAllChange"
                  >全选</el-checkbox
                >
              </div>
              <div class="main-content-pane-left-list-items">
                <clue-manage-card-list
                  ref="cardlist"
                  :clueManageMainContentFooter="clueManageMainContentFooter"
                  :clueManageMainContentFooterTypeReault="
                    clueManageMainContentFooterTypeReault
                  "
                  :formType="fromObj.formType"
                  :arrayType="fromObj.formType.arrayType"
                  :suspiciousCarList="suspiciousCarList"
                  :normalCarList="normalCarList"
                  @init="init"
                  @changeType="changeType"
                  @updateList="updateList"
                  @dragstart.native="createStatus = true"
                  @dragend.native="createStatus = false"
                  @handleScroll="handleScroll"
                  @handleScrollBar="handleScrollBar"
                ></clue-manage-card-list>
              </div>
            </div>
            <div class="main-content-pane-left-carList" v-else>
              <car-model-group
                :humanId="clueManageMainContentHeader_personInfo.humanId"
                :startTime="
                  fromObj.formType.date[0] || fromObj.formType.defaultDate[0]
                "
                :endTime="
                  fromObj.formType.date[1] || fromObj.formType.defaultDate[1]
                "
                @flagChangeArr="flagChangeArr"
              ></car-model-group>
            </div>
          </transition>
        </div>
        <transition name="fade">
          <div v-if="picCompareFlag" class="main-content-pane-picCompare">
            <pic-compare
              :picData="picData"
              @closePicCompare="closePicCompare"
            ></pic-compare>
          </div>
        </transition>
        <div class="main-content-pane-right" v-if="paneType === 'time'">
          <div class="main-content-pane-right-sidebar">
            <div class="main-content-pane-right-sidebar-header">
              <el-tabs v-model="vehicleType">
                <el-tab-pane
                  label="可疑车辆"
                  name="suspiciousCar"
                ></el-tab-pane>
                <el-tab-pane label="自用车辆" name="normalCar"></el-tab-pane>
              </el-tabs>
            </div>
            <div class="main-content-pane-right-sidebar-content">
              <div
                class="scroll-bar pl10 pr10 pb20"
                v-if="vehicleType === 'suspiciousCar'"
              >
                <transition name="fade">
                  <div
                    v-if="createStatus"
                    @dragover="createDragoverVehicle($event)"
                    @dragleave="createNewGroupOver = false"
                    class="create-new-group"
                    :style="
                      createNewGroupOver ? 'border: 1px solid #2080F7;' : ''
                    "
                    @drop="createNewGroup(el)"
                  >
                    <div style="display: flex; align-items: center">
                      <i class="h-icon-add" style="font-size: 1rem"></i>新增群组
                    </div>
                  </div>
                </transition>
                <div
                  v-if="suspiciousCarList.length > 0"
                  style="width: 100%; margin-top: 0.5rem; padding-bottom: 4rem"
                >
                  <div
                    v-for="(item, index) in suspiciousCarList"
                    :key="item.bike_code"
                    :style="{
                      border: item.dragFlag ? '1px solid #2080F7' : '',
                      background: item.flag ? '#F5F5F5' : '',
                      paddingBottom: '0.5rem',
                    }"
                    @dragover="dragoverVehicle(index, item, $event)"
                    @dragleave="handleDragLeave(index)"
                    @drop="dropVehicle(item, '1')"
                  >
                    <h2
                      class="fs14 color_333 mb10 por"
                      style="
                        margin-left: 0.5rem;
                        display: flex;
                        align-items: center;
                      "
                    >
                      <el-checkbox v-model="item.flag" @change="changeVehicle">
                        <div
                          style="
                            display: flex;
                            margin-top: 1rem;
                            align-items: center;
                          "
                        >
                          <div class="icon-question">
                            <div>{{ item.bike_code }}</div>
                            <div>可疑</div>
                          </div>
                          <div>&nbsp;&nbsp;&nbsp;{{ item.name }}</div>
                        </div>
                      </el-checkbox>
                    </h2>
                    <div
                      class="
                        main-content-pane-right-sidebar-content-item
                        clearfix
                      "
                    >
                      <div
                        class="
                          main-content-pane-right-sidebar-content-item-imgWrap
                          fl
                          bd_f2f2f2
                        "
                      >
                        <div
                          v-if="item.pic_url[0]"
                          class="image"
                          :style="{
                            backgroundImage: `url(${item.pic_url[0]})`,
                          }"
                          @click="previewSidebarImg(item.pic_url)"
                        />
                        <img
                          src="@/assets/images/personList/head_sex_01.png"
                          v-else
                        />
                      </div>
                      <EditRemarkPane
                        :itemMes="item"
                        :groupMes="{
                          humanId:
                            clueManageMainContentHeader_personInfo.humanId,
                          bikeCode: item.bike_code,
                          bikeLabel: 1,
                        }"
                        @refreshCarGroup="getCarGroup"
                        :key="item.id"
                      ></EditRemarkPane>
                    </div>
                    <div class="link-case" v-if="item.archiveInfo">
                      <div><i class="h-icon-info_link"></i></div>
                      <div>
                        <div>
                          <img src="@/assets/images/clueManage/icon_01.png" />
                          {{
                            item.archiveInfo && item.archiveInfo.archive_code
                          }}
                        </div>
                        <div>
                          <img src="@/assets/images/clueManage/icon_02.png" />
                          {{
                            item.archiveInfo && item.archiveInfo.archive_name
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h-empty size="sm" description="暂无可疑车辆" v-else />
              </div>
              <div
                class="scroll-bar pl10 pr10 pb20"
                v-if="vehicleType === 'normalCar'"
              >
                <transition name="fade">
                  <div
                    v-if="createStatus"
                    @dragover="createDragoverVehicle($event)"
                    @dragleave="createNewGroupOver = false"
                    class="create-new-group"
                    :style="
                      createNewGroupOver ? 'border: 1px solid #2080F7;' : ''
                    "
                    @drop="createNewGroup(el)"
                  >
                    <div style="display: flex; align-items: center">
                      <i class="h-icon-add" style="font-size: 1rem"></i>新增群组
                    </div>
                  </div>
                </transition>
                <div
                  v-if="normalCarList.length > 0"
                  style="width: 100%; margin-top: 0.5rem; padding-bottom: 4rem"
                >
                  <div
                    class="pb10"
                    v-for="(item, index) in normalCarList"
                    :key="item.bike_code"
                    :style="{
                      width: '100%',
                      border: item.dragFlag ? '1px solid #2080F7' : '',
                      background: item.flag ? '#F5F5F5' : '',
                    }"
                    @dragleave="handleDragLeave(index)"
                    @dragover="dragoverVehicle(index, item, $event)"
                    @drop="dropVehicle(item, '2')"
                  >
                    <h2
                      class="fs14 color_333 mb10 por"
                      style="
                        margin-left: 0.5rem;
                        display: flex;
                        align-items: center;
                      "
                    >
                      <el-checkbox
                        slot="reference"
                        v-model="item.flag"
                        @change="changeVehicle"
                      >
                        <div
                          style="
                            display: flex;
                            margin-top: 1rem;
                            align-items: center;
                          "
                        >
                          <div class="icon-ownuse">
                            <div>{{ item.bike_code }}</div>
                            <div>自用</div>
                          </div>
                          <div>&nbsp;&nbsp;&nbsp;{{ item.name }}</div>
                        </div>
                      </el-checkbox>
                    </h2>
                    <div
                      class="
                        main-content-pane-right-sidebar-content-item
                        clearfix
                      "
                    >
                      <div
                        class="
                          main-content-pane-right-sidebar-content-item-imgWrap
                        "
                      >
                        <div v-if="item.pic_url[0]" style="display: flex">
                          <div
                            v-for="(items, index) in item.pic_url &&
                            item.pic_url.slice(0, 3)"
                            :key="index"
                            :src="items"
                            :style="{ backgroundImage: `url(${items})` }"
                            class="image self-image"
                            @click="previewSidebarImg(item.pic_url)"
                          />
                        </div>
                        <img
                          src="@/assets/images/personList/head_sex_01.png"
                          v-else
                        />
                      </div>
                      <EditRemarkPane
                        :itemMes="item"
                        :groupMes="{
                          humanId:
                            clueManageMainContentHeader_personInfo.humanId,
                          bikeCode: item.bike_code,
                          bikeLabel: 2,
                        }"
                        @refreshCarGroup="getCarGroup"
                        :key="item.id"
                      ></EditRemarkPane>
                    </div>
                  </div>
                </div>
                <h-empty size="sm" description="暂无自用车辆" v-else />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <h-img-preview
      ref="sidebarImgPreviewVisible"
      :data="sidebarImgPreview"
      :visible.sync="sidebarImgPreviewVisible"
    />
    <multiple-display
      ref="multipleDisplay"
      :visible="multipleMapVisible"
      :lonlat="lonlat"
      @update:visible="updateMapVisible"
    ></multiple-display>
    <clue-detail-dialog
      :data="modal.pics"
      :index="modal.showIndex"
      :visible.sync="modal.visible"
      :upload="modal.upload"
      :form-type="modal.formType"
      :content-type="modal.contentType"
      :closeUpdate="closeUpdate"
      @updateList="updateList"
      :startTime="fromObj.formType.date[0] || fromObj.formType.defaultDate[0]"
      :endTime="fromObj.formType.date[1] || fromObj.formType.defaultDate[1]"
    />
    <move-to-other-group
      :visible="moveToOtherGroupVisible"
      :moveGroups="moveGroups"
      @closeDialog="moveToOtherGroupVisible = false"
      :certificateNumber="$route.query.idCard"
      @init="refreshPage"
      :startTime="fromObj.formType.date[0] || fromObj.formType.defaultDate[0]"
      :endTime="fromObj.formType.date[1] || fromObj.formType.defaultDate[1]"
    ></move-to-other-group>
    <edit-car-group-mes @refreshList="getCarGroup"></edit-car-group-mes>
  </div>
</template>

<script>
import helper from "@/helper";
import "@/filters";
import $ from "jquery";
import api from "@/api";
import rest from "@/rest";
import Bus from "@/bus";
import Clipboard from "clipboard";
import multipleDisplay from "../../../../components/map/multipleDisplay.vue";
import clueManageCardList from "./clueManageCardList";
import ClueDetailDialog from "@/components/photo-details-dialog/clue-detail-dialog";
import { deepClone } from "@hui-pro/utils";
import groupDialog from "@/components/groupDialog";
import Helper from "@/upload/helper";
import maleIcon from "@/assets/images/personList/male.png";
import femaleIcon from "@/assets/images/personList/female.png";
import editCarGroupMes from "./editcarGroupMes";
import picCompare from "./picCompare";
import moveToOtherGroup from "./moveToOtherGroup";
import carModelGroup from "./carModelGroup";
import EditRemarkPane from "./EditRemarkPane.vue";
import moment from "moment";

export default {
  components: {
    clueManageCardList,
    multipleDisplay,
    ClueDetailDialog,
    picCompare,
    moveToOtherGroup,
    carModelGroup,
    editCarGroupMes,
    EditRemarkPane,
  },
  data() {
    return {
      createStatus: false, // 拖拽新增接口
      clueManageMainContentHeader_personInfo: {}, // 人员信息
      showSearchCondition: false, // 显示搜索条件
      fromObj: {
        // 搜素条件
        formList: {
          arrayTypeList: [
            {
              // 排序类型下拉列表
              value: "time",
              label: "按时间线索",
            },
            {
              value: "clueType",
              label: "按线索类型线索",
            },
          ],
          clueTypeList: [], // 线索类型下拉列表
        },
        formType: {
          // certificateNumber: this.$route.query.idCard,
          humanId: this.$route.query.idCard,
          arrayType: "time", // 排序类型下拉类型
          date: [
            // 默认前一年时间
            new Date(new Date().getTime() - 3600 * 1000 * 24 * 365 * 3),
            new Date(),
          ], // 时间
          defaultDate: [
            // 默认前一年时间
            new Date(new Date().getTime() - 3600 * 1000 * 24 * 365 * 3),
            new Date(),
          ],
          startTime: "", // 开始时间
          endTime: "", // 开始时间
          clueType: 1, // 线索类型
          bikeCode: "", //车辆编号
          bikeLabel: "", //车辆类型
          pageNo: 1,
          pageSize: 20,
        },
        resetFormType: {
          humanId: this.$route.query.idCard,
          arrayType: "time", // 排序类型下拉类型
          defaultDate: [
            // 默认前三个月时间
            new Date(new Date().getTime() - 3600 * 1000 * 24 * 91),
            new Date(),
          ],
          date: [], // 时间
          startTime: "", // 开始时间
          endTime: "", // 开始时间
          clueType: "", // 线索类型
          bikeCode: "", //车辆编号
          bikeLabel: "", //车辆类型
          pageNo: 1,
          pageSize: 20,
        },
      },
      count: 0,
      isChangePageNo: false,
      clueManageMainContentFooter: {}, // 按时间查询下的结果
      clueManageMainContentFooterTypeReault: {}, // 按类型查询下的结果
      electricVehicleType: 1, // 电动车类别
      electricVehicleType2: 2, // 电动车类别
      clueType: 1, // 线索类型
      vehicleType: "suspiciousCar", // 车辆类型
      suspiciousCarList: [], // 可疑车辆列表
      normalCarList: [], // 正常车辆列表
      modal: {
        // clue-detail-dialog 弹框参数
        visible: false, // 弹框显隐
        pics: [], // 列表数据
        showIndex: 0, // 当前显示第几个
        upload: false, // 是否是本地上传的数据
        formType: "clueDetail", // 弹框右侧展示哪个表格
        contentType: null, // 内容类型（图片、视频）
      },
      closeUpdate: false, // 关闭对话框更新列表，用于本地导入后的对话框
      sidebarImgPreview: [],
      sidebarImgPreviewVisible: false,
      // listIsUpdateObj: {
      //   holographicArchives: sessionStorage.getItem("holographicArchives"),
      //   relationshipAnalysis: sessionStorage.getItem("relationshipAnalysis")
      // },
      checkAll: false,
      leftAsideSwapFlag: false,
      holographic: false,
      relationship: false,
      multipleMapVisible: false,
      lonlat: [],
      scrollbarShow: true,
      createNewGroupOver: false,
      importButLoading: false,
      obj: { timer: null },
      loading: false,
      timer: null,
      pageNoWatch: true,
      paneType: "car", // 切换时间轴和车辆模式
      picCompareFlag: false, //打开图片比对
      picData: [], // 图片比对数据
      moveToOtherGroupVisible: false,
      moveGroups: [],
      carModelGroupArr: [],
      occupation: "",
      defaultOccupation: "",
      labelList: [],
      showTip: true,
    };
  },
  computed: {
    headImage() {
      let res = "";
      if (this.clueManageMainContentHeader_personInfo.picUrl) {
        res = this.clueManageMainContentHeader_personInfo.picUrl;
      } else {
        res = require(`../../../../assets/images/personList/head_sex_0${
          this.clueManageMainContentHeader_personInfo.gender == "male"
            ? "1"
            : "2"
        }.png`);
      }
      return res;
    },
    isCheckAll() {
      if (this.fromObj.formType.arrayType === "time") {
        return (
          !this.clueManageMainContentFooter.find ||
          !this.clueManageMainContentFooter.find((itemList) => {
            return itemList.list.find((item) => {
              return !item.flag;
            });
          })
        );
      } else {
        if (this.clueManageMainContentFooterTypeReault.picList) {
          return !this.clueManageMainContentFooterTypeReault.picList.find(
            (item) => {
              return !item.flag;
            }
          );
        }
        return false;
      }
    },
    isCheckNull() {
      if (this.fromObj.formType.arrayType === "time") {
        return (
          !this.clueManageMainContentFooter.find ||
          !this.clueManageMainContentFooter.find((itemList) => {
            return itemList.list.find((item) => {
              return item.flag;
            });
          })
        );
      } else {
        if (this.clueManageMainContentFooterTypeReault.picList) {
          return !this.clueManageMainContentFooterTypeReault.picList.find(
            (item) => {
              return item.flag;
            }
          );
        }
        return false;
      }
    },
    isIndeterminate() {
      // 主内容区域是否有选择
      if (this.isCheckAll || this.isCheckNull) {
        return false;
      } else {
        if (this.fromObj.formType.arrayType === "time") {
          return !!this.clueManageMainContentFooter.find((itemList) => {
            return itemList.list.find((item) => {
              return item.flag;
            });
          });
        } else {
          if (this.clueManageMainContentFooterTypeReault.picList) {
            return !!this.clueManageMainContentFooterTypeReault.picList.find(
              (item) => {
                return item.flag;
              }
            );
          }
          return false;
        }
      }
    },
  },
  watch: {
    isCheckNull(val) {
      this.checkAll = !val;
    },
    "fromObj.formType.pageNo"(val) {
      if (val !== 1 && this.pageNoWatch) {
        this.goSearch(true);
      } else {
        this.pageNoWatch = true;
      }
    },
    scrollbarShow(val) {
      let len = this.clueManageMainContentFooter.reduce
        ? this.clueManageMainContentFooter.reduce((sum, item) => {
            return sum + item.list.length;
          }, 0)
        : 0;
      if (len < this.count && len > 0 && this.pageNoWatch) {
        this.fromObj.formType.pageNo++;
        this.isChangePageNo = true;
      }
    },
    paneType(val) {
      this.picCompareFlag = false;
      this.clearCarArr();
      val === "time" && this.refreshPage();
    },
    "fromObj.formType.defaultDate"(date) {
      // console.log()
      // this.changeDate(val);
      this.$set(this.fromObj.formType, "date", [
        helper.dateFormat("YYYY-mm-dd", new Date(date[0])),
        helper.dateFormat("YYYY-mm-dd", new Date(date[1])),
      ]);
      this.fromObj.formType.pageNo = 1;
      this.paneType === "time" && this.goSearch();
      this.paneType === "car" &&
        Bus.$emit("refreshCarModelGroup", this.fromObj.formType.date);
    },
    clueManageMainContentFooter(val) {
      if (!(val && val.length)) {
        this.fromObj.formType.bikeCode = "";
        this.fromObj.formType.bikeLabel = "";
        this.goSearch();
      }
    },
  },
  async created() {
    let { data } = await this.getLabelList();
    this.labelList = data;
    this.init();
    // this.goSearch();
    Bus.$emit("refreshCarModelGroup");
    Bus.$on("updateClueManage", (data) => {
      this.changeType();
    });
    Bus.$on("sendPicToCompare", (data) => {
      console.log("aaa");
      this.$set(this.picData, data.type - 1, data.item);
    });
    Bus.$on("clearCarArr", () => {
      this.clearCarArr();
    });
    Bus.$on("dropCarModel", (itemData) => {
      this.mergeCarModelGroup(itemData);
    });
  },
  beforeDestroy() {
    if (this.timer) clearTimeout(this.timer);
    if (this.obj.timer) {
      clearTimeout(this.obj.timer);
      this.obj.timer = null;
    }
  },
  methods: {
    throttle: helper.throttle,
    // 新建分组
    createNewGroup() {
      let that = this;
      let selectArr = [];
      this.clueManageMainContentFooter.forEach((itemList) => {
        itemList.list.forEach((item) => {
          item.flag && selectArr.push(item);
        });
      });
      let archiveCode = selectArr[0].archiveCode;
      let paramArr = selectArr.map((item) => {
        return item.id;
      });
      let idSet = new Set(paramArr);
      if (paramArr.length === 0) {
        this.$message.info("请选中需要新建的线索！");
        return false;
      } else {
        let archiveTemp;
        for (let item of selectArr) {
          item.archiveCode && !archiveTemp && (archiveTemp = item.archiveCode);
          if (archiveTemp && item.archiveCode !== archiveTemp) {
            that.$message.error("线索关联案件有1个以上，请单个创建！", 3000);
            return;
          }
        }
        let params = {
          humanId: this.$route.query.idCard,
          clueIds: Array.from(idSet),
          archiveCode,
          // clueInfoDOList: paramArr,
          bikeLabel: this.vehicleType === "suspiciousCar" ? "1" : "2",
          archiveType: archiveCode ? 1 : null,
          vehicleColorNote: "",
          vehicleFeatureNote: "",
          otherNote: "",
        };
        rest.post(api.clueManage.clueGroup, params).done((res) => {
          if (helper.isSuccess(res)) {
            that.$message.success("创建归类成功!");
            that.afterCheckDragClueGroupFetch();
            that.changeType();
          } else {
            that.$message.error(res.msg);
          }
        });
      }
    },
    /**
     * @description: 全选值改变事件
     */
    handleCheckAllChange(value) {
      if (this.fromObj.formType.arrayType == "time") {
        this.clueManageMainContentFooter.forEach((itemList) => {
          itemList.list.forEach((item) => {
            item.flag = value;
          });
        });
      } else {
        ["picList", "fileList", "videoList", "trackList"].forEach((items) => {
          let tempList = this.clueManageMainContentFooterTypeReault[items];
          tempList && tempList.forEach((item) => (item.flag = value));
        });
      }
    },
    // 面包屑导航返回
    goBack() {
      this.$router.push({ path: "/home/personList" });
    },
    // 初始化
    init() {
      let that = this;
      // 获取人员信息接口
      rest
        .get(api.clueManage.clueFindPersonInfo, {
          humanId: that.fromObj.formType.humanId,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.clueManageMainContentHeader_personInfo = res.data;
            this.defaultOccupation = res.data.personLabelCode || null;
            this.occupation = res.data.personLabelCode || null;
          } else {
            that.$message.error(res.msg);
          }
        });
      // 获取线索类型接口
      // rest
      //   .get(api.clueManage.findClueType)
      //   .done(res => {
      //     if (helper.isSuccess(res)) {
      //       that.fromObj.formList.clueTypeList = res.data;
      //     } else {
      //       that.$message.error(res.msg);
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error(err);
      //   });
      this.getCarGroup();
      // 获取隐藏功能按钮
      rest.get(api.personList.getFunctionStatus, {}).done((res) => {
        if (helper.isSuccess(res)) {
          that.holographic = res.data.holographic;
          that.relationship = res.data.relationship;
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    getCarGroup() {
      let that = this;
      // 获取可疑车辆列表
      rest
        .get(api.clueManage.findBikeLabelAndCodes, {
          humanId: that.fromObj.formType.humanId,
          bikeLabel: 1,
          startTime: moment(this.fromObj.formType.date[0]).format(
            "YYYY-MM-DD 00:00:00"
          ),
          endTime: moment(this.fromObj.formType.date[1]).format(
            "YYYY-MM-DD 23:59:59"
          ),
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            let result = res.data ? res.data : [];
            let clean = true; // 现存查询条件是否存在
            result.forEach((item, index) => {
              if (
                !that.suspiciousCarList[index] ||
                !that.suspiciousCarList[index].flag
              ) {
                item.flag = false;
              } else {
                item.flag = true;
              }
              // if (
              //   !that.suspiciousCarList[index] ||
              //   !that.suspiciousCarList[index].dragFlag
              // ) {
              item.dragFlag = false;
              // }
              if (this.fromObj.formType.bikeCode === item.bike_code) {
                clean = false;
              }
            });
            if (clean) {
              this.fromObj.formType.bikeCode = "";
              this.fromObj.formType.bikeLabel = "";
            }
            that.$set(that, "suspiciousCarList", result);
            // that.suspiciousCarList = result;
          } else {
            that.$message.error(res.msg);
          }
        });
      // 获取自用车辆列表
      rest
        .get(api.clueManage.findBikeLabelAndCodes, {
          humanId: that.fromObj.formType.humanId,
          bikeLabel: 2,
          startTime: moment(this.fromObj.formType.date[0]).format(
            "YYYY-MM-DD 00:00:00"
          ),
          endTime: moment(this.fromObj.formType.date[1]).format(
            "YYYY-MM-DD 23:59:59"
          ),
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            let result = res.data ? res.data : [];
            let clean = true; // 现存查询条件是否存在
            result.forEach((item) => {
              item.flag = false;
              item.dragFlag = false;
              if (this.fromObj.formType.bikeCode === item.bike_code) {
                clean = false;
              }
            });
            if (clean) {
              this.fromObj.formType.bikeCode = "";
              this.fromObj.formType.bikeLabel = "";
            }
            that.$set(that, "normalCarList", result);
            // that.normalCarList = result;
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // go 研判报告
    goResearchReport() {
      this.$router.push({
        path: "/home/researchReport",
        query: {
          idCard: this.fromObj.formType.idCard,
          source: "clueManage",
          humanId: this.fromObj.formType.humanId,
        },
      });
    },
    // 添加线索 下拉框
    jumpPage(num) {
      let that = this;
      const { protocol, hostname, port } = location;
      let prefix = `${protocol}//${hostname}`;
      if (port) {
        prefix += `:${port}`;
      }
      let tempObj = {
        1: {
          path: "clueSearch",
          name: "线索查询", // go 线索查询
        },
        2: {
          path: "clusterAnalysis",
          name: "聚类研判", // go 聚类研判
        },
        3: {
          apiUrl: api.clueManage.clueUploadImg,
          type: 1, // 上传照片 打开上传工具接口
        },
        4: {
          apiUrl: api.clueManage.clueUploadVideo,
          type: 2, // 上传视频 打开上传工具接口
        },
        5: {
          apiUrl: api.clueManage.clueUploadFile, // 上传附件 this.$router.push('/home/clusterAnalysis') 打开上传工具接口
        },
      };
      if (num < 3) {
        if (top === window) {
          let routeData = this.$router.resolve({
            path: "/home/" + tempObj[num].path,
            query: { humanId: this.$route.query.idCard },
          });
          window.open(routeData.href, "_blank");
          return false;
        }
        top.window.goToApp({
          name: tempObj[num].name,
          url:
            `${prefix}/erim-web/#/home/` +
            tempObj[num].path +
            `?humanId=${this.$route.query.idCard}`,
          param: ``,
          callback: { func: "", param: {} },
          reload: true,
        });
      } else if (!this.importButLoading) {
        this.importButLoading = true;
        if (!this.helper) this.helper = new Helper();
        rest
          .get(tempObj[num].apiUrl, {
            certificateNumber: that.fromObj.formType.certificateNumber,
            humanId: that.clueManageMainContentHeader_personInfo.humanId,
          })
          .done((res) => {
            if (helper.isSuccess(res)) {
              this.helper.run(res.data.url).listen((comment) => {
                if (comment.commenttype === "btoolupload") {
                  this.importButLoading = false;
                  if (this.timer) clearTimeout(this.timer);
                  num !== 5 &&
                    that.uploadList(res.data.taskId, tempObj[num].type);
                }
              });
            } else {
              this.importButLoading = false;
              if (this.timer) clearTimeout(this.timer);
              that.$message.error(res.msg);
            }
          });
        // if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.importButLoading = false;
        }, 10000);
      }
    },
    // 选择线索时段
    changeDate(date) {
      this.fromObj.formType.date = date;
      this.fromObj.formType.pageNo = 1;
      this.paneType === "time" && this.goSearch();
      this.paneType === "car" && Bus.$emit("refreshCarModelGroup");
    },
    // 查询
    async goSearch(pageNoChange, updateGroup) {
      if (!pageNoChange) this.loading = true;
      let that = this;
      this.$set(this.fromObj.formType, "date", [
        helper.dateFormat(
          "YYYY-mm-dd",
          new Date(this.fromObj.formType.date[0])
        ),
        helper.dateFormat(
          "YYYY-mm-dd",
          new Date(this.fromObj.formType.date[1])
        ),
      ]);
      if (this.fromObj.formType.date.length > 0) {
        this.fromObj.formType.startTime = this.fromObj.formType.date[0].substr(
          0,
          10
        );
        this.fromObj.formType.endTime = this.fromObj.formType.date[1].substr(
          0,
          10
        );
      } else {
        let temp = helper.dateFormat(
          "YYYY-mm-dd HH:MM",
          this.fromObj.formType.defaultDate[0]
        );
        this.fromObj.formType.startTime = temp && temp.substr(0, 10);
        temp = helper.dateFormat(
          "YYYY-mm-dd HH:MM",
          this.fromObj.formType.defaultDate[1]
        );
        this.fromObj.formType.endTime = temp && temp.substr(0, 10);
      }
      if (!pageNoChange) {
        this.fromObj.formType.pageNo = 1;
        if (!updateGroup)
          this &&
            this.$refs &&
            this.$refs.cardlist &&
            this.$refs.cardlist.$refs &&
            this.$refs.cardlist.$refs.scrollbar &&
            this.$refs.cardlist.$refs.scrollbar.setScroll(0);
      }
      let len = this.clueManageMainContentFooter.reduce
        ? this.clueManageMainContentFooter.reduce((sum, item) => {
            return sum + item.list.length;
          }, 0)
        : undefined;
      if (!(len && len >= this.count && pageNoChange)) {
        await rest
          .post(api.clueManage.findAllClues, that.fromObj.formType)
          .done((res) => {
            if (helper.isSuccess(res)) {
              let result = res.data;
              if (
                (result == null || !result.length) &&
                !that.clueManageMainContentFooter.length
              ) {
                // 都没有就别变了 反正也没有
                return;
              }
              if (result && result.length > 0) {
                that.count = result[0].count;
              }
              result.forEach((itemMonth) => {
                itemMonth.show = true;
                itemMonth.list.forEach((itemType) => {
                  itemType.flag = false;
                  itemType.iconClick = false;
                  itemType.picUrlDefault = false;
                });
              });
              if (
                this.fromObj.formType.bikeCode === "" &&
                this.fromObj.formType.bikeLabel === ""
              ) {
                this.clearCheckOfList();
              }
              if (!pageNoChange) {
                that.clueManageMainContentFooter = result;
              } else {
                let lastItem =
                  // eslint-disable-next-line standard/computed-property-even-spacing
                  that.clueManageMainContentFooter[
                    that.clueManageMainContentFooter.length - 1
                  ];
                if (lastItem.showName === result[0].showName) {
                  lastItem.list.push(...result[0].list);
                  if (result.length > 1) {
                    that.clueManageMainContentFooter.push(...result.slice(1));
                  }
                } else {
                  that.clueManageMainContentFooter.push(...result);
                }
              }
            } else {
              that.$message.error(res.msg);
            }
            if (pageNoChange) {
              that.isChangePageNo = false;
              let len = that.clueManageMainContentFooter.reduce((sum, item) => {
                return sum + item.list.length;
              }, 0);
              if (!that.scrollbarShow && len < that.count) {
                that.fromObj.formType.pageNo++;
                that.isChangePageNo = true;
              }
            }
          })
          .catch(() => {
            if (pageNoChange) {
              that.isChangePageNo = false;
            }
          })
          .always(() => {
            if (!pageNoChange) {
              that.$nextTick(() => {
                that.isChangePageNo = false;
              });
              this.loading = false;
            }
            this.pageNoWatch = true;
            if (this.obj.timer) {
              clearTimeout(this.obj.timer);
              this.obj.timer = null;
            }
          });
      } else {
        if (!pageNoChange) {
          that.$nextTick(() => {
            that.isChangePageNo = false;
          });
          this.loading = false;
        }
        this.pageNoWatch = true;
        if (this.obj.timer) {
          clearTimeout(this.obj.timer);
          this.obj.timer = null;
        }
      }
    },
    // 多个地图纯展示
    openMapMultipleDisplay() {
      this.$refs.multipleDisplay.init();
    },
    // 删除可以车辆归类
    deleteCarClassify(itemType) {
      let that = this;
      rest
        .post(api.clueManage.updateBikeLabel, {
          id: itemType.id,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.$message.success("重置成功!");
            that.init();
            that.changeType();
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 切换类型
    async changeType(importUpdate) {
      let pageNo = this.fromObj.formType.pageNo;
      let pageSize = this.fromObj.formType.pageSize;
      if (this.fromObj.formType.arrayType === "time") {
        if (importUpdate) {
          this.fromObj.formType.pageSize = 20;
          this.goSearch();
        } else {
          let len = this.clueManageMainContentFooter.reduce((sum, item) => {
            return sum + item.list.length;
          }, 0);
          let pageNo = this.fromObj.formType.pageNo;
          let pageSize = this.fromObj.formType.pageSize;
          this.fromObj.formType.pageSize = len < 20 ? 20 : len;
          this.pageNoWatch = false;
          await this.goSearch(false, true);
          this.fromObj.formType.pageNo = pageNo;
          this.fromObj.formType.pageSize = pageSize;
        }
      } else {
        this.getTypelist();
      }
    },
    // 删除线索，参数 id 整理
    deleteClue() {
      let selectArr = [];
      this.paneType === "car" &&
        this.carModelGroupArr.forEach((item) => {
          item.flag && selectArr.push(item);
        });
      this.paneType === "time" &&
        this.clueManageMainContentFooter.forEach((itemList) => {
          itemList.list.forEach((item) => {
            item.flag && selectArr.push(item);
          });
        });
      let ids = selectArr.map((item) => item.id);
      if (ids.length === 0) {
        this.$message.info("请选中需要删除的线索！");
        return false;
      }
      this.goDeleteClue(ids.join(","));
    },
    // 删除线索
    goDeleteClue(ids) {
      let that = this;
      this.$confirm("确认删除吗？")
        .then((_) => {
          rest
            .post(api.clusterAnalysis.deleteClueInfos, {
              ids: ids,
            })
            .done((res) => {
              if (helper.isSuccess(res)) {
                that.$message.success("删除成功");
                Bus.$emit("refreshCarModelGroup");
                that.init();
                that.changeType();
              } else {
                that.$message.error(res.msg);
              }
            });
        })
        .catch((_) => {});
    },
    // 下载线索
    downloadClue() {
      let that = this;
      let ids = null;
      let selectArr = [];
      if (this.fromObj.formType.arrayType === "time") {
        this.clueManageMainContentFooter.forEach((itemList) => {
          itemList.list.forEach((item) => {
            item.flag && selectArr.push(item);
          });
        });
      } else {
        ["picList", "fileList", "videoList", "trackList"].forEach((items) => {
          this.clueManageMainContentFooterTypeReault[items].forEach(
            (item) => item.flag && selectArr.push(item)
          );
        });
      }
      ids = selectArr.map((item) => item.id);
      if (ids.length === 0) {
        that.$message.info("请选择需要下载的线索信息！");
        return false;
      }
      rest
        .post(api.clueManage.downloadClue, {
          ids: ids.join(","),
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            $("#downloadClue").attr("href", res.data.url);
            document.getElementById("downloadClue").click();
            that.init();
            that.changeType();
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 格式化时间
    formatDate(date) {
      if (date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        // var week_num = date.getDay();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        function fnNum(num) {
          return num < 10 ? "0" + num : "" + num;
        }
        return (
          year +
          "/" +
          fnNum(month) +
          "/" +
          fnNum(day) +
          " " +
          fnNum(hours) +
          ":" +
          fnNum(minute) +
          ":" +
          fnNum(second)
        );
      }
      return date;
    },
    // go 线索查询页面
    goClueSearch(item) {
      const { protocol, hostname, port } = location;
      let prefix = `${protocol}//${hostname}`;
      if (port) {
        prefix += `:${port}`;
      }
      if (top === window) {
        let routeData = this.$router.resolve({
          path: "/home/clueSearch",
          query: {
            idCard: this.fromObj.formType.humanId, // 人员 id
            placeAddress: item.placeAddress, // 线索 id
            passTime: item.passTime,
            id: item.id,
            longitude: item.longitude,
            latitude: item.latitude,
          },
        });
        window.open(routeData.href, "_blank");
        return false;
      }
      top.window.goToApp({
        name: "线索查询",
        url: `${prefix}/erim-web/#/home/clueSearch`,
        param: `idCard=${this.fromObj.formType.humanId}&placeAddress=${item.placeAddress}&passTime=${item.passTime}&longitude=${item.longitude}&latitude=${item.latitude}&id=${item.id}`,
        callback: { func: "", param: {} },
        reload: true,
      });
    },
    // go 全息档案
    gpHolographicArchives(id) {
      let that = this;
      rest
        .get(api.personList.personnelArchives, {
          val: id,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            window.open(res.data, "_blank");
          } else {
            that.$message.error(res.msg);
          }
          that.loading = false;
        });
    },
    // go 关系分析
    goRelationshipAnalysis(id) {
      let that = this;
      rest
        .get(api.personList.personnelShip, {
          val: id,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            window.open(res.data, "_blank");
          } else {
            that.$message.error(res.msg);
          }
          that.loading = false;
        });
    },
    // 坐标定位
    coordinate() {
      let selectArr = [];
      let fun = function (item) {
        item.flag && item.longitude && item.latitude && selectArr.push(item);
      };
      // if (this.fromObj.formType.arrayType == "time") {
      this.paneType === "time" &&
        this.clueManageMainContentFooter.forEach((itemList) => {
          itemList.list.forEach((item) => fun(item));
        });
      this.paneType === "car" &&
        this.carModelGroupArr.forEach((item) => {
          fun(item);
        });
      if (selectArr.length === 0) {
        this.$message.error("请勾选线索,或勾选的线索没有经纬度！", 3000);
        return;
      }
      // } else {
      //   ["picList", "fileList", "videoList", "trackList"].forEach((items) => {
      //     this.clueManageMainContentFooterTypeReault[items].forEach((item) =>
      //       fun(item)
      //     );
      //   });
      // }
      let sortSelectArr = selectArr.sort((a, b) => a.passTime - b.passTime);
      this.multipleMapVisible = true;
      this.lonlat = sortSelectArr;
    },
    // 复制
    copyText() {
      var clipboard = new Clipboard(".copy");
      clipboard.on("success", (e) => {
        this.$message({
          message: "复制成功！",
          type: "success",
        });
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        this.$message({
          message: "该浏览器不支持自动复制",
          type: "warning",
        });
        console.warn("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    // 子组件保存数据时，及时的更新父组件
    updateList(importUpdate) {
      Bus.$emit("refreshCarModelGroup");
      this.init();
      this.changeType(importUpdate);
    },
    /*
     * 上传本地图片、视频、文本附件后，取接口数据
     * taskId: 任务 id
     * 1: 图片、2: 视频、1: 附件文本
     */
    uploadList(taskId, type) {
      let that = this;
      let timer = null;
      setTimeout(() => {
        if (timer) clearInterval(timer);
      }, 10000);
      timer = setInterval(() => {
        rest
          .get(api.clueManage.clueInfoList, {
            taskId: taskId,
            clueType: type,
          })
          .done((res) => {
            if (helper.isSuccess(res)) {
              if (res.data.length > 0) {
                clearInterval(timer);
                Object.assign(that.modal, {
                  visible: true,
                  pics: res.data,
                  showIndex: 0,
                  upload: true,
                  contentType: type == 1 ? "photo" : "video",
                });
                this.closeUpdate = true;
              } else {
                that.init();
                that.changeType();
                this.paneType === "car" &&
                  Bus.$emit("refreshCarModelGroup", this.fromObj.formType.date);
                clearInterval(timer);
              }
            } else {
              that.$message.error(res.msg);
            }
          });
      }, 1000);
    },
    // 添加 / 取消关注
    addCancelFollow(type) {
      let that = this;
      let params = {
        suspiciousPersonId: this.clueManageMainContentHeader_personInfo.id,
        humanId: this.clueManageMainContentHeader_personInfo.humanId,
      };
      let obj = {
        add: api.personList.suspiciousAdd,
        cancel: api.personList.suspiciousDelete,
      };
      rest.post(obj[type], params).done((res) => {
        if (helper.isSuccess(res)) {
          that.$message.success(type === "add" ? "关注成功！" : "取消成功！");
          that.init();
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    // 拖拽车辆归类
    async dropVehicle(item, bikeLabel, ele) {
      this.createStatus = false;
      let that = this;
      let selectArr = [];
      if (this.fromObj.formType.arrayType == "time") {
        this.clueManageMainContentFooter.forEach((itemList) => {
          itemList.list.forEach((item) => {
            item.flag && selectArr.push(item);
          });
        });
      } else {
        if (this.clueManageMainContentFooterTypeReault.picList) {
          this.clueManageMainContentFooterTypeReault.picList.forEach((item) => {
            item.flag && selectArr.push(item);
          });
        }
      }
      // 判断是否全部已经为将要归类的分组
      if (
        selectArr.every((selectItem) => {
          return (
            selectItem.bikeCode === item.bike_code &&
            bikeLabel === selectItem.bikeLabel
          );
        })
      ) {
        item.dragFlag = false;
        this.$message.warning("所选线索已全部在该分组中!", 3000);
        return;
      }
      let list = [];
      // if (item && item.archiveInfo && item.archiveInfo.archive_code) {
      //   list.push(item.archiveInfo.archive_code);
      // }
      selectArr.forEach((selectItem) => {
        if (
          selectItem.archiveCode &&
          list.indexOf(selectItem.archiveCode) < 0
        ) {
          list.push(selectItem.archiveCode);
        }
      });
      let ifCancel = false;
      let archiveCode = null;
      if (
        list.length === 0 &&
        item &&
        item.archiveInfo &&
        item.archiveInfo.archive_code
      ) {
        archiveCode = item.archiveInfo.archive_code;
      } else if (list.length > 0) {
        if (
          item &&
          item.archiveInfo &&
          item.archiveInfo.archive_code &&
          list.indexOf(item.archiveInfo.archive_code) < 0
        ) {
          list.unshift(item.archiveInfo.archive_code);
        }
        if (list.length > 1) {
          await groupDialog
            .show(list)
            .then((res) => {
              // 返回序号
              if (typeof res === "number") archiveCode = list[res];
            })
            .catch(() => {
              //cancel
              ifCancel = true;
            });
        } else if (
          !(item && item.archiveInfo && item.archiveInfo.archive_code) ||
          list[0] !== item.archiveInfo.archive_code
        ) {
          archiveCode = list[0];
        }
      }
      if (!ifCancel) {
        let ids = selectArr.map((item) => item.id);
        if (ids.length == 0) {
          that.$message.success("请选择线索！");
        } else {
          let judgeBikeLabel =
            bikeLabel === "0" || bikeLabel === 0 ? null : bikeLabel;
          let judgeBikeCode =
            item.bike_code === "0" || item.bike_code === 0
              ? null
              : item.bike_code;
          let params = {
            humanId: this.fromObj.formType.humanId,
            clueIds: ids,
            bikeCode: judgeBikeCode,
            bikeLabel: judgeBikeLabel,
            archiveCode,
            archiveType: archiveCode
              ? !(item && item.archiveInfo) ||
                archiveCode !== item.archiveInfo.archive_code
                ? 1 // 线索
                : 2 // 可疑车辆
              : null,
            vehicleColorNote: item.vehicleColorNote,
            vehicleFeatureNote: item.vehicleFeatureNote,
            otherNote: item.otherNote,
          };
          rest.post(api.clueManage.clueGroup, params).done((res) => {
            if (helper.isSuccess(res)) {
              that.$message.success("归类成功!");
              that.afterCheckDragClueGroupFetch();
              that.changeType();
            } else {
              that.$message.error(res.msg);
            }
          });
        }
      }
    },
    dragoverVehicle(index, item, ele) {
      this.vehicleType === "suspiciousCar"
        ? (this.suspiciousCarList[index].dragFlag = true)
        : (this.normalCarList[index].dragFlag = true);
      ele.preventDefault();
    },
    errorImgFn(itemType) {
      itemType.picUrlDefault = true;
    },
    // 点击重置
    resetFrom() {
      this.fromObj.formType = deepClone(this.fromObj.resetFormType);
    },
    // 勾选车辆
    changeVehicle() {
      let codeArr = [];
      let labelArr = [];
      this.suspiciousCarList.forEach((item, index) => {
        if (item.flag) {
          codeArr.push(item);
          labelArr.push("1");
        }
      });
      this.normalCarList.forEach((item, index) => {
        if (item.flag) {
          codeArr.push(item);
          labelArr.push("2");
        }
      });
      let codes = codeArr.map((item) => {
        return item.bike_code;
      });
      this.fromObj.formType.bikeCode = codes.join(",");
      this.fromObj.formType.bikeLabel = labelArr.join(",");
      this.fromObj.resetFormType.bikeCode = codes.join(",");
      this.fromObj.resetFormType.bikeLabel = labelArr.join(",");
      this.goSearch();
    },
    previewSidebarImg(url) {
      this.sidebarImgPreviewVisible = true;
      this.sidebarImgPreview = url;
    },
    handleDragLeave(index) {
      this.vehicleType === "suspiciousCar"
        ? (this.suspiciousCarList[index].dragFlag = false)
        : (this.normalCarList[index].dragFlag = false);
    },
    createDragoverVehicle(ele) {
      this.createNewGroupOver = true;
      ele.preventDefault();
    },
    updateMapVisible(sta) {
      this.multipleMapVisible = sta;
    },
    handleScroll({ percentY }) {
      if (percentY * 100 > 70 && !this.isChangePageNo) {
        let len = this.clueManageMainContentFooter.reduce((sum, item) => {
          return sum + item.list.length;
        }, 0);
        if (len < this.count) {
          this.fromObj.formType.pageNo++;
          this.isChangePageNo = true;
        }
      }
    },
    handleScrollBar(isShow) {
      this.scrollbarShow = isShow;
    },
    getIcon(gender) {
      return gender === "male" ? maleIcon : femaleIcon;
    },
    openPicCompare() {
      if (this.picCompareFlag) {
        return;
      }
      this.picData = [];
      this.picCompareFlag = true;
      Bus.$emit("sliceCarListOpen");
      Bus.$emit("picCompareFlag", true);
      this.leftAsideSwapFlag = true;
    },
    closePicCompare() {
      Bus.$emit("picCompareFlag", false);
      this.paneType === "car" && Bus.$emit("sliceCarListClose");
      this.picCompareFlag = false;
      this.leftAsideSwapFlag = false;
    },
    moveGroup() {
      let selectArr = [];
      this.paneType === "time" &&
        this.clueManageMainContentFooter.forEach((itemList) => {
          itemList.list.forEach((item) => {
            item.flag && selectArr.push(item);
          });
        });
      this.paneType === "car" &&
        this.carModelGroupArr.forEach((item) => {
          item.flag && selectArr.push(item);
        });
      if (selectArr.length === 0) {
        this.$message.info("请选择线索！");
        return false;
      }
      this.moveGroups = selectArr;
      this.moveToOtherGroupVisible = true;
    },
    flagChangeArr(item) {
      let flag = true;
      this.carModelGroupArr.forEach((arrItem) => {
        if (arrItem.id === item.id) {
          arrItem.flag = item.flag;
          flag = false;
        }
      });
      if (flag) {
        this.carModelGroupArr.push(item);
      }
    },
    refreshPage() {
      this.getCarGroup();
      this.goSearch();
    },
    handleNewCarGroup(command) {
      let that = this;
      let selectArr = [];
      this.paneType === "car" &&
        this.carModelGroupArr.forEach((item) => {
          item.flag && selectArr.push(item);
        });
      if (selectArr.length === 0) {
        this.$message.info("请选择线索！");
        return false;
      }
      let archiveCode = selectArr[0].archiveCode;
      let paramArr = selectArr.map((item) => {
        return item.id;
      });
      let idSet = new Set(paramArr);
      if (paramArr.length === 0) {
        this.$message.info("请选中需要新建的线索！");
        return false;
      } else {
        let archiveTemp;
        for (let item of selectArr) {
          item.archiveCode && !archiveTemp && (archiveTemp = item.archiveCode);
          if (archiveTemp && item.archiveCode !== archiveTemp) {
            that.$message.error("线索关联案件有1个以上，请单个创建！", 3000);
            return;
          }
        }
        let params = {
          humanId: this.$route.query.idCard,
          clueIds: Array.from(idSet),
          archiveCode,
          // clueInfoDOList: paramArr,
          bikeLabel: command,
          archiveType: archiveCode ? 1 : null,
          vehicleColorNote: "",
          vehicleFeatureNote: "",
          otherNote: "",
        };
        rest.post(api.clueManage.clueGroup, params).done((res) => {
          if (helper.isSuccess(res)) {
            that.$message.success("创建归类成功!");
            Bus.$emit("refreshCarModelGroup", 1);
          } else {
            that.$message.error(res.msg);
          }
        });
      }
    },
    clearCarArr() {
      this.carModelGroupArr.length = 0;
    },
    async mergeCarModelGroup(item) {
      let that = this;
      let selectArr = [];
      this.paneType === "car" &&
        this.carModelGroupArr.forEach((item) => {
          item.flag && selectArr.push(item);
        });
      if (selectArr.length === 0) {
        this.$message.warning("请先选择线索!", 3000);
        return;
      }
      // 判断是否全部已经为将要归类的分组
      if (
        selectArr.every((selectItem) => {
          return (
            selectItem.bikeCode === item.bikeCode &&
            item.bikeLabel === selectItem.bikeLabel
          );
        })
      ) {
        this.$message.warning("所选线索已全部在该分组中!", 3000);
        return;
      }
      let list = [];
      // if (item && item.archiveInfo && item.archiveInfo.archive_code) {
      //   list.push(item.archiveInfo.archive_code);
      // }
      selectArr.forEach((selectItem) => {
        if (
          selectItem.archiveCode &&
          list.indexOf(selectItem.archiveCode) < 0
        ) {
          list.push(selectItem.archiveCode);
        }
      });
      let ifCancel = false;
      let archiveCode = null;
      if (
        list.length === 0 &&
        item &&
        item.clueInfoDOList &&
        item.clueInfoDOList[0] &&
        item.clueInfoDOList[0].archiveCode
      ) {
        archiveCode = item.clueInfoDOList[0].archiveCode;
      } else if (list.length > 0) {
        if (
          item &&
          item.clueInfoDOList &&
          item.clueInfoDOList[0] &&
          item.clueInfoDOList[0].archiveCode &&
          list.indexOf(item.clueInfoDOList[0].archiveCode) < 0
        ) {
          list.unshift(item.clueInfoDOList[0].archiveCode);
        }
        if (list.length > 1) {
          await groupDialog
            .show(list)
            .then((res) => {
              // 返回序号
              if (typeof res === "number") archiveCode = list[res];
            })
            .catch(() => {
              //cancel
              ifCancel = true;
            });
        } else if (
          !(
            item &&
            item.clueInfoDOList &&
            item.clueInfoDOList[0] &&
            item.clueInfoDOList[0].archiveCode
          ) ||
          list[0] !== item.clueInfoDOList[0].archiveCode
        ) {
          archiveCode = list[0];
        }
      }
      if (!ifCancel) {
        let ids = selectArr.map((item) => item.id);
        if (ids.length == 0) {
          that.$message.warning("请选择线索！");
        } else {
          let params = {
            humanId: this.fromObj.formType.humanId,
            clueIds: ids,
            bikeCode:
              item.bikeCode === "0" || item.bikeCode === 0
                ? null
                : item.bikeCode,
            bikeLabel:
              item.bikeLabel === "0" || item.bikeLabel === 0
                ? null
                : item.bikeLabel,
            archiveCode,
            archiveType: archiveCode
              ? !(
                  item &&
                  item.clueInfoDOList &&
                  item.clueInfoDOList[0] &&
                  item.clueInfoDOList[0].archiveCode
                ) || archiveCode !== item.clueInfoDOList[0].archiveCode
                ? 1 // 线索
                : 2 // 可疑车辆
              : null,
            vehicleColorNote: item.vehicleColorNote,
            vehicleFeatureNote: item.vehicleFeatureNote,
            otherNote: item.otherNote,
          };
          rest.post(api.clueManage.clueGroup, params).done((res) => {
            if (helper.isSuccess(res)) {
              that.$message.success("归类成功!");
              Bus.$emit("refreshCarModelGroup", 1);
            } else {
              that.$message.error(res.msg);
            }
          });
        }
      }
    },
    afterCheckDragClueGroupFetch() {
      let that = this;
      // 获取可疑车辆列表
      rest
        .get(api.clueManage.findBikeLabelAndCodes, {
          humanId: that.fromObj.formType.humanId,
          bikeLabel: 1,
          startTime: moment(this.fromObj.formType.date[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          endTime: moment(this.fromObj.formType.date[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.suspiciousCarList.length = 0;
            let result = res.data ? res.data : [];
            result.forEach((item, index) => {
              if (
                !that.suspiciousCarList[index] ||
                !that.suspiciousCarList[index].flag
              ) {
                item.flag = false;
              } else {
                item.flag = true;
              }
              item.dragFlag = false;
            });
            that.suspiciousCarList = result;
          } else {
            that.$message.error(res.msg);
          }
        });
      // 获取自用车辆列表
      rest
        .get(api.clueManage.findBikeLabelAndCodes, {
          humanId: that.fromObj.formType.humanId,
          bikeLabel: 2,
          startTime: moment(this.fromObj.formType.date[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          endTime: moment(this.fromObj.formType.date[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.normalCarList.length = 0;
            let result = res.data ? res.data : [];
            result.forEach((item) => {
              item.flag = false;
              item.dragFlag = false;
            });
            that.normalCarList = result;
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    clearCheckOfList() {
      this.normalCarList.forEach((item, index) => {
        if (item && item.flag) {
          this.$set(this.normalCarList[index], "flag", false);
        }
      });
      this.suspiciousCarList.forEach((item, index) => {
        if (item && item.flag) {
          this.$set(this.suspiciousCarList[index], "flag", false);
        }
      });
    },
    getLabelList() {
      return new Promise((resolve, reject) => {
        rest.post(api.clueManage.personLabelList, {}).done((res) => {
          if (helper.isSuccess(res)) {
            resolve(res);
          } else {
            that.$message.error(res.msg);
            reject(res.msg);
          }
        });
      });
    },
    occupationChange(val) {
      if (this.defaultOccupation == val) {
        return;
      }
      rest
        .post(api.clueManage.modifyLabel, {
          id: this.clueManageMainContentHeader_personInfo.id,
          personLabel: val || null,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.defaultOccupation = val;
            this.$message.success("修改职业成功!");
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    exportClues() {
      let selectArr = [];
      this.paneType === "car" &&
        this.carModelGroupArr.forEach((item) => {
          item.flag && selectArr.push(item);
        });
      this.paneType === "time" &&
        this.clueManageMainContentFooter.forEach((itemList) => {
          itemList.list.forEach((item) => {
            item.flag && selectArr.push(item);
          });
        });
      let ids = selectArr.map((item) => item.id);
      if (ids.length === 0) {
        this.$message.info("请选中需要导出的线索！");
        return false;
      }
      if (!this.helper) this.helper = new Helper();
      rest
        .post(api.clueManage.exportClues, {
          clueIds: ids,
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
<style lang="scss">
/*修改一个滚动条水平方向显示问题*/
.clueManage-card-list .el-scrollbar__wrap {
  // overflow: hidden !important;
  height: 100%;
  overflow-x: hidden;
}
.el-switch__button {
  background-image: linear-gradient(156deg, #52bbff 0%, #2b7fff 100%);
}
</style>
<style lang="scss" scoped>
.clueManage {
  display: flex;
  flex-flow: row nowrap;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .left-sidebar {
    float: left;
    border: 1px rgba(228, 228, 228, 1) solid;
    border-top: none;
    height: 100%;
    width: 248px;
    position: relative;
    z-index: 10;
    transition: all 0.5s;
    &-img {
      width: 190px;
      height: 237px;
      margin: 1.5rem;
      > img {
        width: 100%;
        height: 100%;
      }
    }
    &-operation {
      width: 80%;
      height: 16%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin: 8% auto;
      & > p {
        cursor: pointer;
        width: 5.1rem;
        padding: 3px 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        &:hover {
          background: rgba(200, 200, 200, 0.5);
        }
      }
    }
    &-info {
      width: 100%;
      height: 15%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      font-size: 14px;
      & .copyIcon:hover {
        color: #0cb3ff;
      }
      &-main {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        > div:first-child {
          font-family: PingFangSC-Semibold;
          font-size: 20px;
          color: #000;
          font-weight: 600;
        }
      }
      > div {
        width: 75%;
      }
      &-address {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
    &-footer {
      margin-left: 5%;
      position: absolute;
      height: 5%;
      width: 90%;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top: 1px solid #e0e0e0;
      > i {
        font-size: 2rem;
        cursor: pointer;
        &:hover {
          color: #0cb3ff;
        }
      }
    }
    &.close {
      width: 78px;
      transition: all 0.5s;
      .left-sidebar-img {
        width: 54px;
        height: 67px;
        margin: 1rem 0.5rem;
        transition: all 0.5s;
      }
      .left-sidebar-info-main {
        flex-direction: column;
        justify-content: center;
        text-align: center;
      }
      .close-hide {
        display: none;
      }
      .left-sidebar-operation {
        align-items: center;
        > p {
          display: flex;
          justify-content: center;
          > i {
            position: relative;
            top: 0 !important;
          }
          &:hover {
            width: 2rem;
          }
        }
      }
    }
    &.active {
      .left-sidebar-img {
        width: 190px;
        height: 237px;
        margin: 1.5rem;
        transition: all 0.5s;
      }
    }
  }
  .main-content {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    &-header {
      height: 48px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px rgba(215, 215, 215, 1) solid;
      &-left {
        padding-left: 10px;
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
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
        .top-button {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          &:hover {
            background: rgba(200, 200, 200, 0.5);
          }
        }
      }
      &-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 40%;
        padding-right: 10px;
        > span:hover {
          background: rgba(0, 0, 0, 0.04);
        }
      }
    }
    &-pane {
      flex: 1;
      height: 100%;
      display: flex;
      flex-wrap: nowrap;
      &-left {
        width: 100%;
        height: 100%;
        flex: 1;
        &-form {
          height: 100px;
          display: flex;
          align-items: center;
          background: rgba(242, 242, 242, 1);
          border-bottom: 1px solid rgba(228, 228, 228, 1);
          > div {
            width: 18rem;
            margin: -1rem 1.5rem;
            margin-top: -20px;
            &:last-child {
              display: flex;
              align-items: flex-end;
              flex: 1;
              justify-content: flex-end;
              margin-top: 0;
            }
          }
        }
        &-list {
          flex: 1;
          height: 98%;
          display: flex;
          flex-direction: column;
          position: relative;
          &-tip {
            position: absolute;
            top: 0;
            right: 0;
            width: 202px;
            height: 94px;
            box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2),
              0 2px 4px 0 rgba(0, 0, 0, 0.12);
            z-index: 2000;
            > img {
              width: 100%;
              height: 100%;
            }
            > i {
              font-size: 24px;
              position: absolute;
              top: 2px;
              right: 2px;
              cursor: pointer;
            }
          }
          &-header {
            height: 3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          &-items {
            flex: 1;
            height: 92%;
          }
        }
        &-carList {
          width: 100%;
          height: 100%;
        }
      }
      &-right {
        width: 460px;
        height: 100%;
        border: 1px rgba(215, 215, 215, 1) solid;
        border-top: none;
        z-index: 10;
        &-sidebar {
          width: 100%;
          height: 100%;
          &-header {
            width: 472px;
            height: 5%;
            ::v-deep {
              .el-tabs__nav {
                width: 100%;
                .el-tabs__item {
                  max-width: 470px !important;
                  width: 50%;
                }
              }
              .el-tabs__content {
                padding-bottom: 0;
              }
            }
          }
          &-content {
            height: 95%;
            &-item {
              display: flex;
              align-items: center;
              margin-left: 0.1rem;
              padding-bottom: 8px;
              margin-bottom: 5px;
              &-imgWrap {
                margin: 0.5rem;
              }
              &-wordWrap {
                line-height: 32px;
                width: 260px;
                height: 136px;
                background: #fbfbfb;
                & > * {
                  line-height: 1.3em;
                }
                h3 {
                  background-image: linear-gradient(
                    174deg,
                    #fdc12d 0%,
                    #fa8d14 100%
                  );
                  border: 1px solid #f2a520;
                  border-radius: 1px;
                  padding: 0 5px;
                }
                ul {
                  height: 90px;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-around;
                  align-items: flex-start;
                  li {
                    display: flex;
                    align-items: center;
                    margin-left: -1rem;
                  }
                }
                .noThing {
                  padding-top: 10px;
                  ::v-deep .h-breakpoint--xs > :first-child {
                    width: 40px;
                    height: 40px;
                  }
                  ::v-deep .h-empty__description {
                    font-size: 12px;
                  }
                }
              }
            }
            .link-case {
              width: calc(100% - 1.2rem);
              height: 57px;
              margin: 0 auto;
              margin-bottom: 0.5rem;
              display: flex;
              align-items: center;
              background: #ffffff;
              border: 1px solid rgba(0, 84, 255, 0.2);
              > div:first-child {
                width: 32px;
                height: 100%;
                background: #c3deff;
                display: flex;
                justify-content: center;
                align-items: center;
                > i {
                  font-size: 24px;
                  color: #2080f7;
                }
              }
              > div:last-child {
                width: calc(100% - 32px);
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                > div {
                  display: flex;
                  align-items: center;
                }
              }
            }
          }
        }
      }
      &-picCompare {
        width: 470px;
        height: 100%;
        box-shadow: inset 1px 0 0 0 rgba(0, 0, 0, 0.12);
      }
    }
  }
  .right-sidebar {
    float: right;
  }
}
.right-sidebar.el-popover {
  ::v-deep {
    margin-top: 18rem !important;
  }
}
.icon-question {
  width: 57px;
  height: 22px;
  cursor: pointer;
  border: 1px #ffeaea solid;
  border-radius: 2px;
  display: flex;
  text-align: center;
  position: relative;
  z-index: 2;
  font-family: PingFangSC-Semibold;
  font-size: 12px;
  & > div:first-child {
    width: 16.8px;
    height: 20px;
    color: #ffffff;
    background: #ff3333;
  }
  & > div:last-child {
    width: 40.2px;
    height: 20px;
    background: #ffeaea;
    color: #ff0000;
  }
}
.icon-ownuse {
  width: 57px;
  height: 22px;
  cursor: pointer;
  border: 0.5px #edf4ff solid;
  border-radius: 2px;
  display: flex;
  text-align: center;
  position: relative;
  z-index: 2;
  font-family: PingFangSC-Semibold;
  font-size: 12px;
  & > div:first-child {
    width: 16.8px;
    height: 20px;
    color: #ffffff;
    background: #4a90e2;
  }
  & > div:last-child {
    width: 40.2px;
    height: 20px;
    background: #edf4ff;
    color: #4a90e2;
  }
}
.create-new-group {
  border: 1px dashed #979797;
  opacity: 0.5;
  background: #f5f5f5;
  width: 100%;
  height: 38px;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.judgeicon {
  width: 1em;
  height: 1em;
  display: inline-block;
  background: url(~@/assets/images/clueManage/relation.png);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s linear;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}
.image {
  background-size: 100% 100%;
  width: 140px;
  height: 120px;
  cursor: pointer;
}
.self-image {
  border: 1px rgb(242, 242, 242) solid;
  margin-left: 0.3rem;
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
.move-button {
  margin-left: 6px;
  text-indent: 10px;
  &::before {
    background: url(~@/assets/images/clueManage/moveBikeGroup.png) no-repeat;
  }
}
.compare-button {
  text-indent: 10px;
  &::before {
    background: url(~@/assets/images/clueManage/picCompareBut.png) no-repeat;
  }
}
.delete-button {
  &::before {
    margin-top: 3px;
    background: url(~@/assets/images/clueManage/deleteBut.png) no-repeat;
  }
}
.importBut {
  text-indent: 10px;
  &::before {
    background: url(~@/assets/images/clueManage/importBut.png) no-repeat;
  }
}
.location-button {
  text-indent: 10px;
  &::before {
    margin-top: 3px;
    background: url(~@/assets/images/clueManage/findLocation.png) no-repeat;
  }
}
</style>
