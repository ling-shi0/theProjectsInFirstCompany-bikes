<!--
 * @Descripttion: 聚类研判
 * @version:
 * @Author: someone
 * @Date: 2020-10-14 10:02:59
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-01-05 17:14:08
 -->
<template>
  <h-layout class="clusterAnalysis fs14">
    <h-layout-aside width="290px" class="por clusterAnalysis-condition">
      <div class="br_ccc clusterAnalysis-condition-in">
        <div class="clusterAnalysis-condition-in-header pt10 pl10">
          <div class="clusterAnalysis-condition-in-header-imgWrap">
            <img
              :src="personInfoObj.picUrl"
              class="w100"
              v-if="personInfoObj.picUrl"
            />
            <template v-else>
              <img
                src="../../../../assets/images/personList/head_sex_01.png"
                class="w100"
                v-if="personInfoObj.gender == 'male'"
              />
              <img
                src="../../../../assets/images/personList/head_sex_02.png"
                class="w100"
                v-else
              />
            </template>
          </div>
          <div class="fs12 pl10 clusterAnalysis-condition-in-header-wordWrap">
            <h2 class="fs16 color_333 mt5 mb5">
              {{ personInfoObj.name || "未知姓名" }}
            </h2>
            <p class="mb5" style="font-size: 14px">
              <img
                :src="getIcon(personInfoObj.gender)"
                v-if="
                  personInfoObj.gender === 'female' ||
                  personInfoObj.gender === 'male'
                "
                style="vertical-align: middle"
              />
              {{
                (personInfoObj.age && personInfoObj.age + "岁") || "未知年龄"
              }}
            </p>
            <p class="fs14">{{ personInfoObj.idCard }}</p>
            <p class="fs14">{{ personInfoObj.censusRegister }}</p>
          </div>
        </div>
        <div class="mt10 pl10 pr10 clusterAnalysis-condition-in-sidebar">
          <el-input
            style="width: 100%"
            class="el-input--width"
            placeholder="请输入"
            suffix-icon="h-icon-search"
            v-model="treeObj.params.name"
            clearable
            :on-icon-click="handleIconClick"
            :clear-icon-click="clearIconClick"
          ></el-input>
          <el-tree
            v-show="!treeObj.showTreeSearch"
            class="tree"
            ref="tree"
            :props="treeObj.props"
            :load="loadNode"
            lazy
            node-key="id"
            default-icon="h-icon-info_organization"
            show-checkbox
            @check="getCheckedNodes"
          ></el-tree>
          <template v-loading="treeSearchLoading">
            <el-tree
              class="tree"
              v-show="treeObj.showTreeSearch"
              :data="treeObj.treeSearchData"
              show-checkbox
              default-expand-all
              node-key="id"
              ref="treeSearch"
              :props="treeObj.propsSearch"
              default-icon="h-icon-info_organization"
              empty-text="暂无数据"
              @check="getCheckedNodes2"
            >
              <span class="custom-tree-node keywords_em" slot-scope="{ data }">
                <span
                  v-if="treeObj.params.name"
                  class="por"
                  style="top: 7px"
                  v-html="data.name"
                ></span>
              </span>
            </el-tree>
          </template>
        </div>
        <div class="pl10 pr10 clusterAnalysis-condition-in-footer">
          <p class="mb5">
            <span class="fw_b">是否骑车：</span>
            <el-radio-group v-model="sidebarObj.ride">
              <el-radio :label="''">全部</el-radio>
              <el-radio :label="'yes'">是</el-radio>
              <el-radio :label="'no'">否</el-radio>
            </el-radio-group>
          </p>
          <p class="mb5">
            <span class="fw_b">起始时间：</span>
            <el-date-picker
              v-model="sidebarObj.startTime2"
              type="datetime"
              style="width: 190px"
              placeholder="起始时间"
              format="yyyy/MM/dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </p>
          <p class="mb10">
            <span class="fw_b">结束时间：</span>
            <el-date-picker
              v-model="sidebarObj.endTime2"
              type="datetime"
              style="width: 190px"
              placeholder="结束时间"
              format="yyyy/MM/dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </p>
          <el-button type="primary" style="max-width: 100%" @click="goSearch()"
            >搜索</el-button
          >
        </div>
      </div>
    </h-layout-aside>
    <h-layout-content class="clusterAnalysis_main">
      <h-layout v-if="!isShowLargeMap">
        <h-layout-header class="clusterAnalysis_main_header bb_ccc">
          <h2
            class="fs14 color_333 fw_n pl10 lh44 cup dib"
            @click="throttle(obj, addClueManage, 1000)('multiple')"
          >
            <i class="h-icon-folder_adding fs24 por" style="top: 7px"></i>
            加入到线索管理
          </h2>
        </h-layout-header>
        <h-layout-content
          ref="clusterAnalysis-main-content"
          class="por clusterAnalysis-main-content"
          v-loading="Loading"
          style="height: calc(100% - 99px)"
        >
          <el-checkbox
            v-model="listIsAllChecked"
            class="por"
            style="top: 3px; margin-top: 17px; margin-left: 21px"
            @change="listAllChecked"
          >
            <i class="por" style="top: 2px">全选</i>
          </el-checkbox>
          <div
            class="scroll-bar pt10 pl5 pr5 fs14 txt_c"
            v-if="listObj.list && listObj.list.length > 0"
          >
            <div
              class="dib clusterAnalysis-main-content-itemWrap"
              style="margin: 0 auto"
            >
              <div
                class="clusterAnalysis-main-content_item txt_l clearfix"
                v-for="(item, index) in listObj.list"
                :key="index"
              >
                <div
                  @mouseenter="ItemMouseOver(index)"
                  @mouseleave="ItemMouseLeave(index)"
                  :class="
                    item.activeStatus
                      ? 'clusterAnalysis-main-content_item_in active'
                      : 'clusterAnalysis-main-content_item_in'
                  "
                >
                  <div class="bd_f2f2f2" style="height: 222px">
                    <div
                      style="height: 222px"
                      @click="showImgPreview(listObj.list, index)"
                    >
                      <h-img-view
                        :src="item.image"
                        v-if="item.image"
                        mode="fill"
                        class="wh100 clusterAnalysis-main-content_item_in_img"
                      />
                      <img
                        src="../../../../assets/images/personList/head_sex_01.png"
                        class="wh100 clusterAnalysis-main-content_item_in_img"
                        v-else
                      />
                    </div>
                    <div class="pl5 pt5 pb5 pr5 mt3 color_4d4d4d">
                      <div
                        class="clusterAnalysis-main-content_item_in-info mb3"
                      >
                        <i class="h-icon-info_time fs20 color_999"></i>
                        <p>
                          {{
                            item.passTime.substr(0, 10) +
                            " " +
                            item.passTime.substr(11, 8)
                          }}
                        </p>
                      </div>
                      <div
                        class="clusterAnalysis-main-content_item_in-info mb3"
                      >
                        <i class="h-icon-info_location fs20 color_999"></i>
                        <p :title="item.cameraName">
                          {{ item.cameraName ? item.cameraName : "暂无" }}
                        </p>
                      </div>
                    </div>
                    <el-row>
                      <el-col :span="12">
                        <div
                          class="pt2 c-tc item-button"
                          @click="addObjToMapList(item, 'faceList')"
                        >
                          <i
                            class="h-icon-location color_029834 fs24 cup"
                            title="坐标定位"
                            v-if="item.dwFlag"
                          ></i>
                          <i
                            class="h-icon-location fs24 cup"
                            title="坐标定位"
                            v-else
                          ></i
                          >坐标定位
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div
                          class="pt2 c-tc item-button"
                          @click="goClueSearch(item)"
                        >
                          <i class="h-icon-search fs24 cup" title="周边线索"></i
                          >周边线索
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <div
                          class="pt2 c-tc item-button"
                          @click="bodySearchHander(item)"
                        >
                          <i class="h-icon-users fs24 cup" title="以人搜人"></i
                          >以人搜人
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div
                          class="pt2 c-tc item-button"
                          @click="faceSearchFaceHander(item)"
                        >
                          <i class="h-icon-user fs24 cup" title="以脸搜脸"></i
                          >以脸搜脸
                        </div>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <div
                          class="pt2 c-tc item-button"
                          @click="
                            throttle(obj, addClueManage, 1000)('single', item)
                          "
                        >
                          <i
                            class="h-icon-folder_adding fs24 cup"
                            title="加入线索集"
                          ></i
                          >加入线索集
                        </div>
                      </el-col>
                      <el-col :span="4">
                        <div class="pt2 c-tc"></div>
                      </el-col>
                    </el-row>
                    <div
                      class="clusterAnalysis-main-content_item_in_hookWrap"
                      v-if="!item.hasAddToClue"
                      @click="item.flag = !item.flag"
                    >
                      <img
                        src="../../../../assets/images/clueManage/hook_icon_01.png"
                        alt
                        class="hook1"
                        v-if="!item.flag"
                      />
                      <img
                        src="../../../../assets/images/clueManage/hook_icon_02.png"
                        alt
                        class="hook2 dn"
                        v-if="!item.flag"
                      />
                      <img
                        src="../../../../assets/images/clueManage/hook_icon_03.png"
                        alt
                        class="hook3"
                        v-if="item.flag"
                      />
                    </div>
                    <div
                      class="clusterAnalysis-main-content_item_in-alreadyAdd"
                      v-if="item.hasAddToClue"
                    >
                      已添加
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h-empty v-else />
        </h-layout-content>
        <h-layout-footer class="pl10 pr10">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="sidebarObj.pageNo"
            :page-sizes="[20, 40, 60, 80]"
            :page-size="sidebarObj.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listObj.total"
            class="bt_ccc"
            style="
              position: absolute;
              bottom: 0;
              left: 290px;
              width: calc(100% - 580px);
              background: white;
              padding: 0 5px;
            "
          ></el-pagination>
        </h-layout-footer>
      </h-layout>
      <h-layout>
        <h-layout-content>
          <el-row class="fs14 pl10 pr10">
            <el-col :span="12" class="lh40">地图</el-col>
            <el-col :span="12" class="pt5 txt_r">
              <i
                class="h-icon-windows_minimize fs24 mt3 cup"
                @click="isShowLargeMap = false"
              ></i>
            </el-col>
          </el-row>
          <the-multiple-display-size-large
            ref="multipledisplaySizeSmall"
          ></the-multiple-display-size-large>
        </h-layout-content>
      </h-layout>
    </h-layout-content>
    <h-layout-aside width="290px" class="bl_ccc clusterAnalysis_manage">
      <case-manage-sidebar
        :humanId="$route.query.humanId"
        @showLargeMap="showLargeMap"
        @updateList="updateList"
      ></case-manage-sidebar>
    </h-layout-aside>
    <c-h-img-preview
      ref="cHImgPreview"
      @getCloseMes="handleClosePreview"
      @goToOnePage="goToOnePage"
    ></c-h-img-preview>
    <clue-detail-dialog
      :data="modal.pics"
      :index="modal.showIndex"
      :visible.sync="modal.visible"
      :upload="modal.upload"
      :form-type="modal.formType"
      :content-type="modal.contentType"
      @updateList="updateList"
    />
    <multiple-display
      ref="multipleDisplay"
      :visible="multipleMapVisible"
      :lonlat="lonlat"
      @update:visible="updateMapVisible"
    ></multiple-display>
  </h-layout>
</template>

<script>
import helper from "@/helper";
import "@/filters";
import $ from "jquery";
import api from "@/api";
import rest from "@/rest";
import Bus from "@/bus";
import TheMultipleDisplaySizeLarge from "@/components/map/TheMultipleDisplaySizeLarge.vue";
import cHImgPreview from "@/components/c-h-img-preview.vue";
import ClueDetailDialog from "@/components/photo-details-dialog/clue-detail-dialog";
import caseManageSidebar from "./caseManageSidebar";
import multipleDisplay from "@/components/map/multipleDisplay.vue";
import maleIcon from "@/assets/images/personList/male.png";
import femaleIcon from "@/assets/images/personList/female.png";

export default {
  data() {
    return {
      Loading: false,
      treeSearchLoading: false,
      personInfoObj: {}, // 人员信息
      sidebarObj: {
        humanId: this.$route.query.humanId,
        crossingIdsArr: [], // tree 选中的数据
        areaCode: "", // tree 选中的父节点
        cameraIndexCode: "", // tree 选中的子节点
        ride: "", // 是否骑车
        startTime2: null, // 起始时间
        startTime: "", // 起始时间
        endTime2: this.formatDate(new Date()), // 结束时间
        endTime: "", // 结束时间
        pageNo: 1, // 当前页
        pageSize: 20, // 每页显示多少条
      },
      selectClueList: [], //线索集中选中的集合
      selectOriginalList: [], //选中的原始结果集合
      treeObj: {
        props: {
          label: "name",
          children: "zones",
          isLeaf: "isLeaf",
        },
        propsSearch: {
          children: "children",
          label: "name",
        },
        params: {
          parentIndexCode: "-1",
          treeCode: "0",
          resourceType: "CAMERA",
          userId: "admin",
          capabilitySet: "",
          name: "", // 关键字
        },
        treeSearchData: [],
        showTreeSearch: false,
      },
      listObj: {
        list: [],
        total: 0,
        lastWatchedItem: -1,
      },
      modal: {
        // clue-detail-dialog 弹框参数
        visible: false, // 弹框显隐
        pics: [], // 列表数据
        showIndex: 0, // 当前显示第几个
        upload: false, // 是否是本地上传的数据
        formType: "clueDetail", // 弹框右侧展示哪个表格
        contentType: null, // 内容类型（图片、视频）
      },
      listIsAllChecked: false,
      isShowLargeMap: false,
      multipleMapVisible: false,
      lonlat: [],
      obj: { timer: null },
    };
  },
  mounted() {
    this.init();
    this.setScrollHeight();
    // 三个月前
    let start = new Date();
    let end = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 91);
    end.setTime(end.getTime() - 0);
    this.sidebarObj.startTime2 = this.formatDate(start);
    this.sidebarObj.endTime2 = this.formatDate(end);
    this.goSearch();
  },
  components: {
    cHImgPreview,
    ClueDetailDialog,
    caseManageSidebar,
    TheMultipleDisplaySizeLarge,
    multipleDisplay,
  },
  beforeDestroy() {
    if (this.obj.timer) {
      clearTimeout(this.obj.timer);
      this.obj.timer = null;
    }
  },
  methods: {
    throttle: helper.throttle,
    init() {
      let that = this;
      // 获取人员信息
      rest
        .get(api.clueManage.clueFindPersonInfo, {
          humanId: that.sidebarObj.humanId,
        })
        .done(function (res) {
          if (helper.isSuccess(res)) {
            that.personInfoObj = res.data;
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 筛选-点击搜索
    handleIconClick() {
      if (this.treeObj.params.name) {
        let that = this;
        that.treeSearchLoading = true;
        that.treeObj.showTreeSearch = true;
        that.treeObj.params.parentIndexCode = "";
        rest
          .post(api.clusterAnalysis.asyncTree, that.treeObj.params)
          .done(function (res) {
            if (helper.isSuccess(res)) {
              that.treeObj.treeSearchData = res.data;
            } else {
              that.$message.error(res.msg);
            }
            that.treeSearchLoading = false;
          });
      }
    },
    // 清除筛选内容
    clearIconClick() {
      this.treeObj.showTreeSearch = false;
    },
    // 动态加载 tree
    loadNode(node, resolve) {
      let that = this;
      if (node.level != 0) {
        that.treeObj.params.parentIndexCode = node.data.id;
      }
      rest
        .post(api.clusterAnalysis.asyncTree, that.treeObj.params)
        .done(function (res) {
          if (helper.isSuccess(res)) {
            let result = res.data;
            result.forEach((item) => {
              item.isLeaf = !item.parent;
            });
            return resolve(result);
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    // 获取 tree 节点
    getCheckedNodes() {
      this.sidebarObj.crossingIdsArr = this.$refs.tree.getCheckedNodes();
      this.setCheckedKeys();
    },
    // 获取 treeSearch 节点
    getCheckedNodes2(node) {
      let flag = true;
      for (let i = 0; i < this.sidebarObj.crossingIdsArr.length; i++) {
        if (this.sidebarObj.crossingIdsArr[i].id == node.id) {
          this.sidebarObj.crossingIdsArr.splice(i, 1);
          flag = false;
        }
      }
      if (flag) {
        this.sidebarObj.crossingIdsArr.push(node);
      }
      this.setCheckedKeys();
    },
    // 通过 key 设置选中
    setCheckedKeys() {
      let treeIds = [];
      treeIds = this.sidebarObj.crossingIdsArr.map((item) => {
        return item.id;
      });
      // treeIds：现有的节点
      this.$refs.tree.setCheckedKeys(treeIds); //list -> tree
      this.$refs.treeSearch.setCheckedKeys(treeIds); //list -> treeSearch
    },
    // 去搜索
    goSearch() {
      if (
        new Date(this.sidebarObj.startTime2) >
        new Date(this.sidebarObj.endTime2)
      ) {
        this.$message.warning("起始时间不应大于结束时间,请重新选择!", 3000);
        return;
      }
      let that = this;
      that.Loading = true;
      if (this.sidebarObj.crossingIdsArr.length > 0) {
        let areaCode = [];
        let cameraIndexCode = [];
        this.sidebarObj.crossingIdsArr.forEach((item) => {
          (item.cameraType === "0" && cameraIndexCode.push(item.id)) ||
            areaCode.push(item.id);
        });
        this.sidebarObj.areaCode = areaCode.join(",");
        this.sidebarObj.cameraIndexCode = cameraIndexCode.join(",");
      } else {
        this.sidebarObj.areaCode = "";
        this.sidebarObj.cameraIndexCode = "";
      }
      if (this.sidebarObj.startTime2) {
        this.sidebarObj.startTime =
          this.sidebarObj.startTime2.replace(" ", "T") + ".000+08:00";
      }
      if (this.sidebarObj.endTime2) {
        this.sidebarObj.endTime =
          this.sidebarObj.endTime2.replace(" ", "T") + ".000+08:00";
      }
      rest
        .post(api.clusterAnalysis.analysisPage, that.sidebarObj)
        .done(function (res) {
          if (helper.isSuccess(res)) {
            res.data.list &&
              res.data.list.forEach((item) => {
                item.flag = false;
                item.dwFlag = false;
                item.activeStatus = false;
              });
            that.listObj = res.data;
          } else {
            that.$message.error(res.msg);
          }
          that.Loading = false;
        });
    },
    // 设置 tree 的高
    setScrollHeight() {
      this.$nextTick(() => {
        var windowHeight = $(window).height(); // 可视区高度
        var treeTop = document.getElementsByClassName("tree")[0].offsetTop; //滚动元素离顶部的距离
        var scrollHeight = windowHeight - treeTop - 190; // 滚动高度
        $(".tree").css({ height: scrollHeight + "px" });
      });
    },
    // 分页 - 当前页
    handleCurrentChange(val) {
      this.listIsAllChecked = false;
      this.sidebarObj.pageNo = val;
      this.goSearch();
    },
    // 分页 - 每页多少条
    handleSizeChange(val) {
      this.sidebarObj.pageSize = val;
      this.goSearch();
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
          "-" +
          fnNum(month) +
          "-" +
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
    // 将线索管理和聚类研判的中的线索信息添加到地图的集合中呈现
    addObjToMapList(item, clickEvent) {
      if (!item.longitude) {
        this.$message.warning("该线索信息无经纬度！");
      } else {
        this.multipleMapVisible = true;
        this.lonlat = [item];
      }
    },
    // 加入到线索管理
    async addClueManage(type, item) {
      let that = this;
      let selectList;
      if (type === "single") {
        if (item.hasAddToClue == 1) {
          that.$message.info("线索已经添加！");
        } else {
          selectList = [item];
        }
      } else {
        selectList = this.listObj.list.filter((item) => {
          if (item.flag) {
            return item;
          }
        });
      }
      let paramsList = selectList.map((item) => {
        return {
          certificateNumber: this.sidebarObj.humanId,
          humanId: item.humanId,
          rowKey: item.rowKey,
          picUrl: item.image,
          passTime: item.passTime,
          placeAddress: item.cameraName,
          longitude: item.longitude,
          latitude: item.latitude,
          clueSource: 3,
          clueType: 1,
        };
      });
      if (paramsList.length == 0) {
        that.$message.info("请选择线索！");
      } else {
        await rest
          .post(api.clusterAnalysis.saveAsClue, paramsList)
          .done(function (res) {
            if (helper.isSuccess(res)) {
              that.$message.success("添加成功! ");
              that.goSearch();
              Bus.$emit("changeClueDatas");
            } else {
              that.$message.error(res.msg);
            }
          });
      }
      if (this.obj.timer) {
        clearTimeout(this.obj.timer);
        this.obj.timer = null;
      }
    },
    // 大图预览
    showImgPreview(list, index) {
      let result = list;
      result.forEach((item) => {
        item.url = item.image;
        item.certificateNumber = this.sidebarObj.certificateNumber;
        item.humanId = this.personInfoObj.humanId;
      });
      if (this.listObj.lastWatchedItem > -1) {
        this.listObj.list[this.listObj.lastWatchedItem].activeStatus = false;
        this.listObj.lastWatchedItem = -1;
      }
      this.$refs.cHImgPreview.imgPreviewShow(
        result,
        index,
        "clusterAnalysis",
        api.clusterAnalysis.analysisPage,
        this.sidebarObj
      );
    },
    // 打开详情弹框
    openClueDetails(list, index, type) {
      this.modal = {
        ...this.modal,
        ...{ visible: true, pics: list, showIndex: index, contentType: type },
      };
    },
    // 子组件保存数据时，及时的更新父组件
    updateList() {
      this.goSearch();
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
            idCard: this.sidebarObj.humanId, // 人员证件号码
            placeAddress: item.cameraName, // 地址信息
            passTime: item.passTime, // 抓拍时间
            id: item.rowKey, // 唯一值
            longitude: item.longitude, // 经度
            latitude: item.latitude, // 纬度
          },
        });
        window.open(routeData.href, "_blank");
        return false;
      }
      top.window.goToApp({
        name: "周边线索",
        url: `${prefix}/erim-web/#/home/clueSearch?idCard=${this.sidebarObj.humanId}&placeAddress=${item.cameraName}&passTime=${item.passTime}&longitude=${item.longitude}&latitude=${item.latitude}&id=${item.rowKey}`,
        param: ``,
        callback: { func: "", param: {} },
        reload: true,
      });
    },
    //以人搜人
    bodySearchHander(item) {
      const { protocol, hostname, port } = location;
      if (top === window) {
        let path =
          protocol +
          "//" +
          hostname +
          ":" +
          port +
          "/ibody-web/index.do#personSearch?imageUrl=" +
          item.image;
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
          "/ibody-web/index.do#personSearch?imageUrl=" +
          item.image,
        param: "",
        name: "以人搜人",
      });
    },
    //以脸搜脸
    faceSearchFaceHander(item) {
      const { protocol, hostname, port } = location;
      let linkParam = "faceUrl=" + item.image;
      if (top === window) {
        let path =
          protocol +
          "//" +
          hostname +
          ":" +
          port +
          "/iface-web/index.do#snapshot?faceUrl=" +
          item.image;
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
    // 列表全选
    listAllChecked() {
      if (this.listIsAllChecked) {
        this.listObj.list.forEach((item) => {
          if (item.hasAddToClue === 0) {
            item.flag = true;
          }
        });
      } else {
        this.listObj.list.forEach((item) => {
          item.flag = false;
        });
      }
    },
    handleClosePreview(index) {
      let temp = index - 0 - Math.floor((index - 0) / 20) * 20; //只要这个数除去n个20后小于20的部分
      this.listObj.list[temp].activeStatus = true;
      this.listObj.lastWatchedItem = temp;
    },
    goToOnePage(pageNo) {
      //让父组件进入放大图片组件所在页数
      if (this.sidebarObj.pageNo !== pageNo) {
        this.sidebarObj.pageNo = pageNo;
      }
    },
    ItemMouseOver(index) {
      this.listObj.list[index].activeStatus = true;
    },
    ItemMouseLeave(index) {
      this.listObj.list[index].activeStatus = false;
    },
    // 展示大地图
    showLargeMap() {
      this.isShowLargeMap = true;
    },
    getIcon(gender) {
      return gender === "male" ? maleIcon : femaleIcon;
    },
    updateMapVisible(sta) {
      this.multipleMapVisible = sta;
    },
  },
};
</script>

<style lang="scss" scoped>
.clusterAnalysis {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  > div {
    height: 100%;
  }
  .clusterAnalysis-condition {
    .clusterAnalysis-condition-in {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      .clusterAnalysis-condition-in-header {
        display: flex;
        .clusterAnalysis-condition-in-header-imgWrap {
          flex: 0 0 40%;
        }
        .clusterAnalysis-condition-in-header-wordWrap {
          flex: 1;
          p {
            word-wrap: break-word;
            i {
              left: -7px;
              top: -3px;
            }
          }
        }
      }
      .clusterAnalysis-condition-in-sidebar {
        ::v-deep .el-tabs__nav {
          width: 100%;
          text-align: center;
          > div {
            padding: 0;
            width: 33.33%;
            font-size: 12px;
          }
        }
        ::v-deep .el-tabs__header {
          margin-bottom: 10px;
        }
        ::v-deep .el-tabs__content {
          overflow: visible;
        }
      }
      .clusterAnalysis-condition-in-footer {
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        button {
          width: 100%;
          padding: 0;
          line-height: 32px;
          height: 32px;
          font-size: 12px;
        }
        ::v-deep label {
          margin: 0 6px 0 0;
          .el-radio__label {
            padding-left: 0;
          }
          span {
            font-size: 12px;
          }
        }
        ::v-deep .el-input__inner {
          font-size: 12px;
        }
      }
    }
  }
  .clusterAnalysis_main {
    .clusterAnalysis_main_header {
      i {
        top: 5px;
      }
    }
    .clusterAnalysis-main-content {
      .clusterAnalysis-main-content_item {
        height: 283px;
        width: 224px;
        margin: 0 8px 16px;
        display: inline-block;
        float: left;
        .clusterAnalysis-main-content_item_in {
          position: relative;
          width: 224px;
          height: 283px;
          border: 1px solid #ccc;
          overflow: hidden;
          transition: all 0.2s;
          background: #fff;
          .clusterAnalysis-main-content_item_in_img {
            height: 222px;
          }
          .clusterAnalysis-main-content_item_in-info {
            display: flex;
            span {
              flex: 0 0 20px;
            }
            p {
              flex: 1;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .clusterAnalysis-main-content_item_in_hookWrap {
            position: absolute;
            top: 0;
            right: 0;
            cursor: pointer;
            width: 5rem; /*以下开始放大热区*/
            height: 5rem;
            text-align: right;
            & > img {
              position: absolute;
              right: 0;
              top: 0;
            }
          }
          .clusterAnalysis-main-content_item_in-alreadyAdd {
            position: absolute;
            top: 0;
            left: 0;
            background: #f3c486;
            border-radius: 0 10px 10px 0;
            padding: 0 8px;
            display: inline-block;
            color: #000;
          }
          &.active {
            border: 1px solid #409eff;
            height: 370px;
            z-index: 2;
            box-shadow: 2px 2px 10px 2px #999;
            .clusterAnalysis-main-content_item_in_hookWrap {
              .hook1 {
                display: none;
              }
              .hook2 {
                display: block;
              }
            }
          }
        }
        &:last-child {
          margin-bottom: 40px;
        }
      }
    }
  }
  .clusterAnalysis_manage {
    position: relative;
    .clusterAnalysis_manage_header {
      ::v-deep .el-input__inner {
        height: 32px;
        line-height: 32px;
      }
    }
    .clusterAnalysis_manage_list {
      position: absolute;
      top: 44px;
      bottom: 260px;
      > div {
        width: 100%;
        height: 100%;
      }
      .clusterAnalysis_manage_list_li {
        border: 1px solid #fff;
        border-bottom: 1px solid #f2f2f2;
        display: flex;
        width: 100%;
        height: 90px;
        .clusterAnalysis_manage_list_li_imgWrap {
          display: flex;
          align-items: center;
          flex: 0 0 88px;
        }
        .clusterAnalysis_manage_list_li_wordWrap {
          width: 180px;
          display: flex;
          font-size: 12px;
          > div {
            width: 150px;
            height: 80%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            .PublicTimeAdress {
              display: flex;
              i {
                font-size: 1rem;
                top: -2px;
                left: -4px;
              }
            }
          }
          .clusterAnalysis_manage_list_li_wordWrap_tag {
            width: 40px;
            height: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-left: 1px #e0e0e0 solid;
            > i {
              font-size: 1.5rem;
            }
            .h-icon-tag_f {
              top: 1px;
              left: -4px;
              cursor: pointer;
            }
            em {
              color: #2196f3;
              border: 1px solid #2196f3;
            }
          }
        }
        .clusterAnalysis_manage_list_li_checkWrap {
          position: absolute;
          top: -7px;
          left: -7px;
          cursor: pointer;
        }
        &:hover {
          border: 1px solid #4d99f9;
        }
      }
    }
    .clusterAnalysis_manage_map {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      .clusterAnalysis_manage_map-title {
        img {
          top: 10px;
        }
      }
      .clusterAnalysis_manage_map-in {
        height: 220px;
      }
    }
  }
}
.item-button {
  width: 90%;
  margin-left: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: rgba(200, 200, 200, 0.5);
  }
}
@media screen and (max-width: 2500px) {
  .clusterAnalysis {
    .clusterAnalysis-main-content-itemWrap {
      width: 1445px;
    }
  }
}
@media screen and (max-width: 2000px) {
  .clusterAnalysis {
    .clusterAnalysis-main-content-itemWrap {
      width: 1205px;
    }
  }
}
@media screen and (max-width: 1850px) {
  .clusterAnalysis {
    .clusterAnalysis-main-content-itemWrap {
      width: 965px;
    }
  }
}
@media screen and (max-width: 1500px) {
  .clusterAnalysis {
    .clusterAnalysis-main-content-itemWrap {
      width: 725px;
    }
  }
}
@media screen and (max-width: 1200px) {
  .clusterAnalysis {
    .clusterAnalysis-main-content-itemWrap {
      width: 485px;
    }
  }
}
@media screen and (max-width: 1100px) {
  .clusterAnalysis {
    .clusterAnalysis-main-content-itemWrap {
      width: 485px;
    }
  }
}
</style>
<style lang="scss">
.el-tree--highlight-current
  .el-tree-node.is-current:not(.is-drag)
  > .el-tree-node__content {
  background: rgb(219, 234, 254);
  & .el-tree-node__label {
    color: rgba(0, 0, 0, 0.7);
  }
  & .el-tree-node__icon .h-icon-info_organization {
    color: rgba(0, 0, 0, 0.7);
  }
}
.el-tree--highlight-current .el-tree-node__content {
  &:hover {
    background: rgba(32, 128, 247, 0.08);
  }
}
</style>
