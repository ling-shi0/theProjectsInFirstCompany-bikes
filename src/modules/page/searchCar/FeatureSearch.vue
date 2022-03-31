<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-31 10:39:49
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-16 13:57:44
-->
<template>
  <h-page-container class="feature-search">
    <h-page-content>
      <header class="header">
        <h-page-search ref="search" :model="search" label-position="top">
          <h-page-search-item label="选择时段" prop="interval">
            <el-date-picker
              v-model="search.interval"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
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
          <h-page-search-item>
            <el-button
              type="link"
              @click="overflowSearchFlag = !overflowSearchFlag"
              >{{ overflowSearchFlag ? "收起" : "展开" }}更多条件<i
                :class="
                  overflowSearchFlag
                    ? 'h-icon-angles_up_sm'
                    : 'h-icon-angles_down_sm'
                "
              ></i
            ></el-button>
          </h-page-search-item>
          <h-page-search-item>
            <el-button type="primary" @click="getData(true)">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </h-page-search-item>
        </h-page-search>
        <transition name="slide-fade">
          <div class="overflow-search" v-if="overflowSearchFlag">
            <FeatureSearchFilter
              @searchDataChange="searchDataChange"
            ></FeatureSearchFilter>
          </div>
        </transition>
      </header>
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
                    icon: 'h-icon-info_location',
                    content: item.placeAddress,
                  },
                  {
                    icon: 'h-icon-info_time',
                    content: item.passTime,
                  },
                ],
              }"
            >
              <template slot="info" slot-scope="{ item }">
                <i v-if="item.icon" :class="item.icon" />
                <label v-if="item.label" v-text="item.label" />
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
import multipleDisplay from "@/components/map/multipleDisplay.vue";
import SuiSelectPoint from "@/components/selectPoint/selectPoint";
import { loadNode } from "@/utils/index.js";
import FeatureSearchFilter from "./FeatureSearchFilter";

export default {
  name: "FeatureSearch",
  data() {
    return {
      search: {
        modelData: "",
        interval: [
          moment(new Date())
            .subtract(1, "months")
            .format("YYYY-MM-DD HH:mm:ss"),
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ],
        areaCode: "",
        cameraIndexCode: "",
        vehicleColor: "",
        withFrontBasket: "",
        withRearBox: "",
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
      viewData: {},
      overflowSearchFlag: false,
    };
  },
  components: {
    multipleDisplay,
    SuiSelectPoint,
    FeatureSearchFilter,
  },
  methods: {
    handleReset() {
      this.$refs.search.getForm().resetFields();
      this.$set(this.search, "areaCode", "");
      this.$set(this.search, "cameraIndexCode", "");
      this.$refs.selectPoint && this.$refs.selectPoint.setValue({});
    },
    getData(isUpdate) {
      if (isUpdate) {
        this.currentPageNo = 1;
      }
      let {
        interval,
        areaCode,
        cameraIndexCode,
        vehicleColor,
        withFrontBasket,
        withRearBox,
      } = this.search;
      let [startTime, endTime] = interval;
      rest
        .post(api.searchCar.featureSearch, {
          startTime: moment(startTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          endTime: moment(endTime).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          areaCode,
          cameraIndexCode,
          pageNo: this.currentPageNo,
          pageSize: this.currentPageSize,
          vehicleColor,
          withFrontBasket,
          withRearBox,
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
    searchDataChange(data) {
      this.search.vehicleColor = data.vehicleColor;
      this.search.withFrontBasket = data.withFrontBasket;
      this.search.withRearBox = data.withRearBox;
    },
  },
};
</script>

<style lang="scss">
.feature-search {
  height: 100% !important;
  .header {
    flex: none;
    width: 100%;
    height: 109px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    background-color: #fff;
    position: relative;
    & .el-form {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .el-form-item {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
    }
    .el-input-number {
      width: 100%;
    }
    .overflow-search {
      width: 100%;
      height: 166px;
      background: #ffffff;
      position: absolute;
      top: 109px;
      left: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      z-index: 2010;
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
</style>
<style lang="scss" scoped>
.h-page-search {
  width: 100%;
  border-bottom: none;
}
.header {
  & .el-form {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
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

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
