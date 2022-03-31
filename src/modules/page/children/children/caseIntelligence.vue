<template>
  <div class="caseIntelligence" @click="clickWrap()">
    <h-layout style="height: 100%">
      <h-layout-aside width="290px" class="caseIntelligence-aside br_ccc">
        <div class="caseIntelligence-aside-header bb_ccc pt10 pr10 pb10 pl10">
          <div class="caseIntelligence-aside-header-imgWrap">
            <img
              :src="personInfoObj.picUrl"
              class="wh100"
              v-if="personInfoObj.picUrl"
            />
            <template v-else>
              <img
                src="../../../../assets/images/personList/head_sex_01.png"
                class="wh100"
                v-if="personInfoObj.gender === 'male'"
              />
              <img
                src="../../../../assets/images/personList/head_sex_02.png"
                class="wh100"
                v-else
              />
            </template>
          </div>
          <div class="caseIntelligence-aside-header-wordWrap fs14 pl5">
            <h2 class="fs16 color_333 mb2">
              {{ personInfoObj.name || "未知姓名" }}
            </h2>
            <p class="mb2">
              <img
                :src="getIcon(personInfoObj.gender)"
                v-if="
                  personInfoObj.gender === 'female' ||
                  personInfoObj.gender === 'male'
                "
              />
              {{
                (personInfoObj.age && personInfoObj.age + "岁") || "未知年龄"
              }}
            </p>
            <p class="mb2">{{ personInfoObj.idCard }}</p>
            <p>{{ personInfoObj.censusRegister || "未知地点" }}</p>
          </div>
        </div>
        <div class="caseIntelligence-aside-footer pl10 pr10">
          <el-row
            class="caseIntelligence-aside-footer-header pt10"
            style="border-bottom: #cccccc"
          >
            <el-col :span="14">
              <h2 class="fs14 color_333 fw_n lh36">
                <!-- <img
                  src="../../../../assets/images/researchReport/title_icon_02.png"
                  alt=""
                />-->
                <div
                  class="caseIntelligence-aside-footer-header-title por fw_6"
                  style="top: -6px"
                >
                  线索信息
                </div>
              </h2>
            </el-col>
            <!-- <el-col :span="10" class="right txt_r lh36 pt1">
              <span
                class="caseIntelligence-aside-footer-header-btn br1 color_fff dib fs14 cup"
              >
                {{ clueInfoObj.archiveCode ? "已关联" : "未关联" }}
              </span>
            </el-col>-->
          </el-row>
          <img
            :src="clueInfoObj.picUrl"
            alt="图片错误"
            class="caseIntelligence-aside-footer-img w100 bd_f2f2f2"
            v-if="clueInfoObj.clueType == '1'"
          />
          <div class="caseIntelligence-aside-footer-wordWrap fs14">
            <p>
              <i>时间</i>
              {{ clueInfoObj.passTime ? clueInfoObj.passTime : "暂无抓拍时间" }}
            </p>
            <p>
              <i>地点</i>
              {{
                clueInfoObj.placeAddress
                  ? clueInfoObj.placeAddress
                  : "暂无抓拍地点"
              }}
            </p>
            <p>
              <i>标签</i>
              {{ "一人多骑" }}
            </p>
            <p>
              <i style="vertical-align: top">关联</i>
              <span style="display: inline-block">
                {{ clueInfoObj.archiveCode ? "已关联" : "未关联" }}
                <br />
                {{ clueInfoObj.archiveCode || "" }}</span
              >
            </p>
          </div>
        </div>
      </h-layout-aside>
      <h-layout>
        <h-layout-content class="caseIntelligence-content">
          <el-tabs v-model="tabType" @tab-click="changeTabType">
            <el-tab-pane
              label="地图检索"
              name="map"
              class="
                caseIntelligence-content-common caseIntelligence-content-map
              "
            ></el-tab-pane>
            <el-tab-pane
              label="信息检索"
              name="info"
              class="caseIntelligence-content-common"
            ></el-tab-pane>
          </el-tabs>
          <div
            class="caseIntelligence-content-common"
            v-if="tabType === 'info'"
          >
            <el-row
              class="fs14 pt10 pb10"
              style="height: 102px; border-bottom: 1px solid #ccc"
            >
              <el-col :span="19">
                <el-row style="margin-top: 8px">
                  <el-col :span="8" class="pl10 pr10">
                    <p class="pb5">案件所属部门</p>
                    <tree-select
                      ref="treeSelect"
                      v-model="infoObj.type.areasArr"
                      clearable
                      multiple
                      collapse-tags
                      node-key="indexCode"
                      parent-key="parentIndexCode"
                      simple-data
                      :tree-data="infoObj.list.areaList"
                      :display-labels="createDepartmentsLabels"
                      lazy
                      :load="loadNode"
                      :props="{
                        label: 'name',
                        isLeaf: 'leaf',
                      }"
                      placeholder="全部"
                    />
                    <!--<el-select
                      v-model="infoObj.type.areasArr"
                      multiple
                      collapse-tags
                      placeholder="请选择区域"
                    >
                      <el-option
                        v-for="item in infoObj.list.areaList"
                        :key="item.dataValue"
                        :label="item.name"
                        :value="item.dataValue"
                      ></el-option>
                    </el-select>-->
                  </el-col>
                  <el-col :span="8" class="pl10 pr10">
                    <p class="pb5">案发时段</p>
                    <el-date-picker
                      v-model="infoObj.type.caseTime"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                    />
                  </el-col>
                  <el-col :span="8" class="pl10 pr10">
                    <p class="pb5">关键词</p>
                    <el-input
                      placeholder="请输入关键词"
                      v-model="infoObj.type.keyWords"
                      clearable
                    ></el-input>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="5" class="btn_box pl10 pr10 pt25">
                <el-row style="margin-top: 8px">
                  <el-col :span="12" class="pr5">
                    <el-button
                      type="primary"
                      @click="throttle(obj, searchInfoList, 1000)()"
                      >查询</el-button
                    >
                  </el-col>
                  <el-col :span="12" class="pl5">
                    <el-button @click="resetInfoType()">重置</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div
              class="caseIntelligence-content-common-scrollWrap scroll-bar-wrap"
            >
              <el-row
                v-loading="loadingInfo"
                class="scroll-bar fs14 pl10 pr10 pt10"
                v-if="
                  loadingInfo ||
                  (infoSearchResult.list && infoSearchResult.list.length > 0)
                "
              >
                <el-col
                  :span="12"
                  class="pl10 pr10 mb10"
                  v-for="item in infoSearchResult.list"
                  :key="item.code"
                >
                  <div
                    class="
                      caseIntelligence-content-common-scrollWrap-item
                      bd_f2f2f2
                      pt20
                      pb10
                      por
                    "
                    style="height: 180px"
                  >
                    <el-row class="mb10">
                      <el-col :span="5" class="txt_r">
                        <!-- <img
                          src="../../../../assets/images/caseIntelligence/caseIntelligence-con-icon-01.png"
                        />-->
                        案件编号
                      </el-col>
                      <el-col :span="16" class="pl20">{{ item.code }}</el-col>
                    </el-row>
                    <el-row class="mb10">
                      <el-col :span="5" class="txt_r">
                        <!-- <img
                            src="../../../../assets/images/caseIntelligence/caseIntelligence-con-icon-01.png"
                          />-->
                        案件名称
                      </el-col>
                      <el-col
                        :span="14"
                        class="
                          caseIntelligence-content-common-scrollWrap-item-details
                          pl20
                        "
                        :title="item.name"
                        >{{ item.name }}</el-col
                      >
                    </el-row>
                    <el-row class="mb10">
                      <el-col :span="5" class="txt_r por">
                        <!-- <i
                          class="h-icon-clock fs24 poa"
                          style="top:-2px; right:57px;"
                        ></i>-->
                        案件时间
                      </el-col>
                      <el-col :span="14" class="pl20">{{
                        item.happenTime
                      }}</el-col>
                    </el-row>
                    <el-row class="mb10">
                      <el-col :span="5" class="txt_r">
                        <!-- <img
                          src="../../../../assets/images/caseIntelligence/caseIntelligence-con-icon-03.png"
                        />-->
                        案件地点
                      </el-col>
                      <el-col :span="14" class="pl20">
                        <p
                          class="
                            caseIntelligence-content-common-scrollWrap-item-details
                          "
                          :title="item.happenPlace"
                        >
                          {{ item.happenPlace }}
                        </p>
                      </el-col>
                    </el-row>
                    <el-row class="mb10">
                      <el-col :span="5" class="txt_r">
                        <!-- <img
                          src="../../../../assets/images/caseIntelligence/caseIntelligence-con-icon-04.png"
                        />-->
                        简要案情
                      </el-col>
                      <el-col :span="14" class="pl20">
                        <p
                          class="
                            caseIntelligence-content-common-scrollWrap-item-details
                          "
                          :title="item.detail"
                        >
                          {{ item.detail }}
                        </p>
                      </el-col>
                    </el-row>
                    <i
                      class="
                        caseIntelligence-content-common-scrollWrap-item-line
                      "
                    ></i>
                    <div
                      class="
                        caseIntelligence-content-common-scrollWrap-item-relationCase
                        txt_c
                        cup
                      "
                      @click="relationCase(item)"
                    >
                      <i
                        v-show="clickCaseCode !== item.code"
                        class="h-icon-associate fs36"
                        :style="
                          clueInfoObj.archiveCode === item.code
                            ? 'color: #2080f7;'
                            : ''
                        "
                      ></i>
                      <el-load-icon
                        v-show="clickCaseCode === item.code"
                        class="fs36"
                      ></el-load-icon>
                      <p
                        :style="
                          clueInfoObj.archiveCode === item.code
                            ? 'color: #2080f7;'
                            : ''
                        "
                      >
                        {{
                          clueInfoObj.archiveCode === item.code
                            ? "已关联"
                            : "关联案件"
                        }}
                      </p>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <h-empty v-show="!loadingInfo" v-else />
            </div>
            <el-pagination
              class="pl10 pr10 bt_ccc"
              @size-change="handleSizeChangeInfo"
              @current-change="handleCurrentChangeInfo"
              :current-page="infoObj.type.pageNo"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="infoObj.type.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="infoSearchResult.total"
            ></el-pagination>
          </div>
          <div
            class="caseIntelligence-content-common caseIntelligence-content-map"
            :style="{ height: tabType == 'map' ? 'auto' : 0 }"
          >
            <el-row
              class="caseIntelligence-content-map-form fs14 pt10 pb10"
              style="height: 102px; border-bottom: 1px solid #ccc"
            >
              <el-col :span="19">
                <el-row style="margin-top: 8px">
                  <el-col :span="8" class="pl10 pr10">
                    <p class="pb5">中心点</p>
                    <div class="por">
                      <el-input
                        class="el-input--width"
                        placeholder="请输入"
                        v-model="mapObj.centerPointObj.type.centerPoint"
                        clearable
                        @change="locationChange"
                        :clear-icon-click="locationClearIconClick"
                        style="width: 100%"
                      ></el-input>
                      <div
                        class="
                          caseIntelligence-content-map-form-centerPoint
                          scroll-bar-wrap
                        "
                        v-if="mapObj.centerPointObj.type.isShowSearchWrap"
                      >
                        <ul class="scroll-bar">
                          <li
                            v-for="item in mapObj.centerPointObj.list
                              .centerPointList"
                            :key="item.indexCode"
                            @click="changeCenterPoint(item)"
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
                  </el-col>
                  <el-col :span="8" class="pl10 pr10">
                    <p class="pb5">搜索范围(米)</p>
                    <el-input
                      placeholder="请输入范围(米)"
                      v-model="mapObj.searchParams.distance"
                      clearable
                      :class="inputErr ? 'err-input' : ''"
                    ></el-input>
                    <div v-if="inputErr" style="color: red">
                      {{ inputErrDiscription }}
                    </div>
                  </el-col>
                  <el-col :span="8" class="pl10 pr10">
                    <p class="pb5">案发时段</p>
                    <el-date-picker
                      v-model="mapObj.searchParams.caseTime"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                    />
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="5" class="btn_box pl10 pr10 pt25">
                <el-row style="margin-top: 8px">
                  <el-col :span="12" class="pr5">
                    <el-button
                      type="primary"
                      @click="throttle(obj, searchMapList, 1000)('click')"
                      >查询</el-button
                    >
                  </el-col>
                  <el-col :span="12" class="pl5">
                    <el-button @click="resetMapType()">重置</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div class="caseIntelligence-content-common-scrollWrap">
              <el-row class="fs14 pl20 pt20 pb20" style="height: 100%">
                <el-col :span="12" class="pr10" style="height: 100%">
                  <div class="bd_ccc" style="height: 100%; overflow: hidden">
                    <multiple-display-range
                      :mapParamsObj="mapParams"
                      ref="multipleDisplayRange"
                    ></multiple-display-range>
                  </div>
                </el-col>
                <el-col
                  :span="12"
                  class="scroll-bar-wrap pl10"
                  style="height: 100%"
                  v-loading="loadingMap"
                >
                  <div
                    class="scroll-bar pr20"
                    v-if="
                      loadingMap ||
                      (mapSearchResult.list && mapSearchResult.list.length > 0)
                    "
                  >
                    <div
                      :class="[
                        'caseIntelligence-content-common-scrollWrap-item bd_f2f2f2 pt20 pb10 por mb10',
                        item.flag ? 'active' : '',
                      ]"
                      style="height: 180px; width: 100%"
                      v-for="item in mapSearchResult.list"
                      :key="item.code"
                    >
                      <el-row class="mb10">
                        <el-col :span="5" class="txt_r">
                          <!-- <img
                            src="../../../../assets/images/caseIntelligence/caseIntelligence-con-icon-01.png"
                          />-->
                          案件编号
                        </el-col>
                        <el-col :span="16" class="pl20">{{ item.code }}</el-col>
                      </el-row>
                      <el-row class="mb10">
                        <el-col :span="5" class="txt_r">
                          <!-- <img
                            src="../../../../assets/images/caseIntelligence/caseIntelligence-con-icon-01.png"
                          />-->
                          案件名称
                        </el-col>
                        <el-col
                          :span="16"
                          class="
                            caseIntelligence-content-common-scrollWrap-item-details
                            pl20
                          "
                          :title="item.name"
                          >{{ item.name }}</el-col
                        >
                      </el-row>
                      <el-row class="mb10">
                        <el-col :span="5" class="txt_r por">
                          <!-- <i
                            class="h-icon-clock fs24 poa"
                            style="top:-2px; right:57px;"
                          ></i>-->
                          案件时间
                        </el-col>
                        <el-col :span="16" class="pl20">{{
                          item.happenTime
                        }}</el-col>
                      </el-row>
                      <el-row class="mb10">
                        <el-col :span="5" class="txt_r">
                          <!-- <img
                            src="../../../../assets/images/caseIntelligence/caseIntelligence-con-icon-03.png"
                            alt=""
                          />-->
                          案件地点
                        </el-col>
                        <el-col :span="16" class="pl20">{{
                          item.happenPlace
                        }}</el-col>
                      </el-row>
                      <el-row class="mb10">
                        <el-col :span="5" class="txt_r">
                          <!-- <img
                            src="../../../../assets/images/caseIntelligence/caseIntelligence-con-icon-04.png"
                            alt=""
                          />-->
                          简要案情
                        </el-col>
                        <el-col :span="14" class="pl20">
                          <p
                            class="
                              caseIntelligence-content-common-scrollWrap-item-details
                            "
                            :title="item.detail"
                          >
                            {{ item.detail }}
                          </p>
                        </el-col>
                      </el-row>
                      <i
                        class="
                          caseIntelligence-content-common-scrollWrap-item-line
                        "
                      ></i>
                      <div
                        class="
                          caseIntelligence-content-common-scrollWrap-item-relationCase
                          txt_c
                          cup
                        "
                        @click="relationCase(item)"
                      >
                        <i
                          v-show="clickCaseCode !== item.code"
                          class="h-icon-associate fs36"
                          :style="
                            clueInfoObj.archiveCode === item.code
                              ? 'color: #2080f7;'
                              : ''
                          "
                        ></i>
                        <el-load-icon
                          v-show="clickCaseCode === item.code"
                          class="fs36"
                        ></el-load-icon>
                        <p
                          :style="
                            clueInfoObj.archiveCode === item.code
                              ? 'color: #2080f7;'
                              : ''
                          "
                        >
                          {{
                            clueInfoObj.archiveCode === item.code
                              ? "已关联"
                              : "关联案件"
                          }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h-empty v-else v-show="!loadingMap" />
                </el-col>
              </el-row>
            </div>
          </div>
          <el-pagination
            class="pl10 pr10 bt_ccc"
            @size-change="handleSizeChangeMap"
            @current-change="handleCurrentChangeMap"
            :current-page="mapObj.searchParams.pageNo"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="mapObj.searchParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mapSearchResult.total"
          ></el-pagination>
        </h-layout-content>
      </h-layout>
    </h-layout>
  </div>
</template>

<script>
import helper from "@/helper";
import $ from "jquery";
import "@/filters";
import api from "@/api";
import rest from "@/rest";
import Bus from "@/bus";
import multipleDisplayRange from "../../../../components/map/multipleDisplayRange.vue";
import treeSelect from "@/components/tree-select.vue";
import maleIcon from "@/assets/images/personList/male.png";
import femaleIcon from "@/assets/images/personList/female.png";

export default {
  data() {
    return {
      loadingInfo: true,
      loadingMap: true,
      certificateNumber: this.$route.query.idCard, // 人员 id
      id: this.$route.query.id, // 线索 id
      passTime: this.$route.query.passTime, // 抓拍时间
      tabType: "map", // tab类型
      infoObj: {
        list: {
          areaList: [
            {
              // 案件所属区域列表
              value: "1",
              label: "滨江区",
            },
            {
              value: "2",
              label: "江干区",
            },
          ],
        },
        type: {
          areasArr: [], // 区域类型
          caseTime: [
            // 案件时段
            this.$route.query.passTime
              ? new Date(
                  new Date(this.$route.query.passTime.substr(0, 10)).getTime() -
                    3600 * 1000 * 24 * 7
                )
              : new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
            this.$route.query.passTime
              ? new Date(
                  new Date(this.$route.query.passTime.substr(0, 10)).getTime() -
                    3600 * 1000 * 24
                )
              : new Date(new Date().getTime()),
          ],
          startDate: "", // 开始时间
          endDate: "", // 结束时间
          keyWords: "", // 关键词
          pageNo: 1,
          pageSize: 20,
        },
        resetType: {
          areasArr: [], // 区域类型
          caseTime: [
            // 案件时段
            this.$route.query.passTime
              ? new Date(
                  new Date(this.$route.query.passTime.substr(0, 10)).getTime() -
                    3600 * 1000 * 24 * 7
                )
              : new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
            this.$route.query.passTime
              ? new Date(
                  new Date(this.$route.query.passTime.substr(0, 10)).getTime() -
                    3600 * 1000 * 24
                )
              : new Date(new Date().getTime()),
          ],
          startDate: "", // 开始时间
          endDate: "", // 结束时间
          keyWords: "", // 关键词
          pageNo: 1,
          pageSize: 20,
        },
      },
      mapObj: {
        centerPointObj: {
          list: {
            centerPointList: [], // 中心点列表
          },
          selectCenterPoint: {}, // 选中的中心点数据
          type: {
            centerPoint: "",
            isShowSearchWrap: false,
            bbox: "117.64128496647,39.017377695247,117.65769703353,39.024316304753",
            geometryType: "Circle",
            distance: 1000,
            height: 646,
            imgPath: true,
            isCluster: false,
            isPage: false,
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
        },
        searchParams: {
          // 查询时的参数
          pageNo: 1,
          pageSize: 20,
          longitude: "",
          latitude: "",
          distance: 3000,
          caseTime: [
            // 案件时段
            this.$route.query.passTime
              ? new Date(
                  new Date(this.$route.query.passTime.substr(0, 10)).getTime() -
                    3600 * 1000 * 24 * 7
                )
              : "",
            this.$route.query.passTime
              ? new Date(
                  new Date(this.$route.query.passTime.substr(0, 10)).getTime() -
                    3600 * 1000 * 24
                )
              : "",
          ],
          startDate: "", // 开始时间
          endDate: "", // 结束时间
        },
        resetSearchParams: {
          // 查询时的参数
          pageNo: 1,
          pageSize: 20,
          longitude: "",
          latitude: "",
          distance: 3000,
          caseTime: [
            // 案件时段
            this.$route.query.passTime
              ? new Date(
                  new Date(this.$route.query.passTime.substr(0, 10)).getTime() -
                    3600 * 1000 * 24 * 7
                )
              : "",
            this.$route.query.passTime
              ? new Date(
                  new Date(this.$route.query.passTime.substr(0, 10)).getTime() -
                    3600 * 1000 * 24
                )
              : "",
          ],
          startDate: "", // 开始时间
          endDate: "", // 结束时间
        },
      },
      currentPage: 1, // 当前第几页
      personInfoObj: {}, // 人员信息
      clueInfoObj: {}, // 线索信息
      infoSearchResult: {
        // 信息检索查询结果
        list: [],
        total: 0,
      },
      mapSearchResult: {
        // 地图检索查询结果
        list: [],
        total: 0,
      },
      infoScrollHeight: 0,
      mapParams: {},
      createDepartmentsList: [],
      createDepartmentsLabels: [],
      existsChildList: [],
      clickCaseCode: "",
      inputErr: false,
      inputErrDiscription: "",
      obj: { timer: null },
      // timer: null
    };
  },
  components: {
    multipleDisplayRange,
    treeSelect,
  },
  watch: {
    "mapObj.searchParams.distance": function (val) {
      this.inputErr = val.length >= 7 || val <= 0;
      this.inputErrDiscription =
        val.length >= 7
          ? "搜索范围距离过大，应小于7位数！"
          : "搜索距离应大于0!";
      if (!Number(val) && Number(val) !== 0) {
        this.inputErrDiscription = "请输入数字";
        this.inputErr = true;
      }
    },
  },
  mounted() {
    this.init();
    this.setScrollHeight();
    Bus.$on("selectMarker", (data) => {
      let result = [...this.mapSearchResult.list];
      result.forEach((item) => {
        if (data == item.code) {
          item.flag = true;
        } else {
          item.flag = false;
        }
      });
      this.mapSearchResult.list = result;
    });
  },
  methods: {
    throttle: helper.throttle,
    init() {
      let that = this;
      // 获取人员信息
      rest
        .get(api.clueManage.clueFindPersonInfo, {
          humanId: that.$route.query.idCard,
        })
        .done(function (res) {
          if (helper.isSuccess(res)) {
            that.personInfoObj = res.data;
          } else {
            that.$message.error(res.msg);
          }
        });
      // 获取线索信息
      rest
        .get(api.caseIntelligence.getClueInfo, {
          id: that.id,
        })
        .done(function (res) {
          if (helper.isSuccess(res)) {
            that.clueInfoObj = res.data;
            if (res.data && res.data.longitude) {
              that.mapObj.centerPointObj.type.centerPoint =
                res.data.placeAddress;
              that.mapObj.centerPointObj.selectCenterPoint.longitude =
                res.data.longitude;
              that.mapObj.centerPointObj.selectCenterPoint.latitude =
                res.data.latitude;
              that.searchMapList();
            } else {
              that.loadingMap = false;
              that.mapObj.centerPointObj.type.centerPoint = "";
              that.mapObj.centerPointObj.selectCenterPoint.longitude = "";
              that.mapObj.centerPointObj.selectCenterPoint.latitude = "";
              that.searchMapList();
              that.$message.warning(
                "线索对应的经纬度为空，请手动输入中心点位！"
              );
            }
            that.searchInfoList();
          } else {
            that.$message.error(res.msg);
          }
        });
      // 案件所属区域
      rest
        .post(api.caseIntelligence.getCaseLocation, {
          departmentCode: "-1",
        })
        .done(function (res) {
          if (helper.isSuccess(res)) {
            that.infoObj.list.areaList = res.data;
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    handleSizeChangeInfo(val) {
      // 分页 - 每页多少条
      this.infoObj.type.pageSize = val;
      this.searchInfoList();
    },
    handleCurrentChangeInfo(val) {
      // 分页 - 当前页
      this.infoObj.type.pageNo = val;
      this.searchInfoList();
    },
    // 设置滚动高度
    setScrollHeight() {
      this.$nextTick(() => {
        let windowHeight = $(window).height(); // 可视区高度
        // let listTop = document.getElementsByClassName("caseIntelligence")[0].offsetTop; //滚动元素离顶部的距离
        let scrollHeight = windowHeight - 117 - 66; // 滚动高度
        this.infoScrollHeight = scrollHeight;
        $(".caseIntelligence-content-common-scrollWrap").css({
          height: this.infoScrollHeight + "px",
        });
      });
    },
    // 信息检索-查询
    searchInfoList() {
      let that = this;
      that.loadingInfo = true;
      this.infoObj.type.startDate = helper.dateFormat(
        "YYYY-mm-dd",
        new Date(this.infoObj.type.caseTime[0]) ||
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 7)
      );
      this.infoObj.type.endDate = helper.dateFormat(
        "YYYY-mm-dd",
        new Date(this.infoObj.type.caseTime[1]) || new Date()
      );
      this.infoObj.type.deptCodes = this.infoObj.type.areasArr;
      rest
        .post(api.caseIntelligence.findCaseByParam, this.infoObj.type)
        .done(function (res) {
          if (helper.isSuccess(res)) {
            that.infoSearchResult = res.data;
          } else {
            that.$message.error(res.msg);
          }
          that.loadingInfo = false;
        })
        .always(() => {
          if (this.obj.timer) {
            clearTimeout(this.obj.timer);
            this.obj.timer = null;
          }
        });
    },
    // 信息检索-重置
    resetInfoType() {
      Object.assign(this.infoObj.type, this.infoObj.resetType);
      this.$refs.treeSelect && this.$refs.treeSelect.clearSelected();
    },
    // 信息检索-关联案件
    relationCase(item) {
      if (!this.clickCaseCode && this.clueInfoObj.archiveCode !== item.code) {
        this.clickCaseCode = item.code;
        // this.timer = setTimeout(() => {
        //   this.clickCaseCode = "";
        //   this.timer = null;
        // }, 1000);
        let that = this;
        rest
          .get(api.caseIntelligence.relationCaseAndClue, {
            clueId: that.id,
            caseCode: item.code,
            archiveId: item.archiveId,
          })
          .done(function (res) {
            if (helper.isSuccess(res)) {
              that.clueInfoObj.archiveCode = item.code;
              that.$message.success("关联成功");
            } else {
              that.$message.error(res.msg);
            }
            that.clickCaseCode = "";
          })
          .catch(() => {
            this.clickCaseCode = "";
          });
      }
    },
    // 地图检索-中心点-icons 清除
    locationClearIconClick() {
      this.mapObj.centerPointObj.type.centerPoint = "";
    },
    // 地图检索-中心点-搜索
    locationChange() {
      this.locationDebounce(this.getLocationData, 500);
    },
    // 防抖
    locationDebounce(fn, wait) {
      if (this.fun !== null) {
        clearTimeout(this.fun);
      }
      this.fun = setTimeout(fn, wait);
    },
    // 地图检索-中心点-搜索-获取数据
    getLocationData() {
      let that = this;
      if (this.mapObj.centerPointObj.type.centerPoint == "") {
        that.mapObj.centerPointObj.type.isShowSearchWrap = false;
      } else {
        rest
          .post(api.clueSearch.findByCameraName, {
            name: that.mapObj.centerPointObj.type.centerPoint,
          })
          .done(function (res) {
            if (helper.isSuccess(res)) {
              that.mapObj.centerPointObj.type.isShowSearchWrap = true;
              that.mapObj.centerPointObj.list.centerPointList = res.data;
            } else {
              that.$message.error(res.msg);
            }
          });
      }
    },
    // 点击整个大盒子
    clickWrap() {
      this.mapObj.centerPointObj.type.isShowSearchWrap = false;
    },
    // 地图检索-中心点-选择其中一个中心点
    changeCenterPoint(item) {
      this.mapObj.centerPointObj.type.centerPoint = item.name
        .replace(/<font color="red">/g, "")
        .replace(/<\/font>/g, "");
      this.mapObj.centerPointObj.selectCenterPoint = item;
      this.mapObj.centerPointObj.type.isShowSearchWrap = false;
    },
    // 地图检索-查询
    async searchMapList(type) {
      if (type && !this.mapObj.centerPointObj.type.centerPoint) {
        this.$message.warning("请输入中心点!", 3000);
        return;
      }
      if (this.inputErr) {
        this.$message.warning(this.inputErrDiscription, 3000);
        return;
      }
      let that = this;
      // 案发时间段
      // if (this.$route.query.passTime) {
      //   if (this.mapObj.searchParams.caseTime[0].length) {
      //     this.mapObj.searchParams.startDate = this.mapObj.searchParams.caseTime[0];
      //     this.mapObj.searchParams.endDate = this.mapObj.searchParams.caseTime[1];
      //   } else {
      //     this.mapObj.searchParams.startDate = helper.dateFormat(
      //       "YYYY-mm-dd",
      //       this.mapObj.searchParams.caseTime[0]
      //     );
      //     this.mapObj.searchParams.endDate = helper.dateFormat(
      //       "YYYY-mm-dd",
      //       this.mapObj.searchParams.caseTime[1]
      //     );
      //   }
      // } else {
      //   if (this.mapObj.searchParams.caseTime[0].length) {
      //     this.mapObj.searchParams.startDate = this.mapObj.searchParams.caseTime[0];
      //     this.mapObj.searchParams.endDate = this.mapObj.searchParams.caseTime[1];
      //   } else {
      //     this.mapObj.searchParams.startDate = helper.dateFormat(
      //       "YYYY-mm-dd",
      //       new Date(new Date().getTime() - 3600 * 1000 * 24 * 7)
      //     );
      //     this.mapObj.searchParams.endDate = helper.dateFormat(
      //       "YYYY-mm-dd",
      //       new Date(new Date().getTime())
      //     );
      //   }
      // }
      this.mapObj.searchParams.startDate = helper.dateFormat(
        "YYYY-mm-dd",
        new Date(this.mapObj.searchParams.caseTime[0]) ||
          new Date(new Date().getTime() - 3600 * 1000 * 24 * 7)
      );
      this.mapObj.searchParams.endDate = helper.dateFormat(
        "YYYY-mm-dd",
        new Date(this.mapObj.searchParams.caseTime[1]) || new Date()
      );
      if (!this.mapObj.searchParams.caseTime[1]) {
        this.mapObj.searchParams.startDate = "";
        this.mapObj.searchParams.endDate = "";
      }
      // 坐标
      this.mapObj.searchParams.longitude =
        this.mapObj.centerPointObj.selectCenterPoint.longitude;
      this.mapObj.searchParams.latitude =
        this.mapObj.centerPointObj.selectCenterPoint.latitude;
      that.loadingMap = true;
      if (type) {
        await this.getMapInfo(type);
      } else if (
        this.mapObj.searchParams.longitude &&
        this.mapObj.searchParams.latitude
      ) {
        await this.getMapInfo();
      } else {
        let mapParams = {
          centerPoint: {
            scrollheight: that.infoScrollHeight,
          },
          listData: [],
        };
        this.mapParams = mapParams;
        Bus.$emit("multipleDisplayRange", mapParams);
        that.loadingMap = false;
      }
      if (this.obj.timer) {
        clearTimeout(this.obj.timer);
        this.obj.timer = null;
      }
    },
    // 地图监测-获取数据
    async getMapInfo(type) {
      let that = this;
      let mapParams = {
        centerPoint: {
          longitude: that.mapObj.searchParams.longitude,
          latitude: that.mapObj.searchParams.latitude,
          distance: that.mapObj.searchParams.distance,
          scrollheight: that.infoScrollHeight,
        },
        listData: [],
      };
      that.loadingMap = true;
      await rest
        .post(api.caseIntelligence.findCaseBySpatial, this.mapObj.searchParams)
        .done(function (res) {
          if (helper.isSuccess(res)) {
            that.mapSearchResult = res.data;
            mapParams = {
              centerPoint: {
                longitude: that.mapObj.searchParams.longitude,
                latitude: that.mapObj.searchParams.latitude,
                distance: that.mapObj.searchParams.distance,
                scrollheight: that.infoScrollHeight,
              },
              listData: that.mapSearchResult.list
                ? [...that.mapSearchResult.list]
                : [],
            };
          } else {
            that.$message.error(res.msg);
          }
          if (type) {
            Bus.$emit("multipleDisplayRange", mapParams);
          } else {
            that.$refs.multipleDisplayRange.init(mapParams);
          }
          that.loadingMap = false;
        });
    },
    // 地图检索-重置
    resetMapType() {
      Object.assign(this.mapObj.searchParams, this.mapObj.resetSearchParams);
    },
    handleSizeChangeMap(val) {
      // 分页 - 每页多少条
      this.mapObj.searchParams.pageSize = val;
      this.searchMapList();
    },
    handleCurrentChangeMap(val) {
      // 分页 - 当前页
      this.mapObj.searchParams.pageNo = val;
      this.searchMapList();
    },
    // 切换类型，赋值滚动高度
    changeTabType() {
      this.$nextTick(() => {
        $(".caseIntelligence-content-common-scrollWrap").css({
          height: this.infoScrollHeight + "px",
        });
      });
    },
    getNodeData(departmentCode = "-1") {
      let that = this;
      return new Promise((resolve, reject) => {
        rest
          .post(api.caseIntelligence.getCaseLocation, {
            departmentCode: "-1",
          })
          .done(function (res) {
            if (helper.isSuccess(res)) {
              resolve(res.data);
            } else {
              that.$message.error(res.msg);
            }
          });
      });
    },
    async loadNode(node, resolve) {
      const data = await this.getNodeData(
        node.level === "0" ? "-1" : node.data.indexCode
      );
      resolve(data);
    },
    async getCreateDepartments(indexCode) {
      const { data } = await this.getNodeData(indexCode);
      this.createDepartmentsList = data;
      const len = this.createDepartments.length || 0;
      const createDepartmentsTemp = this.createDepartments.concat();
      for (let i = 0; i < len; i++) {
        this.createDepartmentsList.forEach((item) => {
          if (item.indexCode === this.createDepartments[i]) {
            this.createDepartmentsLabels.push(item);
            createDepartmentsTemp.splice(i, 1);
          }
        });
      }
      this.createDepartments = createDepartmentsTemp.concat();
      if (this.createDepartments.length) {
        this.createDepartmentsList.forEach((item) => {
          if (item.existsChild && item.parentIndexCode !== "-1") {
            this.existsChildList.push(item);
          }
        });
        if (this.existsChildList.length) {
          this.getCreateDepartments(this.existsChildList[0].indexCode);
          this.existsChildList.splice(0, 1);
        }
      } else {
        return this.createDepartmentsLabels;
      }
    },
    getIcon(gender) {
      return gender === "male" ? maleIcon : femaleIcon;
    },
  },
};
</script>

<style lang="scss" scoped>
.caseIntelligence {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .caseIntelligence-aside {
    .caseIntelligence-aside-header {
      display: flex;
      .caseIntelligence-aside-header-imgWrap {
        flex: 0 0 120px;
        width: 120px;
        height: 120px;
      }
      .caseIntelligence-aside-header-wordWrap {
        flex: 1;
      }
    }
    .caseIntelligence-aside-footer {
      .caseIntelligence-aside-footer-header {
        &-title::before {
          content: "";
          display: inline-block;
          background: #2080f7;
          width: 5px;
          height: 5px;
          border-radius: 5px;
        }
        .caseIntelligence-aside-footer-header-btn {
          background-image: linear-gradient(174deg, #fdc12d 0%, #fa8d14 100%);
          border: 1px solid #f2a520;
          line-height: 20px;
          padding: 0 10px;
        }
      }
      .caseIntelligence-aside-footer-img {
        height: 270px;
      }
      .caseIntelligence-aside-footer-wordWrap {
        > p {
          margin-top: 1rem;
          i {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #999999;
            margin-right: 1rem;
          }
        }
        .caseIntelligence-aside-footer-wordWrap-tag {
          .h-icon-tag_f {
            top: 1px;
            left: -4px;
          }
          em {
            color: #2196f3;
            border: 1px solid #2196f3;
          }
        }
      }
    }
  }
  .caseIntelligence-content {
    ::v-deep .el-tabs__content {
      padding: 0;
    }
    display: flex;
    flex-direction: column;
    .caseIntelligence-content-common {
      overflow: hidden;
      ::v-deep .el-tabs__header {
        margin-bottom: 0;
        .el-tabs__item {
          padding: 0;
          width: 100px;
          text-align: center;
        }
      }
      ::v-deep .el-tabs__content {
        overflow: visible;
        input {
          height: 32px;
          line-height: 32px;
          padding-left: 10px;
        }
        .el-select {
          display: block;
        }
      }
      .btn_box {
        button {
          padding: 0;
          margin: 0;
          display: block;
          width: 100%;
          line-height: 30px;
        }
      }
      .caseIntelligence-content-common-scrollWrap {
        .caseIntelligence-content-common-scrollWrap-item {
          border: 1px solid #d9e9ff;
          box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.04);
          border-radius: 8px;
          .caseIntelligence-content-common-scrollWrap-item-line {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 17%;
            border-left: 1px dashed #f2f2f2;
            &:before,
            &:after {
              content: "";
              width: 20px;
              height: 20px;
              background: #fff;
              border-top: 1px solid #fff;
              border-left: 1px solid #fff;
              border-right: 1px solid #d9e9ff;
              border-bottom: 1px solid #d9e9ff;
              position: absolute;
              border-radius: 100%;
            }
            &:before {
              transform: rotate(45deg);
              top: -10px;
              left: -10px;
            }
            &:after {
              transform: rotate(-135deg);
              bottom: -10px;
              left: -10px;
            }
          }
          .caseIntelligence-content-common-scrollWrap-item-relationCase {
            width: 17%;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
          }
          .caseIntelligence-content-common-scrollWrap-item-details {
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          &.active {
            box-shadow: 2px 2px 10px 1px rgba(77, 153, 248, 0.3);
          }
          &:hover {
            box-shadow: 2px 2px 10px 1px rgba(77, 153, 248, 0.3);
          }
        }
      }
    }
    .caseIntelligence-content-map {
      overflow: hidden;
      .caseIntelligence-content-map-form {
        .caseIntelligence-content-map-form-centerPoint {
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
      }
    }
  }
}
</style>
<style lang="scss">
.caseIntelligence-content-map-form-centerPoint.scroll-bar-wrap {
  z-index: 9999 !important;
}
.err-input {
  > input {
    border: 1px red solid;
    &:hover,
    &:focus {
      border: 1px red solid;
    }
  }
}
</style>
