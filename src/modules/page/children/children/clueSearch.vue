<!--
 * @Descripttion: 周边线索
 * @version:
 * @Author: someone
 * @Date: 2020-10-15 20:49:49
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-01-05 15:01:32
 -->
<template>
  <div class="clueSearch fs14" @click="clickWrap()">
    <h-layout class="clueSearch-in">
      <h-layout-aside width="290px" class="por">
        <div class="clueSearch-in-leftAside br_ccc">
          <div class="clueSearch-in-leftAside-header pt10 pl10">
            <div class="img_box">
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
            <div class="fs14 word_box pl5">
              <h2 class="fs16 color_333 mb2">
                {{ personInfoObj.name || "未知姓名" }}
              </h2>
              <p class="mb2" style="font-size: 14px">
                <img
                  :src="getIcon(personInfoObj.gender)"
                  v-if="
                    personInfoObj.gender === 'female' ||
                    personInfoObj.gender === 'male'
                  "
                  style="vertical-align: middle"
                />
                {{ personInfoObj.age }}岁
              </p>
              <p class="mb2">{{ personInfoObj.idCard }}</p>
              <p>{{ personInfoObj.censusRegister }}</p>
            </div>
          </div>
          <el-tabs
            v-model="pageType.asideTabType"
            class="clueSearch-in-leftAside-tabs"
          >
            <el-tab-pane label="找点位" name="pointPosition" class="pl10 pr10">
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
                  <span
                    class="custom-tree-node keywords_em"
                    slot-scope="{ data }"
                  >
                    <span
                      v-if="treeObj.params.name"
                      class="por"
                      style="top: 7px"
                      v-html="data.name"
                    ></span>
                  </span>
                </el-tree>
              </template>
            </el-tab-pane>
            <el-tab-pane
              label="定位搜"
              name="location"
              class="clueSearch-in-leftAside-tabs-location pl10 pr10"
            >
              <div class="mb10">
                中心点
                <div class="por">
                  <el-input
                    class="el-input--width"
                    placeholder="请输入"
                    v-model="locationObj.locationType.centerPoint"
                    clearable
                    @change="locationChange"
                    :clear-icon-click="locationClearIconClick"
                    style="width: 100%"
                  ></el-input>
                  <div
                    class="
                      clueSearch-in-leftAside-tabs-location-centerPoint
                      scroll-bar-wrap
                    "
                    v-if="locationObj.locationType.isShowSearchWrap"
                  >
                    <ul class="scroll-bar">
                      <li
                        v-for="(item, index) in locationObj.list
                          .centerPointList"
                        @click="changeCenterPoint(item)"
                        :key="index"
                      >
                        <p
                          v-html="
                            item.name.replace(
                              new RegExp(item.name, 'g'),
                              `<span>${item.name}</span>`
                            )
                          "
                        ></p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <p class="mb10">
                搜索范围(m)
                <el-input
                  placeholder="请输入范围"
                  v-model="locationObj.locationType.distance"
                  clearable
                ></el-input>
              </p>
              <el-row>
                <el-col :span="12" class="pr5">
                  <el-button
                    type="primary"
                    size="small"
                    @click="throttle(obj, goLocation, 1000)()"
                    >定位</el-button
                  >
                </el-col>
                <el-col :span="12" class="pl5 fs12">
                  <el-button size="small" @click="goLocationReset()"
                    >重置</el-button
                  >
                </el-col>
              </el-row>
              <el-row v-if="locationObj.list.pointResult.length > 0">
                <el-col :span="19">
                  <h2 class="fs14 mb5 mt10">
                    点位查询结果
                    <span class="fw_n"
                      >({{
                        locationObj.list.total - 1 <= 0
                          ? 0
                          : locationObj.list.total - 1
                      }})</span
                    >
                  </h2>
                </el-col>
                <el-col :span="5">
                  <el-checkbox
                    v-model="allChecked"
                    class="por"
                    style="top: 6px"
                    @change="checkAllPoint"
                    >全选</el-checkbox
                  >
                </el-col>
              </el-row>
              <div class="scroll-bar-wrap fs12 location_result">
                <ul
                  class="scroll-bar"
                  @scroll="scrollFetchPositionSearch"
                  v-show="
                    locationObj.list &&
                    locationObj.list.pointResult &&
                    locationObj.list.pointResult.length > 0
                  "
                >
                  <li
                    class="mb5 pt5"
                    v-for="(item, index) in locationObj.list.pointResult"
                    :key="index"
                  >
                    <el-checkbox
                      v-model="item.flag"
                      class="location_result_checkbox pl30"
                      @change="changeLocationFlag"
                    >
                      <p class="fs12" :title="item.name">{{ item.name }}</p>
                      <span class="color_999 fs12">监控点</span>
                    </el-checkbox>
                    <div class="location_result_checkbox-icon mr2">
                      <i
                        class="h-icon-liveview cup fs22"
                        @click="
                          throttle(obj, videoPreview, 1000)('PlayReal', item)
                        "
                        title="视频预览"
                      ></i>
                      <i
                        class="h-icon-picture cup fs22"
                        @click="signVideoStructure(item)"
                        title="视频结构化"
                      ></i>
                    </div>
                  </li>
                </ul>
                <h-empty
                  size="sm"
                  v-if="locationObj.list.pointResult.length == 0"
                  description="暂无点位数据"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="视频结构化"
              name="videoStructure"
              class="clueSearch-in-leftAside-tabs-videoStructure"
            >
              <el-row class="bb_ccc lh36 pl10 pr10">
                <el-col :span="12">上传录像</el-col>
                <el-col :span="12" class="txt_r cup">
                  <div @click="throttle(obj, seeHistoryTask, 1000)()">
                    <el-button icon="h-icon-search ">查看历史任务</el-button>
                  </div>
                </el-col>
              </el-row>
              <el-row class="pt5 pl10 pr10">
                <el-col
                  :span="8"
                  class="
                    clueSearch-in-leftAside-tabs-videoStructure-list
                    pl5
                    pr5
                    mb10
                  "
                >
                  <div
                    class="
                      clueSearch-in-leftAside-tabs-videoStructure-list-bdWrap
                      bd_ccc
                      txt_c
                      pt10
                      cup
                    "
                    @click="throttle(obj, openUploadVideo, 1000)()"
                  >
                    <i class="h-icon-add fs22"></i>
                    <p>上传视频</p>
                  </div>
                </el-col>
                <el-col
                  :span="8"
                  class="
                    clueSearch-in-leftAside-tabs-videoStructure-list
                    pl5
                    pr5
                    mb10
                  "
                  v-for="(item, index) in videoStructureObj"
                  :key="item"
                >
                  <div
                    class="
                      clueSearch-in-leftAside-tabs-videoStructure-list-bdWrap
                      por
                    "
                  >
                    <img
                      src="../../../../assets/images/clueSearch/sidebar-videoCover.jpg"
                      alt="图片错误"
                      class="w100 bd_ccc"
                    />
                    <i
                      class="
                        h-icon-tip_error
                        clueSearch-in-leftAside-tabs-videoStructure-list-bdWrap-close
                        fs22
                        cup
                      "
                      @click="deleteUploadVideo(index)"
                    ></i>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
          <div
            class="bottom pl5 pr5"
            v-if="pageType.asideTabType == 'pointPosition'"
          >
            <el-row>
              <el-col :span="12" class="pr5">
                <el-button
                  type="primary"
                  size="small"
                  @click="throttle(obj, goPointPositionSearch, 1000)()"
                  >查询</el-button
                >
              </el-col>
              <el-col :span="12" class="pl5">
                <el-button
                  type="primary"
                  size="small"
                  @click="goStructureFind('point')"
                  >结构化</el-button
                >
              </el-col>
            </el-row>
          </div>
          <div
            class="bottom pl5 pr5"
            v-if="pageType.asideTabType == 'location'"
          >
            <el-row>
              <el-col :span="12" class="pr5">
                <el-button
                  type="primary"
                  size="small"
                  @click="throttle(obj, goLocationSearch, 1000)()"
                  >查询</el-button
                >
              </el-col>
              <el-col :span="12" class="pl5">
                <el-button
                  type="primary"
                  size="small"
                  @click="goStructureFind('position')"
                  >结构化</el-button
                >
              </el-col>
            </el-row>
          </div>
          <div
            class="bottom bottom_three pl5 pr5"
            v-if="pageType.asideTabType == 'videoStructure'"
          >
            <el-row>
              <el-col :span="12" class="pr5">
                <el-button type="primary" size="small" @click="videoAnalysis()"
                  >开始分析</el-button
                >
              </el-col>
              <el-col :span="12" class="pl5">
                <el-button size="small">重置</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </h-layout-aside>
      <h-layout-content class="clueSearch-in-main">
        <h-layout
          v-show="pageType.searchStructureType == 'search' && !isShowLargeMap"
        >
          <h-layout-header>
            <el-row class="clueSearch-in-main-header bb_ccc fs14 por">
              <el-col :span="6">
                <h2
                  class="fs14 color_333 fw_n pl10 lh44 cup dib"
                  @click="throttle(obj, addClueManage, 1000)('multiple')"
                >
                  <i class="h-icon-folder_adding fs24 por" style="top: 8px"></i>
                  加入到线索管理
                </h2>
              </el-col>
              <el-col
                :span="18"
                class="clueSearch-in-main-header-condition txt_r pr50 por pt5"
              >
                <el-date-picker
                  v-model="conditionObj.conditionType.defaultTime"
                  type="datetimerange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  style="width: 350px"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @change="changeTime"
                  class="mt2"
                />
                <span
                  :class="{
                    active: conditionObj.conditionType.showSearchCondition,
                  }"
                  style="position: absolute; top: 9px"
                >
                  <i
                    class="h-icon-filter fs30 cup"
                    @click="
                      conditionObj.conditionType.showSearchCondition =
                        !conditionObj.conditionType.showSearchCondition
                    "
                  ></i>
                </span>
              </el-col>
              <el-col
                :span="24"
                class="
                  clueSearch-in-main-header-conditionWrap
                  fs12
                  pt10
                  pb10
                  pr10
                "
                v-if="conditionObj.conditionType.showSearchCondition"
              >
                <div
                  class="clueSearch-in-main-header-conditionWrap-in pl10 mb10"
                  v-if="0"
                >
                  <h4 class="color_999 fl mr10 pt2 fw_n">车身颜色</h4>
                  <ul class="fli clearfix">
                    <li
                      v-for="(item, index) in conditionObj.conditionList
                        .carColorList"
                      :key="item.customOrder"
                      :class="['cup', item.flag ? 'active' : '']"
                      @click="changeCarColor(item, index)"
                    >
                      <template v-if="index == 0"
                        >&nbsp;&nbsp;{{ item.name }}&nbsp;&nbsp;</template
                      >
                      <template v-else>
                        <i :style="{ background: item.dataValue }"></i>
                        {{ item.name }}色
                      </template>
                    </li>
                  </ul>
                </div>
                <div
                  class="clueSearch-in-main-header-conditionWrap-in pl10 mb10"
                  v-if="0"
                >
                  <h4 class="color_999 fl mr10 pt2 fw_n">车身特征</h4>
                  <ul class="fli clearfix">
                    <li
                      :class="[
                        'cup',
                        conditionObj.conditionType.withFrontBasket == 'yes'
                          ? 'active'
                          : '',
                      ]"
                      @click="
                        conditionObj.conditionType.withFrontBasket =
                          conditionObj.conditionType.withFrontBasket == 'yes'
                            ? ''
                            : 'yes'
                      "
                    >
                      &nbsp;&nbsp;车筐&nbsp;&nbsp;
                    </li>
                    <li
                      :class="[
                        'cup',
                        conditionObj.conditionType.withRearBox == 'yes'
                          ? 'active'
                          : '',
                      ]"
                      @click="
                        conditionObj.conditionType.withRearBox =
                          conditionObj.conditionType.withRearBox == 'yes'
                            ? ''
                            : 'yes'
                      "
                    >
                      &nbsp;&nbsp;货箱&nbsp;&nbsp;
                    </li>
                  </ul>
                </div>
                <div
                  class="clueSearch-in-main-header-conditionWrap-in pl10"
                  v-if="0"
                >
                  <h4 class="color_999 fl mr10 pt2 fw_n">是否骑车</h4>
                  <el-radio-group v-model="conditionObj.conditionType.ride">
                    <el-radio :label="''">全部</el-radio>
                    <el-radio :label="'yes'">是</el-radio>
                    <el-radio :label="'no'">否</el-radio>
                  </el-radio-group>
                </div>
                <div
                  class="clueSearch-in-main-header-conditionWrap-in pl10 mb10"
                >
                  <h4 class="color_999 fl mr10 pt2 fw_n">关联结果</h4>
                  <ul class="fli clearfix">
                    <li
                      v-for="(item, index) in conditionObj.conditionList
                        .filterLink"
                      :key="index"
                      :class="[
                        'cup',
                        conditionObj.conditionType.filterLink == item.type
                          ? 'active'
                          : '',
                      ]"
                      @click="changeConditionObjFilterLink(item.type)"
                    >
                      {{ item.text }}
                    </li>
                  </ul>
                </div>
                <div
                  class="clueSearch-in-main-header-conditionWrap-in pl10 mb10"
                >
                  <h4 class="color_999 fl mr10 pt2 fw_n txt_r">骑车</h4>
                  <ul class="fli clearfix">
                    <li
                      v-for="(item, index) in conditionObj.conditionList.ride"
                      :key="index"
                      :class="[
                        'cup',
                        conditionObj.conditionType.ride == item.type
                          ? 'active'
                          : '',
                      ]"
                      @click="changeConditionObjRide(item.type)"
                    >
                      {{ item.text }}
                    </li>
                  </ul>
                </div>
                <!-- <div
                  class="clueSearch-in-main-header-conditionWrap-in pl10 mb10"
                >
                  <h4 class="color_999 fl mr10 pt2 fw_n txt_r">车辆类型</h4>
                  <ul
                    :class="[
                      'fli clearfix',
                      conditionObj.conditionType.ride == 'yes'
                        ? ''
                        : 'clueSearch-in-main-header-conditionWrap-in-vehicleType',
                    ]"
                  >
                    <li
                      v-for="(item, index) in conditionObj.conditionList
                        .vehicleType"
                      :key="index"
                      :class="[
                        'cup',
                        conditionObj.conditionType.vehicleType == item.type
                          ? 'active'
                          : '',
                      ]"
                      @click="changeConditionObjVehicleType(item.type)"
                    >
                      {{ item.text }}
                    </li>
                  </ul>
                </div> -->
                <div class="txt_r">
                  <el-button type="primary" @click="conditionObjSearch()"
                    >确认</el-button
                  >
                  <el-button @click="conditionObjReset()">重置</el-button>
                </div>
              </el-col>
            </el-row>
          </h-layout-header>
          <h-layout-content class="clueSearch-in-main-content">
            <el-checkbox
              v-model="listIsAllChecked"
              class="por"
              style="top: 3px; margin-top: 17px; margin-left: 21px"
              @change="listAllChecked"
            >
              <i class="por" style="top: 2px">全选</i>
            </el-checkbox>
            <div class="scroll-bar-wrap" style="height: calc(100% - 50px)">
              <div
                class="
                  scroll-bar
                  pt20
                  clueSearch-in-main-content-loading
                  pl10
                  pr10
                  pb30
                  fs14
                  por
                "
                style="height: calc(100% - 92px)"
                v-loading="searchListResult.loading"
              >
                <div
                  class="dib clueSearch-in-main-content-itemWrap"
                  style="margin: 0 auto"
                  v-if="
                    searchListResult.list && searchListResult.list.length > 0
                  "
                >
                  <div
                    class="
                      clueSearch-in-main-content-item
                      pl10
                      pr10
                      mb20
                      fl
                      txt_l
                    "
                    v-for="(item, index) in searchListResult.list"
                    :key="index"
                  >
                    <div
                      :class="
                        item.activeStatus
                          ? 'clueSearch-in-main-content-item-bdWrap active por'
                          : 'clueSearch-in-main-content-item-bdWrap por'
                      "
                      @mouseenter="item.activeStatus = true"
                      @mouseleave="item.activeStatus = false"
                    >
                      <div
                        :style="item.flag ? 'border: 1px solid #409eff;' : ''"
                        class="
                          clueSearch-in-main-content-item-bdWrap-con
                          bd_f2f2f2
                        "
                      >
                        <div
                          @click="showImgPreview(searchListResult.list, index)"
                        >
                          <h-img-view
                            :src="item.target_sub_url"
                            mode="contain"
                            style="height: 222px"
                            class="w100 bb_ccc"
                          />
                        </div>
                        <div class="pt5 pr5 mt5">
                          <div
                            class="
                              clueSearch-in-main-content-item-bdWrap-con-info
                              color_4d4d4d
                              mb3
                            "
                          >
                            <i class="h-icon-info_time fs20 color_999"></i>
                            <p>
                              {{ item.createTime ? item.createTime : "暂无" }}
                            </p>
                          </div>
                          <div
                            class="
                              clueSearch-in-main-content-item-bdWrap-con-info
                              color_4d4d4d
                              mb3
                            "
                          >
                            <i class="h-icon-info_location fs20 color_999"></i>
                            <p :title="item.collect_address">
                              {{
                                item.collect_address
                                  ? item.collect_address
                                  : "暂无"
                              }}
                            </p>
                          </div>
                        </div>
                        <div class="card-buttons">
                          <div
                            @click="
                              throttle(obj, addClueManage, 1000)('single', item)
                            "
                          >
                            <i class="h-icon-folder_adding fs24 cup"></i>
                            加入线索集
                          </div>
                          <div @click="bodySearchHander(item)">
                            <img
                              src="@/assets/images/clueManage/findPerson.png"
                            />
                            以人搜人
                          </div>
                          <div @click="faceSearchFaceHander(item)">
                            <img
                              src="@/assets/images/clueManage/findFace.png"
                            />
                            以脸搜脸
                          </div>
                        </div>
                        <div
                          class="
                            clueSearch-in-main-content-item-bdWrap-con-hookWrap
                          "
                          v-if="!item.hasAddToClue"
                          @click="item.flag = !item.flag"
                        >
                          <img
                            src="../../../../assets/images/clueManage/hook_icon_01.png"
                            class="hook1"
                            v-if="!item.flag"
                          />
                          <img
                            src="../../../../assets/images/clueManage/hook_icon_02.png"
                            class="hook2 dn"
                            v-if="!item.flag"
                          />
                          <img
                            src="../../../../assets/images/clueManage/hook_icon_03.png"
                            class="hook3"
                            v-if="item.flag"
                          />
                        </div>
                        <div
                          class="
                            clueSearch-in-main-content-item-bdWrap-con-alreadyAdd
                          "
                          v-if="item.hasAddToClue"
                        >
                          已添加
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h-empty v-else />
              </div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="conditionObj.conditionType.pageNo"
                :page-sizes="[20, 40, 60, 80]"
                :page-size="conditionObj.conditionType.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="searchListResult.total"
                class="pl10 pr10 bt_ccc"
                style="
                  position: absolute;
                  bottom: 0;
                  width: calc(100% - 580px);
                  background: white;
                "
              ></el-pagination>
            </div>
          </h-layout-content>
        </h-layout>
        <h-layout
          v-show="
            pageType.searchStructureType == 'structure' && !isShowLargeMap
          "
        >
          <h-layout-header class="bb_ccc">
            <el-breadcrumb separator="/" class="fs14 mt10 pb10 pl10">
              <el-breadcrumb-item>
                <div
                  class="cup"
                  @click="pageType.searchStructureType = 'search'"
                >
                  <span class="iconfont back" style="font-size: 14px"
                    >&#xed45;</span
                  >
                  返回
                </div>
              </el-breadcrumb-item>
              <el-breadcrumb-item>结构化任务管理</el-breadcrumb-item>
            </el-breadcrumb>
          </h-layout-header>
          <h-layout-content>
            <el-tabs
              v-model="pageType.mainTabType"
              @tab-click="handleClickMainTabType"
            >
              <el-tab-pane
                label="在线结构化"
                name="onlineStructured"
              ></el-tab-pane>
              <el-tab-pane
                label="离线结构化"
                name="offlineStructured"
              ></el-tab-pane>
              <el-tab-pane
                label="历史任务"
                name="historicalTasks"
              ></el-tab-pane>
            </el-tabs>
            <div class="mb10 clearfix">
              <div
                class="fl cup"
                @click="deletTask(structureObj.taskCheckedList, 'multiple')"
              >
                <i class="h-icon-delete fs22"></i>
                <span class="por" style="top: -5px">删除</span>
              </div>
              <div
                class="fl ml10 cup por"
                style="top: 1px"
                @click="throttle(obj, taskRefresh, 1000)()"
              >
                <i class="h-icon-refresh fs20"></i>
                <span class="por" style="top: -4px">刷新</span>
              </div>
            </div>
            <el-table
              ref="multipleTable"
              :data="structureObj.structureData.list"
              force-scroll
              style="width: 100%"
              class="structureTab"
              v-loading="structureObj.loading"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection"></el-table-column>
              <el-table-column
                label="序号"
                type="index"
                width="100"
              ></el-table-column>
              <el-table-column
                prop="taskName"
                label="任务名称"
              ></el-table-column>
              <el-table-column label="任务日期" width="200">
                <template slot-scope="scope">
                  {{ scope.row.createTime }}
                </template>
              </el-table-column>
              <el-table-column
                prop="endTime"
                label="完成时间"
                width="200"
              ></el-table-column>
              <el-table-column label="进度" width="150">
                <template slot-scope="scope"
                  >已完成 {{ scope.row.taskProcess }}%</template
                >
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="link"
                    size="small"
                    :disabled="scope.row.taskProcess != '100' ? true : false"
                    @click="seeTask(scope.row)"
                    >查看</el-button
                  >
                  <el-button
                    type="link"
                    size="small"
                    @click="deletTask(scope.row, 'single')"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChangeStructure"
              @current-change="handleCurrentChangeStructure"
              :current-page="structureObj.params.pageNo"
              :page-sizes="[20, 40, 60, 80]"
              :page-size="structureObj.params.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="structureObj.structureData.total"
              class="pl10 pr10 bt_ccc"
            ></el-pagination>
          </h-layout-content>
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
      <h-layout-aside width="290px" class="clusterAnalysis_in_manage bl_ccc">
        <case-manage-sidebar
          :humanId="$route.query.idCard"
          @showLargeMap="showLargeMap"
          @updateList="updateList"
        ></case-manage-sidebar>
      </h-layout-aside>
    </h-layout>
    <el-dialog
      title="结构化任务"
      :visible.sync="structureDialogObj.structureDialog"
      size="tiny"
    >
      <div class="pb30">
        <el-form
          :model="structureDialogObj"
          label-position="top"
          :rules="structureDialogRules"
          ref="structureDialog"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="开始时间"
            prop="beginTime"
            style="margin: 0 110px"
          >
            <el-date-picker
              v-model="structureDialogObj.beginTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择日期时间"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" style="margin: 0 110px">
            <el-date-picker
              v-model="structureDialogObj.endTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择日期时间"
            />
          </el-form-item>
          <el-form-item
            label="任务名称"
            prop="taskName"
            style="margin: 0 110px"
          >
            <el-input
              class="el-input--width w100"
              ref="inputVal"
              v-model="structureDialogObj.taskName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitFormStructure('structureDialog')"
          >确定</el-button
        >
        <el-button @click="resetFormStructure('structureDialog')"
          >重置</el-button
        >
      </span>
    </el-dialog>
    <c-h-img-preview
      ref="cHImgPreview"
      @getCloseMes="handleClosePreview"
      @goToOnePage="goToOnePage"
    ></c-h-img-preview>
  </div>
</template>

<script>
import $ from "jquery";
import helper from "@/helper";
import Player from "@/upload/player";
import "@/filters";
import api from "@/api";
import rest from "@/rest";
import Bus from "@/bus";
import Helper from "@/upload/helper";
import TheMultipleDisplaySizeLarge from "@/components/map/TheMultipleDisplaySizeLarge.vue";
import cHImgPreview from "@/components/c-h-img-preview.vue";
import caseManageSidebar from "./caseManageSidebar";
import maleIcon from "@/assets/images/personList/male.png";
import femaleIcon from "@/assets/images/personList/female.png";

export default {
  data() {
    return {
      pageType: {
        asideTabType: "location", // aside tab类型
        mainTabType: "", // 查询结构的 tab 类型
        searchStructureType: "search", // 查询列表 / 结构化的列表 显隐
      },
      allChecked: false,
      videoParams: {},
      player: null,
      pointPositionObj: {
        // 找点位 obj
        certificateNumber: this.$route.query.idCard,
        crossingIdsArr: [], // tree 选中的数据
        areaCode: "", // tree 选中的父节点
        cameraIndexCode: "", // tree 选中的子节点
        pageNo: 1,
        pageSize: 20,
        startTime: "",
        endTime: "",
        ride: "", // 是否骑车
      },
      treeObj: {
        // tree Obj
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
      locationObj: {
        // 定位搜 obj
        list: {
          centerPointList: [], // 中心点列表
          pointResult: [], // 定位查询的结果
          total: 0,
          totalPage: 0,
        },
        locationType: {
          centerPoint: "",
          isShowSearchWrap: false,
          bbox: "117.64128496647,39.017377695247,117.65769703353,39.024316304753",
          geometryType: "Circle",
          distance: 1000,
          height: 646,
          imgPath: true,
          isCluster: false,
          isPage: true,
          latitude: "30.211825",
          limit: 10,
          longitude: "120.218705",
          needDist: false,
          needList: true,
          resourceType: "CAMERA",
          start: 1,
          treeCode: 0,
          width: 1528,
        },
        selectCenterPoint: {}, // 选中的中心点数据
        searchParams: {
          // 查询参数
          certificateNumber: this.$route.query.idCard,
          areaCode: "", // tree 选中的父节点
          cameraIndexCode: "", // tree 选中的子节点
          pageNo: 1,
          pageSize: 20,
          startTime: "",
          endTime: "",
          ride: "", // 是否骑车
        },
      },
      videoStructureObj: [], // 视频结构化
      conditionObj: {
        // 筛选条件 obj
        conditionList: {
          carColorList: [], // 车辆颜色
          filterLink: [
            // 关联结果
            {
              text: "全部结果",
              type: "all",
            },
            {
              text: "关联人脸",
              type: "face",
            },
          ],
          ride: [
            // 骑车
            {
              text: "全部",
              type: "",
            },
            {
              text: "是",
              type: "yes",
            },
            {
              text: "否",
              type: "no",
            },
            {
              text: "未知",
              type: "unknown",
            },
          ],
          vehicleType: [
            // 车辆类型
            {
              text: "全部",
              type: "",
            },
            {
              text: "二轮车",
              type: "twoWheelVehicle",
            },
            {
              text: "三轮车",
              type: "threeWheelVehicle",
            },
            {
              text: "未知",
              type: "unknown",
            },
          ],
        },
        conditionType: {
          showSearchCondition: false, // 筛选条件的显隐
          defaultTime: [
            // 筛选时间
            new Date(new Date().getTime() - 3600 * 1000 * 24),
            new Date(),
          ],
          startTime: "",
          endTime: "",
          withFrontBasket: "", // 车筐
          withRearBox: "", // 货箱
          pageNo: 1,
          pageSize: 20,
          filterLink: "all", // 关联结果
          ride: "", // 骑车
          vehicleType: "", // 车辆类型
        },
        resetConditionType: {
          showSearchCondition: true, // 筛选条件的显隐
          defaultTime: [
            // 筛选时间
            new Date(new Date().getTime() - 3600 * 1000 * 24),
            new Date(),
          ],
          startTime: "",
          endTime: "",
          withFrontBasket: "", // 车筐
          withRearBox: "", // 货箱
          ride: "", // 是否骑车
          pageNo: 1,
          pageSize: 20,
        },
      },
      structureDialogObj: {
        // 结构化弹框
        structureDialog: false, // 是否显示弹框
        beginTime: "", // 开始时间
        endTime: "", // 结束时间
        taskName: "", // 任务名称
      },
      structureDialogRules: {
        // 结构化弹框-rule
        beginTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "blur" },
        ],
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
      },
      personInfoObj: {}, // 人员信息
      searchListResult: {
        // 查询结果
        list: [],
        total: 0,
        loading: false,
      },
      structureObj: {
        // 结构化数据
        loading: false,
        params: {
          pageNo: 1,
          pageSize: 20,
          taskType: "0", // 结构化类型：0（在线）、1（离线）
          taskProcess: "", // 进度状态，查询历史任务时，值为 100
          humanId: "",
        },
        structureData: {
          list: [],
          total: 0,
        },
        taskCheckedList: [],
      },
      taskObj: {
        // 任务对象
        certificateNumber: this.$route.query.idCard,
        videoTaskId: "",
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
      isShowLargeMap: false,
      listIsAllChecked: false,
      imgPreviewRequestObj: {},
      obj: { timer: null },
      scrollTimer: null,
    };
  },
  watch: {
    "structureDialogObj.structureDialog"(val) {
      if (!val) {
        this.resetFormStructure("structureDialog");
      }
    },
  },
  mounted() {
    this.setScrollHeight();
    this.init();
    this.initPlayer(); //初始化视频预览播放器
  },
  components: {
    TheMultipleDisplaySizeLarge,
    cHImgPreview,
    caseManageSidebar,
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
          humanId: that.pointPositionObj.certificateNumber,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.personInfoObj = res.data;
          } else {
            that.$message.error(res.msg);
          }
        });
      //跳转到线索查询页面时初始化对应的经纬度和地址信息
      if (that.$route.query.id) {
        if (that.$route.query.longitude) {
          that.conditionObj.conditionType.defaultTime = [];
          let passTime = that.$route.query.passTime;
          let dateTime = new Date(passTime).getTime();
          //前半小时
          let beginDateTime = new Date(dateTime - 30 * 60 * 1000);
          //后半小时
          let endDateTime = new Date(dateTime + 30 * 60 * 1000);
          that.conditionObj.conditionType.defaultTime.push(beginDateTime);
          that.conditionObj.conditionType.defaultTime.push(endDateTime);
          if (that.$route.query.longitude) {
            if (that.$route.query.longitude === "null") {
              that.locationObj.selectCenterPoint.longitude = "";
            } else {
              that.locationObj.selectCenterPoint.longitude =
                that.$route.query.longitude;
            }
          } else {
            that.locationObj.selectCenterPoint.longitude = "";
          }
          if (that.$route.query.latitude) {
            if (that.$route.query.latitude === "null") {
              that.locationObj.selectCenterPoint.latitude = "";
            } else {
              that.locationObj.selectCenterPoint.latitude =
                that.$route.query.latitude;
            }
          } else {
            that.locationObj.selectCenterPoint.latitude = "";
          }
          if (that.$route.query.placeAddress) {
            if (that.$route.query.placeAddress === "null") {
              that.locationObj.locationType.centerPoint = "";
            } else {
              that.locationObj.locationType.centerPoint =
                that.$route.query.placeAddress;
            }
          } else {
            that.locationObj.locationType.centerPoint = "";
          }
          // that.locationObj.selectCenterPoint.longitude =
          //   (that.$route.query.longitude === "null") || "";
          // that.locationObj.selectCenterPoint.latitude =
          //   that.$route.query.latitude || "";
          // that.locationObj.locationType.centerPoint =
          //   that.$route.query.placeAddress || "";
        } else {
          that.$message.error("中心点位坐标为空，请手动输入!");
          if (that.$route.query.longitude) {
            if (that.$route.query.longitude === "null") {
              that.locationObj.selectCenterPoint.longitude = "";
            } else {
              that.locationObj.selectCenterPoint.longitude =
                that.$route.query.longitude;
            }
          } else {
            that.locationObj.selectCenterPoint.longitude = "";
          }
          if (that.$route.query.latitude) {
            if (that.$route.query.latitude === "null") {
              that.locationObj.selectCenterPoint.latitude = "";
            } else {
              that.locationObj.selectCenterPoint.latitude =
                that.$route.query.latitude;
            }
          } else {
            that.locationObj.selectCenterPoint.latitude = "";
          }
          if (that.$route.query.placeAddress) {
            if (that.$route.query.placeAddress === "null") {
              that.locationObj.locationType.centerPoint = "";
            } else {
              that.locationObj.locationType.centerPoint =
                that.$route.query.placeAddress;
            }
          } else {
            that.locationObj.locationType.centerPoint = "";
          }
          // that.locationObj.selectCenterPoint.longitude =
          //   that.$route.query.longitude || "";
          // that.locationObj.selectCenterPoint.latitude =
          //   that.$route.query.latitude || "";
          // that.locationObj.locationType.centerPoint =
          //   that.$route.query.placeAddress || "";
        }
      }

      // 获取车辆颜色
      rest.get(api.clueManage.findAllColors).done((res) => {
        if (helper.isSuccess(res)) {
          let result = res.data;
          result.unshift({
            name: "不限",
            customOrder: 1,
          });
          result.forEach((item, index) => {
            item.activeStatus = false;
            if (index == 0) {
              item.flag = true;
            } else {
              item.flag = false;
            }
          });
          that.conditionObj.conditionList.carColorList = result;
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    initPlayer() {
      // const url = item.realDetail;
      if (!this.player) this.player = new Player();
      this.player.run().listen();
      // let that = this;
      // that.player = new WebSocket("wss://127.0.0.1:18001/Web_Js");
      // that.player.onopen = function() {
      //   that.player.send(
      //     JSON.stringify({
      //       comment: { commenttype: "checkapp", context: "btoolsprotocol:" }
      //     })
      //   );
      // };
      // that.player.onmessage = function(e) {
      //   const { commenttype, resultCode } = JSON.parse(e.data).comment;
      //   if (commenttype === "checkapp" && resultCode != "1") {
      //     that.$message.info(
      //       "请下载并安装平台播放器，安装完成后刷新浏览器，点击确定下载"
      //     );
      //   }
      // };
      // that.player.onclose = function() {};
    },
    // tab切换（在线结构化、离线结构化、历史任务）
    handleClickMainTabType(tab, event) {
      this.pageType.mainTabType = tab.name;
      this.structureObj.params.pageNo = 1;
      this.structureObj.params.pageSize = 20;
      if (this.pageType.mainTabType == "onlineStructured") {
        this.goStructureTabList("0");
      } else if (this.pageType.mainTabType == "offlineStructured") {
        this.goStructureTabList("1");
      } else {
        this.goStructureTabList("", "100");
      }
    },
    // 筛选-点击搜索
    handleIconClick() {
      if (!this.treeObj.params.name) {
        this.$message.warning("请输入要查询的点位", 3000);
        return;
      }
      let that = this;
      that.treeSearchLoading = true;
      that.treeObj.showTreeSearch = true;
      that.treeObj.params.parentIndexCode = "";
      rest
        .post(api.clusterAnalysis.asyncTree, that.treeObj.params)
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.treeObj.treeSearchData = res.data;
          } else {
            that.$message.error(res.msg);
          }
          that.treeSearchLoading = false;
        });
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
        .done((res) => {
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
      this.pointPositionObj.crossingIdsArr = this.$refs.tree.getCheckedNodes();
      this.setCheckedKeys();
    },
    // 获取 treeSearch 节点
    getCheckedNodes2(node) {
      let flag = true;
      for (let i = 0; i < this.pointPositionObj.crossingIdsArr.length; i++) {
        if (this.pointPositionObj.crossingIdsArr[i].id == node.id) {
          this.pointPositionObj.crossingIdsArr.splice(i, 1);
          flag = false;
        }
      }
      if (flag) {
        this.pointPositionObj.crossingIdsArr.push(node);
      }
      this.setCheckedKeys();
    },
    // 通过 key 设置选中
    setCheckedKeys() {
      let treeIds = [];
      treeIds = this.pointPositionObj.crossingIdsArr.map((item) => {
        return item.id;
      });
      // treeIds：现有的节点
      this.$refs.tree.setCheckedKeys(treeIds); //list -> tree
      this.$refs.treeSearch.setCheckedKeys(treeIds); //list -> treeSearch
    },
    // 找点位-查询
    goPointPositionSearch() {
      this.conditionObj.conditionType.pageNo = 1;
      this.conditionObj.conditionType.pageSize = 20;
      this.searchListResult.total = 0;
      this.taskObj.videoTaskId = null;
      // tree
      if (this.pointPositionObj.crossingIdsArr.length > 0) {
        let areaCode = [];
        let cameraIndexCode = [];
        this.pointPositionObj.crossingIdsArr.forEach((item) => {
          if (item.parent) {
            areaCode.push(item.id);
          } else {
            cameraIndexCode.push(item.id);
          }
        });
        this.pointPositionObj.areaCode = areaCode.join(",");
        this.pointPositionObj.cameraIndexCode = cameraIndexCode.join(",");
      } else {
        this.pointPositionObj.areaCode = "";
        this.pointPositionObj.cameraIndexCode = "";
      }
      this.allSearch();
    },
    // 设置 tree 的高
    setScrollHeight() {
      this.$nextTick(() => {
        var windowHeight = $(window).height(); // 可视区高度
        var sidebarTop = document.getElementsByClassName(
          "clueSearch-in-leftAside-tabs"
        )[0].offsetTop; //滚动元素离顶部的距离
        var scrollHeight = windowHeight - sidebarTop - 80 - 80; // 滚动高度
        $(".tree").css({ height: scrollHeight + "px" });
        $(".location_result").css({ height: scrollHeight - 140 + "px" });
        $(".structureTab").css({ height: windowHeight - 186 + "px" });
      });
    },
    // 切换车辆颜色
    changeCarColor(item, index) {
      if (index == 0) {
        this.conditionObj.conditionList.carColorList.forEach((item, index) => {
          item.flag = false;
          item.activeStatus = false;
        });
        item.flag = !item.flag;
      } else {
        this.conditionObj.conditionList.carColorList.forEach((item, index) => {
          if (index == 0) {
            item.flag = false;
            item.activeStatus = false;
          }
        });
        item.flag = !item.flag;
      }
    },
    // 分页 - 当前页
    handleCurrentChange(val) {
      this.listIsAllChecked = false;
      this.conditionObj.conditionType.pageNo = val;
      this.conditionObjSearch();
    },
    // 分页 - 每页多少条
    handleSizeChange(val) {
      this.conditionObj.conditionType.pageSize = val;
      this.conditionObj.conditionType.pageNo = 1;
      this.conditionObjSearch();
    },
    // 切换时间
    changeTime(date) {
      this.conditionObj.conditionType.startTime = date[0];
      this.conditionObj.conditionType.endTime = date[1];
    },
    // 找点位-定位搜-加入到线索管理
    async addClueManage(type, item) {
      if (!(type === "single" && item.hasAddToClue)) {
        let that = this;
        let selectList;
        if (type === "single") {
          selectList = [item];
        } else if (
          this.searchListResult &&
          this.searchListResult.list &&
          this.searchListResult.list.length
        ) {
          selectList = this.searchListResult.list.filter((item) => {
            if (item.flag) {
              return item;
            }
          });
        }
        let paramsList = selectList
          ? selectList.map((item) => {
              return {
                certificateNumber: this.pointPositionObj.certificateNumber,
                humanId: this.personInfoObj.humanId,
                rowKey: item.rowKey,
                picUrl: item.target_pic_url,
                passTime: item.createTime,
                placeAddress: item.collect_address,
                longitude: item.longitude,
                latitude: item.latitude,
                clueSource: 3,
                clueType: 1,
              };
            })
          : [];
        if (paramsList.length == 0) {
          that.$message.info("请选择线索！");
        } else {
          await rest
            .post(api.clueSearch.saveOnlineClue, paramsList)
            .done((res) => {
              if (helper.isSuccess(res)) {
                that.$message.success("添加成功! ");
                that.allSearch();
                Bus.$emit("changeClueDatas");
              } else {
                that.$message.error(res.msg);
              }
            });
        }
      } else {
        this.$message.warning("该线索已加入线索集");
      }
      if (this.obj.timer) {
        clearTimeout(this.obj.timer);
        this.obj.timer = null;
      }
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
          item.target_pic_url;
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
          "/ibody-web/index.do#personSearch",
        param: "imageUrl=" + item.target_pic_url,
        name: "以人搜人",
      });
    },
    //以脸搜脸
    faceSearchFaceHander(item) {
      const { protocol, hostname, port } = location;
      let linkParam = "faceUrl=" + item.target_pic_url;
      if (top === window) {
        let path =
          protocol +
          "//" +
          hostname +
          ":" +
          port +
          "/iface-web/index.do#snapshot?faceUrl=" +
          item.target_pic_url;
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
          "/iface-web/index.do#snapshot",
        param: linkParam,
        name: "以脸搜脸",
      });
    },
    //线索查询
    goClueSearch(item) {
      let that = this;
      if (item.longitude && item.latitude) {
        that.conditionObj.conditionType.defaultTime = [];
        let passTime = item.createTime;
        let dateTime = new Date(passTime).getTime();
        //前半小时
        let beginDateTime = new Date(dateTime - 30 * 60 * 1000);
        //后半小时
        let endDateTime = new Date(dateTime + 30 * 60 * 1000);
        that.conditionObj.conditionType.defaultTime.push(beginDateTime);
        that.conditionObj.conditionType.defaultTime.push(endDateTime);
        that.locationObj.selectCenterPoint.longitude = item.longitude;
        that.locationObj.selectCenterPoint.latitude = item.latitude;
        that.locationObj.locationType.centerPoint = item.collect_address;
      } else {
        that.$message.error("中心点位坐标为空，请手动输入!");
      }
    },
    // 定位搜-中心点-搜索
    locationChange() {
      if (this.locationObj.locationType.centerPoint.length == 0) {
        this.locationObj.selectCenterPoint = {};
      }
      this.locationDebounce(this.getLocationData, 500);
    },
    // 防抖
    locationDebounce(fn, wait) {
      if (this.fun !== null) {
        clearTimeout(this.fun);
      }
      this.fun = setTimeout(fn, wait);
    },
    // 定位搜-中心点-搜索-获取数据
    getLocationData() {
      let that = this;
      if (this.locationObj.locationType.centerPoint == "") {
        that.locationObj.locationType.isShowSearchWrap = false;
      } else {
        rest
          .post(api.clueSearch.findByCameraName, {
            name: that.locationObj.locationType.centerPoint,
          })
          .done((res) => {
            if (helper.isSuccess(res)) {
              that.locationObj.locationType.isShowSearchWrap = true;
              that.locationObj.list.centerPointList = res.data;
            } else {
              that.$message.error(res.msg);
            }
          });
      }
    },
    // 定位搜-中心点-icons 清除
    locationClearIconClick() {
      this.locationObj.locationType.centerPoint = "";
      this.locationObj.selectCenterPoint = {};
    },
    // 定位搜-中心点-选择其中一个中心点
    changeCenterPoint(item) {
      this.locationObj.locationType.centerPoint = item.name
        .replace(/<font color="red">/g, "")
        .replace(/<\/font>/g, "");
      this.locationObj.selectCenterPoint = item;
    },
    // 点击整个大盒子
    clickWrap() {
      this.locationObj.locationType.isShowSearchWrap = false;
    },
    // 定位搜-定位
    goLocation() {
      if (!this.locationObj.locationType.centerPoint) {
        this.$message.warning("请输入中心点!", 3000);
        return;
      }
      let that = this;
      this.locationObj.locationType.longitude =
        this.locationObj.selectCenterPoint.longitude;
      this.locationObj.locationType.latitude =
        this.locationObj.selectCenterPoint.latitude;
      this.locationObj.locationType.start = 1;

      rest
        .post(
          api.clueSearch.querySpatialResource,
          this.locationObj.locationType
        )
        .done((res) => {
          if (helper.isSuccess(res)) {
            let result = res.data.CAMERA.items;
            result.forEach((item) => {
              item.flag = false;
              item.activeStatus = false;
            });
            that.locationObj.list.pointResult = result;
            that.locationObj.list.total = res.data.CAMERA.totalCount;
            that.locationObj.list.totalPage = res.data.CAMERA.totalPage;
            let { longitude, latitude, distance } =
              that.locationObj.locationType;
            let locationObj = {
              centerPoint: {
                longitude: longitude,
                latitude: latitude,
                distance: distance,
              },
              list: that.locationObj.list.pointResult,
            };
            Bus.$emit(
              "locationObjToupdateTheMultipleDisplaySizeSmall",
              locationObj
            );
            Bus.$emit(
              "locationObjToupdateTheMultipleDisplaySizeLarge",
              locationObj
            );
          } else {
            that.$message.error(res.msg);
          }
        })
        .always(() => {
          if (this.obj.timer) {
            clearTimeout(this.obj.timer);
            this.obj.timer = null;
          }
        });
    },
    // 定位搜-重置
    goLocationReset() {
      this.locationObj.locationType.centerPoint = "";
      this.locationObj.locationType.distance = 1000;
      this.locationObj.selectCenterPoint = {};
    },
    // 定位搜-查询
    goLocationSearch() {
      if (!this.locationObj.locationType.centerPoint) {
        this.$message.warning("请输入中心点!", 3000);
        return;
      }
      this.conditionObj.conditionType.pageNo = 1;
      this.conditionObj.conditionType.pageSize = 20;
      this.taskObj.videoTaskId = null;
      this.searchListResult.total = 0;
      let selectList = this.locationObj.list.pointResult.filter((item) => {
        if (item.flag) {
          return item;
        }
      });
      let indexCodes = selectList.map((item) => {
        return item.indexCode;
      });
      this.locationObj.searchParams.cameraIndexCode = indexCodes.join(",");
      this.allSearch();
    },
    // 找点位、定位搜-查询
    allSearch() {
      let that = this;
      let params = {};
      that.searchListResult.list = [];
      let { filterLink, ride, vehicleType } = this.conditionObj.conditionType;
      let otherConditionJson = {
        direction: "",
        gender: "",
        glass: "",
        hairStyle: "",
        ageGroup: "",
        targetSize: "",
        jacketType: "",
        mask: "",
        bag: "",
        ride: ride,
        speed: "",
        trousersType: "",
        hat: "",
        things: "",
        vehicleType: vehicleType,
        cyclingPersonNumber: "",
        cyclingType: "",
        jacketColor: "",
        trousersColor: "",
      };
      // 分页
      let pageNo = this.conditionObj.conditionType.pageNo;
      let pageSize = this.conditionObj.conditionType.pageSize;
      if (this.taskObj.videoTaskId) {
        let startTime, endTime;
        // 开始时间、结束时间
        if (this.conditionObj.conditionType.startTime) {
          ({ startTime, endTime } = this.conditionObj.conditionType);
        } else {
          ({ startTime, endTime } = this.conditionObj.conditionType
            .defaultTime[0]
            ? {
                startTime: helper.dateFormat(
                  "YYYY-mm-dd HH:MM:SS",
                  this.conditionObj.conditionType.defaultTime[0]
                ),
                endTime: helper.dateFormat(
                  "YYYY-mm-dd HH:MM:SS",
                  this.conditionObj.conditionType.defaultTime[1]
                ),
              }
            : {
                startTime: "",
                endTime: "",
              });
        }
        let { certificateNumber } = this.taskObj;
        // 视频结构化的任务查询
        params = {
          pageNo,
          pageSize,
          startTime,
          endTime,
          filterLink,
          otherConditionJson: JSON.stringify(otherConditionJson),
          areaCode: this.pointPositionObj.areaCode,
          cameraIndexCode: this.pointPositionObj.cameraIndexCode,
        };
        if (this.disconnectPane) {
          params["videoTaskId"] = this.taskObj.videoTaskId;
        }
      } else if (this.pageType.asideTabType === "pointPosition") {
        this.getStartAndEndTime();
        // 加时区
        if (
          this.locationObj.searchParams.startTime &&
          this.locationObj.searchParams.startTime.indexOf(".000+08:00") === -1
        ) {
          this.locationObj.searchParams.startTime =
            this.locationObj.searchParams.startTime.replace(" ", "T") +
            ".000+08:00";
          this.locationObj.searchParams.endTime =
            this.locationObj.searchParams.endTime.replace(" ", "T") +
            ".000+08:00";
        }
        let { certificateNumber } = this.taskObj;
        let { startTime, endTime } = this.locationObj.searchParams;
        params = {
          cameraIndexCode: this.pointPositionObj.cameraIndexCode,
          areaCode: this.pointPositionObj.areaCode,
          endTime,
          startTime,
          otherConditionJson: JSON.stringify(otherConditionJson),
          filterLink,
          pageNo,
          pageSize,
        };
      } else if (this.pageType.asideTabType === "location") {
        // 分页
        this.locationObj.searchParams.pageNo = pageNo;
        this.locationObj.searchParams.pageSize = pageSize;
        this.getStartAndEndTime();
        let { cameraIndexCode, startTime, endTime } =
          this.locationObj.searchParams;
        params = {
          pageNo,
          pageSize,
          cameraIndexCode,
          startTime,
          endTime,
          filterLink,
          otherConditionJson: JSON.stringify(otherConditionJson),
        };
      }
      params["humanId"] = this.$route.query.idCard;
      this.imgPreviewRequestObj = params;
      if (Object.keys(params).length > 0) {
        rest
          .post(api.clueSearch.findElectricCarByParam, params)
          .done((res) => {
            if (helper.isSuccess(res)) {
              that.searchListResult.loading = false;
              that.pageType.searchStructureType = "search";
              let data = res.data;
              data.list &&
                data.list.forEach((item) => {
                  item.flag = false;
                  item.activeStatus = false;
                });
              that.searchListResult = data;
            } else {
              that.$message.error(res.msg);
            }
          })
          .always(() => {
            if (this.obj.timer) {
              clearTimeout(this.obj.timer);
              this.obj.timer = null;
            }
          });
      }
    },
    scrollFetchPositionSearch(e) {
      if (this.scrollTimer) {
        return;
      }
      if (
        e.srcElement.scrollTop + e.srcElement.offsetHeight >
        e.srcElement.scrollHeight - 100
      ) {
        this.locationObj.locationType.start++;
        if (
          this.locationObj.locationType.start > this.locationObj.list.totalPage
        ) {
          this.locationObj.locationType.start--;
          return;
        }
        this.scrollTimer = true;
        rest
          .post(
            api.clueSearch.querySpatialResource,
            this.locationObj.locationType
          )
          .done((res) => {
            if (helper.isSuccess(res)) {
              let result = res.data.CAMERA.items;
              result.forEach((item) => {
                item.flag = false;
                item.activeStatus = false;
              });
              this.$set(
                this.locationObj.list,
                "pointResult",
                this.locationObj.list.pointResult.concat(result)
              );
              this.scrollTimer = false;
            } else {
              this.scrollTimer = false;
              this.$message.error(res.msg);
            }
          });
      }
    },
    // 筛选条件-查询
    conditionObjSearch() {
      this.conditionObj.conditionType.showSearchCondition = false;
      this.allSearch();
    },
    // 筛选条件-重置
    conditionObjReset() {
      this.conditionObj.conditionList.carColorList.forEach((item, index) => {
        if (index == 0) {
          item.flag = true;
        } else {
          item.flag = false;
        }
      });
      this.conditionObj.conditionType = this.conditionObj.resetConditionType;
    },
    // 结构化弹框-确定
    submitFormStructure(formName) {
      if (
        new Date(this.structureDialogObj.beginTime) >
        new Date(this.structureDialogObj.endTime)
      ) {
        this.$message.warning("开始时间不应大于结束时间！", 3000);
        return;
      }
      this.$refs[formName].validate((valid, invalidFields) => {
        if (valid) {
          this.goStructureParams();
        } else {
          this.$refs[formName].focusFirstField();
          return false;
        }
      });
    },
    // 结构化弹框-重置
    resetFormStructure(formName) {
      this.$refs[formName].resetFields();
    },
    //全选复选框
    checkAllPoint() {
      let _flag = this.allChecked;
      this.locationObj.list.pointResult.forEach((item, index) => {
        if (_flag) {
          item.flag = true;
        } else {
          item.flag = false;
        }
      });
      this.changeLocationFlag();
    },
    //视频预览功能
    async videoPreview(type, item) {
      //PlayReal
      //this.$message.info("敬请期待，功能正在开发中...");
      let that = this;
      let tempParams = {};
      let params = {};
      let indexCodes = [item.indexCode];
      if (!indexCodes || indexCodes.length === 0) {
        that.$message.warning("请选择要播放视频的点位");
        return;
      }
      if (indexCodes.length > 9) {
        that.$message.warning("最多只可同时播放9个点位视频");
      }
      await rest.post(api.clueSearch.token, tempParams).done((res) => {
        if (helper.isSuccess(res)) {
          params = {
            sg: res.data.playerToken,
            CenterUrl: res.data.pluginIpPort + "/portal",
            NginxIp: res.data.nginxIp,
            NginxPort: res.data.nginxPort,
            UserID: res.data.userId,
          };
          if (params) {
            let wndCount = 1;
            // if (indexCodes.length == 1) wndCount = 1;
            // else if (indexCodes.length > 1 ) wndCount = 4;
            // else if (indexCodes.length > 4) wndCount = 9;

            let cmd = `btoolsprotocol://${
              params.CenterUrl
            };Toollist:PROT_btoolpplayerprotocol;CmdLine:btoolpplayerprotocol://ReqType:${type};VersionTag:UNIV1.0;language:zh_CN;clear:2;WndCount:${wndCount};NginxIp:${
              params.NginxIp
            };NginxPort:${params.NginxPort};UserID:${params.UserID};sg:${
              params.sg
            };CamList:${indexCodes.join(
              ","
            )};protocol:https;appType:ipoint;archiveCode:;`;
            if (that.player && that.player.socket) {
              that.player.socket.send(
                JSON.stringify({
                  comment: {
                    commenttype: "startapp",
                    context: "btoolsprotocol:",
                    commentcmd: cmd,
                  },
                })
              );
            } else {
              that.$message.error("播放视频出错");
            }
          } else {
            // error("播放视频出错")
            that.$message.error("播放视频出错");
          }
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    //选中单个监控点位进行视频结构化
    signVideoStructure(item) {
      this.allChecked = false;
      this.locationObj.list.pointResult.forEach((item, index) => {
        item.flag = false;
      });
      item.flag = true;
      this.structureDialogObj.structureDialog = true;
      this.structureDialogObj.taskName = item.name;
    },
    // 结构化-整理参数
    goStructureParams() {
      if (this.pageType.asideTabType == "pointPosition") {
        // tree
        if (this.pointPositionObj.crossingIdsArr.length > 0) {
          var areaCodeArr = [];
          var areaCode = [];
          var cameraIndexCodeArr = [];
          var cameraIndexCode = [];
          this.pointPositionObj.crossingIdsArr.sort().forEach((item, index) => {
            this.pointPositionObj.crossingIdsArr.forEach((itemIn, indexIn) => {
              if (item.id == itemIn.orgIndexCode) {
                this.pointPositionObj.crossingIdsArr[indexIn].flag = true;
              }
            });
          });
          this.pointPositionObj.crossingIdsArr.forEach((item) => {
            if (item.parent && !item.flag) {
              areaCodeArr.push(item);
            } else if (!item.parent && !item.flag) {
              cameraIndexCodeArr.push(item);
            }
          });
          areaCode = areaCodeArr.map((item) => {
            return item.id;
          });
          cameraIndexCode = cameraIndexCodeArr.map((item) => {
            return item.id;
          });
          if (cameraIndexCode.length > 20) {
            this.$message.info("结构化任务，视频点位不能超过20个");
            return false;
          }
          this.pointPositionObj.areaCode = areaCode.join(",");
          this.pointPositionObj.cameraIndexCode = cameraIndexCode.join(",");
        }
        this.pointPositionObj.humanId = this.personInfoObj.humanId;
        this.pointPositionObj = {
          ...this.pointPositionObj,
          ...this.structureDialogObj,
        };
        this.goStructureList(this.pointPositionObj);
      } else if (this.pageType.asideTabType == "location") {
        let selectList = this.locationObj.list.pointResult.filter((item) => {
          if (item.flag) {
            return item;
          }
        });
        let indexCodes = selectList.map((item) => {
          return item.indexCode;
        });
        if (indexCodes.length > 20) {
          this.$message.info("结构化任务，视频点位不能超过20个");
          return false;
        }
        this.locationObj.searchParams.cameraIndexCode = indexCodes.join(",");
        this.locationObj.searchParams.humanId = this.personInfoObj.humanId;
        this.locationObj.searchParams = {
          ...this.locationObj.searchParams,
          ...this.structureDialogObj,
        };
        this.goStructureList(this.locationObj.searchParams);
      }
    },
    // 结构化-成功
    goStructureList(params) {
      let that = this;
      rest.post(api.clueSearch.videoOnlineTask, params).done((res) => {
        if (helper.isSuccess(res)) {
          that.structureDialogObj.structureDialog = false;
          that.pageType.searchStructureType = "structure";
          that.pageType.mainTabType = "onlineStructured";
          that.goStructureTabList("0");
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    // tab 表格选中哪几行
    handleSelectionChange(selection) {
      this.structureObj.taskCheckedList = selection;
    },
    // 结构化 tab 分页
    handleSizeChangeStructure(val) {
      this.structureObj.params.pageNo = 1;
      this.structureObj.params.pageSize = val;
      if (this.pageType.mainTabType == "onlineStructured") {
        this.goStructureTabList("0");
      } else if (this.pageType.mainTabType == "offlineStructured") {
        this.goStructureTabList("1");
      } else {
        this.goStructureTabList("", "100");
      }
    },
    handleCurrentChangeStructure(val) {
      this.structureObj.params.pageNo = val;
      if (this.pageType.mainTabType == "onlineStructured") {
        this.goStructureTabList("0");
      } else if (this.pageType.mainTabType == "offlineStructured") {
        this.goStructureTabList("1");
      } else {
        this.goStructureTabList("", "100");
      }
    },
    // 获取结构化 tab 的列表数据
    goStructureTabList(taskType, taskProcess) {
      let that = this;
      let params = {};
      this.structureObj.loading = true;
      params = {
        ...this.structureObj.params,
        ...{
          taskType: taskType || "",
          taskProcess: taskProcess || "",
          humanId: this.personInfoObj.humanId,
        },
      };
      rest.post(api.clueSearch.findTaskWithPage, params).done((res) => {
        if (helper.isSuccess(res)) {
          that.structureObj.structureData.list = res.data.content;
          that.structureObj.structureData.total = res.data.total;
          that.structureObj.loading = false;
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    // 打开上传视频工具
    openUploadVideo() {
      if (!this.helper) this.helper = new Helper();
      let that = this;
      rest
        .get(api.clueSearch.vidUrl)
        .done((res) => {
          if (res.type == 0) {
            that.helper.run(res.data.url).listen((comment) => {
              if (comment.commenttype === "FilePathType") {
                const filePath = comment.context
                  .split(":")[2]
                  .split(",")
                  .slice(0, -1)
                  .join(",");
                rest
                  .post(api.clueSearch.vidConfig, {
                    fileName: filePath,
                  })
                  .done((res) => {
                    if (res.type == 0) {
                      that.helper.run(res.data.url).listen((comment) => {
                        if (comment.commenttype === "btoolupload") {
                          // 获取视频结构化返回参数
                          rest
                            .get(api.clueSearch.getVideoParsingParams)
                            .done((res) => {
                              //离线视频上传成功，获取对应的视频文件ID
                              if (helper.isSuccess(res) && res.data.id) {
                                that.videoStructureObj.push(res.data.id);
                              }
                            });
                        }
                      });
                    }
                  });
              }
            });
          }
        })
        .always(() => {
          if (this.obj.timer) {
            clearTimeout(this.obj.timer);
            this.obj.timer = null;
          }
        });
    },
    // 视频结构化-开始分析
    videoAnalysis() {
      let that = this;
      let params = {
        ids: this.videoStructureObj,
        humanId: this.personInfoObj.humanId,
      };
      rest.post(api.clueSearch.offlineTask, params).done((res) => {
        if (helper.isSuccess(res)) {
          that.pageType.searchStructureType = "structure";
          that.pageType.mainTabType = "offlineStructured";
          that.goStructureTabList("1");
          that.videoStructureObj = [];
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    // 视频结构化-删除上传的视频
    deleteUploadVideo(index) {
      this.videoStructureObj.splice(index, 1);
    },
    // 结构化任务-刷新
    async taskRefresh() {
      let that = this;
      that.structureObj.params.pageNo = 1;
      that.structureObj.params.pageSize = 20;
      // 任务刷新接口
      await rest
        .get(api.clueSearch.updateTaskStatus, {
          humanId: that.personInfoObj.humanId,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            if (that.pageType.mainTabType == "onlineStructured") {
              that.goStructureTabList("0");
            } else if (that.pageType.mainTabType == "offlineStructured") {
              that.goStructureTabList("1");
            } else {
              that.goStructureTabList("", "100");
            }
          } else {
            that.$message.error(res.msg);
          }
        });
      if (this.obj.timer) {
        clearTimeout(this.obj.timer);
        this.obj.timer = null;
      }
    },
    // 任务结构化-删除
    deletTask(data, type) {
      let that = this;
      let params = [];
      if (type == "single") {
        params.push({ taskId: data.taskId });
      } else {
        this.structureObj.taskCheckedList.forEach((item) => {
          params.push({ taskId: item.taskId });
        });
      }
      rest.post(api.clueSearch.batchDelete, params).done((res) => {
        if (helper.isSuccess(res)) {
          if (that.pageType.mainTabType == "onlineStructured") {
            that.goStructureTabList("0");
          } else if (that.pageType.mainTabType == "offlineStructured") {
            that.goStructureTabList("1");
          } else {
            that.goStructureTabList("", "100");
          }
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    // 任务结构化任务-查看
    seeTask(row) {
      this.conditionObj.conditionType.pageNo = 1;
      this.conditionObj.conditionType.pageSize = 20;
      let that = this;
      that.searchListResult.loading = true;
      let { filterLink, ride, vehicleType } = this.conditionObj.conditionType;
      let otherConditionJson = {
        direction: "",
        gender: "",
        glass: "",
        hairStyle: "",
        ageGroup: "",
        targetSize: "",
        jacketType: "",
        mask: "",
        bag: "",
        ride: ride,
        speed: "",
        trousersType: "",
        hat: "",
        things: "",
        vehicleType: vehicleType,
        cyclingPersonNumber: "",
        cyclingType: "",
        jacketColor: "",
        trousersColor: "",
      };
      this.taskObj.videoTaskId = row.taskId;
      this.conditionObj.conditionType.startTime = row.recordStartTime;
      this.conditionObj.conditionType.endTime = row.recordEndTime;
      if (!row.recordStartTime) {
        this.conditionObj.conditionType.defaultTime = [];
      } else {
        this.conditionObj.conditionType.defaultTime = [
          new Date(this.conditionObj.conditionType.startTime),
          new Date(this.conditionObj.conditionType.endTime),
        ];
      }
      this.pointPositionObj.cameraIndexCode = row.cameraIndexCode;
      let params = {
        pageNo: this.conditionObj.conditionType.pageNo,
        pageSize: this.conditionObj.conditionType.pageSize,
        humanId: this.$route.query.idCard,
        filterLink: filterLink,
        otherConditionJson: JSON.stringify(otherConditionJson),
        startTime: row.recordStartTime,
        endTime: row.recordEndTime,
        cameraIndexCode: row.cameraIndexCode,
      };
      if (row.taskType === "1") {
        params["videoTaskId"] = row.taskId;
        this.disconnectPane = true;
      } else {
        this.disconnectPane = false;
      }
      rest.post(api.clueSearch.findElectricCarByParam, params).done((res) => {
        if (helper.isSuccess(res)) {
          that.searchListResult.loading = false;
          that.pageType.searchStructureType = "search";
          let data = res.data;
          data.list.forEach((item) => {
            item.flag = false;
            item.activeStatus = false;
          });
          that.searchListResult = data;
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    // 大图预览
    showImgPreview(list, index) {
      let result = list;
      result.forEach((item) => {
        item.url = item.target_pic_url;
        item.certificateNumber = this.$route.query.idCard;
        item.humanId = this.personInfoObj.humanId;
      });
      this.$refs.cHImgPreview.imgPreviewShow(
        result,
        index,
        "clueSearch",
        api.clueSearch.findElectricCarByParam,
        this.imgPreviewRequestObj
      );
    },
    // 子组件保存数据时，及时的更新父组件
    updateList() {
      this.allSearch();
    },
    // 切换—筛选条件—关联结果
    changeConditionObjFilterLink(type) {
      this.conditionObj.conditionType.filterLink = type;
    },
    // 切换—筛选条件—骑车
    changeConditionObjRide(type) {
      this.conditionObj.conditionType.ride = type;
    },
    // 切换—筛选条件—车辆类型
    changeConditionObjVehicleType(type) {
      this.conditionObj.conditionType.vehicleType = type;
    },
    // 切换—定位搜结果
    changeLocationFlag() {
      let { longitude, latitude, distance } = this.locationObj.locationType;
      let locationObj = {
        centerPoint: {
          longitude: longitude,
          latitude: latitude,
          distance: distance,
        },
        list: this.locationObj.list.pointResult,
      };
      Bus.$emit("locationObjToupdateTheMultipleDisplaySizeSmall", locationObj);
      Bus.$emit("locationObjToupdateTheMultipleDisplaySizeLarge", locationObj);
    },
    // 展示大地图
    showLargeMap() {
      this.isShowLargeMap = true;
    },
    // 列表全选
    listAllChecked() {
      if (this.listIsAllChecked) {
        this.searchListResult.list.forEach((item) => {
          if (item.hasAddToClue === 0) {
            item.flag = true;
          }
        });
      } else {
        this.searchListResult.list.forEach((item) => {
          item.flag = false;
        });
      }
    },
    // 查看历史任务
    async seeHistoryTask() {
      this.pageType.searchStructureType = "structure";
      this.pageType.mainTabType = "historicalTasks";
      await this.taskRefresh();
    },
    // 图片放大框关闭后执行的回调
    handleClosePreview(index) {
      let temp = index - 0 - Math.floor((index - 0) / 20) * 20; //只要这个数除去n个20后小于20的部分
      this.searchListResult.list[temp].activeStatus = true;
    },
    goToOnePage(pageNo) {
      //让父组件进入放大图片组件所在页数
      if (this.conditionObj.conditionType.pageNo !== pageNo) {
        this.conditionObj.conditionType.pageNo = pageNo;
      }
    },
    getIcon(gender) {
      return gender === "male" ? maleIcon : femaleIcon;
    },
    goStructureFind(type) {
      if (this.pointPositionObj.crossingIdsArr.length > 0) {
        let areaCode = [];
        let cameraIndexCode = [];
        this.pointPositionObj.crossingIdsArr.forEach((item) => {
          (item.cameraType === "0" && cameraIndexCode.push(item.id)) ||
            areaCode.push(item.id);
        });
        this.pointPositionObj.areaCode = areaCode.join(",");
        this.pointPositionObj.cameraIndexCode = cameraIndexCode.join(",");
      } else {
        this.pointPositionObj.areaCode = "";
        this.pointPositionObj.cameraIndexCode = "";
      }
      if (type === "position" && !this.locationObj.locationType.centerPoint) {
        this.$message.warning("中心点信息为空，请输入中心点!", 3000);
        return;
      } else if (
        type === "point" &&
        this.pointPositionObj.areaCode === "" &&
        this.pointPositionObj.cameraIndexCode === ""
      ) {
        this.$message.warning("未选择点位，请选择", 3000);
        return;
      }
      this.structureDialogObj.structureDialog = true;
    },
    getStartAndEndTime() {
      // 开始时间、结束时间
      if (this.conditionObj.conditionType.startTime) {
        this.locationObj.searchParams.startTime =
          this.conditionObj.conditionType.startTime;
        this.locationObj.searchParams.endTime =
          this.conditionObj.conditionType.endTime;
      } else {
        if (this.conditionObj.conditionType.defaultTime[0]) {
          this.locationObj.searchParams.startTime = helper.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            this.conditionObj.conditionType.defaultTime[0]
          );
          this.locationObj.searchParams.endTime = helper.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            this.conditionObj.conditionType.defaultTime[1]
          );
        } else {
          this.locationObj.searchParams.startTime = "";
          this.locationObj.searchParams.endTime = "";
        }
      }
      return {
        startTime: this.locationObj.searchParams.startTime,
        endTime: this.locationObj.searchParams.endTime,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.clueSearch {
  .clueSearch-in {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .clueSearch-in-leftAside {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      .clueSearch-in-leftAside-header {
        display: flex;
        .img_box {
          flex: 0 0 120px;
          height: 120px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .word_box {
          flex: 1;
          p {
            //width:calc(100% - 60px);
            word-wrap: break-word;
          }
        }
      }
      .clueSearch-in-leftAside-tabs {
        ::v-deep .el-tabs__nav {
          width: 100%;
          text-align: center;
          > div {
            padding: 0;
            width: 33%;
            font-size: 14px;
          }
        }
        ::v-deep .el-tabs__content {
          overflow: visible;
          padding: 8px 0;
        }
        .clueSearch-in-leftAside-tabs-location {
          ::v-deep input {
            line-height: 32px;
            height: 32px;
            font-size: 12px;
            padding-left: 5px;
          }
          ::v-deep .el-input__icon {
            line-height: 31px;
          }
          button {
            font-size: 12px;
            width: 100%;
            line-height: 30px;
            height: 30px;
          }
          .clueSearch-in-leftAside-tabs-location-centerPoint {
            position: absolute;
            width: 100%;
            max-height: 200px;
            background: #fff;
            border: 1px solid #ccc;
            z-index: 2;
            padding: 10px 0;
            li {
              padding: 0 10px;
              height: 30px;
              line-height: 30px;
              cursor: pointer;
              width: 100%;
              p {
                width: 100%;
              }
              &:hover {
                background: #f2f2f2;
              }
            }
          }
          .location_result {
            ul {
              li {
                position: relative;
                font-size: 12px;
                width: 100%;
                .location_result_checkbox {
                  overflow: visible;
                  ::v-deep .el-checkbox__input {
                    position: absolute;
                    top: -4px;
                    left: 0;
                  }
                  ::v-deep .el-checkbox__label {
                    overflow: visible;
                  }
                  p {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 180px;
                  }
                }
                .location_result_checkbox-icon {
                  position: absolute;
                  top: 0;
                  right: 0;
                  font-size: 22px;
                }
              }
            }
          }
        }
        .clueSearch-in-leftAside-tabs-videoStructure {
          .clueSearch-in-leftAside-tabs-videoStructure-list {
            .clueSearch-in-leftAside-tabs-videoStructure-list-bdWrap {
              height: 77px;
              img {
                width: 100%;
                height: 77px;
              }
              .clueSearch-in-leftAside-tabs-videoStructure-list-bdWrap-close {
                position: absolute;
                top: -12px;
                right: -8px;
              }
            }
          }
        }
      }
      .bottom {
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
          max-width: 100%;
        }
        ::v-deep .el-input__inner {
          font-size: 12px;
        }
      }
    }
    .clueSearch-in-main {
      .clueSearch-in-main-header {
        .clueSearch-in-main-header-condition {
          span {
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
          .iconfont {
            cursor: pointer;
          }
        }
        .clueSearch-in-main-header-conditionWrap {
          background: #fafafa;
          position: absolute;
          top: 50px;
          z-index: 5;
          .clueSearch-in-main-header-conditionWrap-in {
            display: flex;
            h4 {
              flex: 0 0 50px;
              line-height: 24px;
            }
            ul {
              li {
                padding: 4px 10px;
                margin: 0 5px 5px;
                border-radius: 2px;
                min-width: 44px;
                text-align: center;
                i {
                  width: 12px;
                  height: 12px;
                  display: inline-block;
                  border: 1px solid #ccc;
                  margin-right: 5px;
                  position: relative;
                  top: 1px;
                }
              }
              li.active {
                background: #2080f7;
                color: #fff;
              }
            }
            .clueSearch-in-main-header-conditionWrap-in-vehicleType {
              cursor: not-allowed;
              opacity: 0.5;
              li {
                pointer-events: none;
                background: #e2e2e2;
              }
            }
          }
        }
      }
      .clueSearch-in-main-content {
        .clueSearch-in-main-content-loading {
          ::v-deep > div {
            width: 100%;
            height: 100%;
          }
        }
        .clueSearch-in-main-content-item {
          height: 283px;
          width: 224px;
          margin: 0 8px 16px;
          display: inline-block;
          float: left;
          .clueSearch-in-main-content-item-bdWrap {
            height: 283px;
            width: 224px;
            .clueSearch-in-main-content-item-bdWrap-con {
              border: 1px solid #ccc;
              height: 283px;
              transition: 0.4s;
              background: #fff;
              overflow: hidden;
              .clueSearch-in-main-content-item-bdWrap-con-info {
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
              .clueSearch-in-main-content-item-bdWrap-con-hookWrap {
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
              .clueSearch-in-main-content-item-bdWrap-con-alreadyAdd {
                position: absolute;
                top: 0;
                left: 0;
                background: #f3c486;
                border-radius: 0 10px 10px 0;
                padding: 0 8px;
                display: inline-block;
                color: #000;
              }
            }
            &.active {
              position: relative;
              z-index: 2;
              .clueSearch-in-main-content-item-bdWrap-con {
                height: 341px;
                border: 1px solid #2080f7;
                box-shadow: 2px 2px 10px 2px #999;
                .clueSearch-in-main-content-item-bdWrap-con-hookWrap {
                  .hook1 {
                    display: none;
                  }
                  .hook2 {
                    display: block;
                  }
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
    .clusterAnalysis_in_manage {
      position: relative;
      .clusterAnalysis_in_manage_map {
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
}
@media screen and (max-width: 2500px) {
  .clueSearch {
    .clueSearch-in-main-content-itemWrap {
      width: 1445px;
    }
  }
}
@media screen and (max-width: 2000px) {
  .clueSearch {
    .clueSearch-in-main-content-itemWrap {
      width: 1205px;
    }
  }
}
@media screen and (max-width: 1850px) {
  .clueSearch {
    .clueSearch-in-main-content-itemWrap {
      width: 965px;
    }
  }
}
@media screen and (max-width: 1500px) {
  .clueSearch {
    .clueSearch-in-main-content-itemWrap {
      width: 725px;
    }
  }
}
@media screen and (max-width: 1200px) {
  .clueSearch {
    .clueSearch-in-main-content-itemWrap {
      width: 485px;
    }
  }
}
@media screen and (max-width: 1100px) {
  .clueSearch {
    .clueSearch-in-main-content-itemWrap {
      width: 485px;
    }
  }
}
.card-buttons {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  & > div {
    cursor: pointer;
    height: 30px;
    padding: 5px;
    color: #4d4d4d;
    font-size: 14px;
    display: flex;
    align-items: center;
    & > img {
      margin-right: 5px;
    }
    & > i {
      width: 16px;
      margin-left: -5px;
      margin-right: 10px;
    }
    &:hover {
      background: rgba(150, 141, 141, 0.5);
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
