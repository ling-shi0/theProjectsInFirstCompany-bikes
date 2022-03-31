<!--
 * @Descripttion: 周边线索-右边栏线索管理
 * @version:
 * @Author: someone
 * @Date: 2020-10-13 16:03:25
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-02 14:41:36
 -->
<template>
  <div class="case-manage-sidebar">
    <el-row class="lh44 pl10 pr10 clusterAnalysis_in_manage_header bb_ccc">
      <el-col :span="12">
        <img
          src="@/assets/images/researchReport/title_icon_02.png"
          alt
          width="22px"
          class="por"
          style="top: 2px"
        />
        线索管理({{ count }})
      </el-col>
      <el-col :span="12" class>
        <el-select
          v-model="clueManageObj.type"
          placeholder="请选择"
          @change="changeTimeAside()"
        >
          <el-option
            v-for="item in clueManageObj.list"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div
      class="clusterAnalysis_in_manage_list scroll-bar-wrap"
      style="width: 100%"
      v-loading="clueManageObj.loading"
    >
      <el-scrollbar
        ref="scrollbar"
        v-if="clueManageObj.resultList.length > 0"
        wrap-class="scroll-wrap"
        overflow-y="auto"
        @on-scrolling-y="handleScroll"
      >
        <ul class="scroll-bar pl10 pr10 pt10" style="height: 98%">
          <li
            class="clusterAnalysis_in_manage_list_li mb10 por"
            v-for="(item, index) in clueManageObj.resultList"
            :key="item.id"
          >
            <div
              class="clusterAnalysis_in_manage_list_li_imgWrap cup"
              @click="openClueDetails(clueManageObj.resultList, index, 'photo')"
            >
              <img
                :src="item.picUrl"
                v-if="item.picUrl"
                style="width: 80px; height: 80px"
              />
              <img
                src="@/assets/images/personList/head_sex_01.png"
                alt
                style="width: 80px; height: 80px"
                v-else
              />
            </div>
            <div
              class="clusterAnalysis_in_manage_list_li_wordWrap fs14 pl5 pt5"
            >
              <div>
                <p class="PublicTimeAdress">
                  <i class="h-icon-info_time"></i>
                  {{ item.passTime ? item.passTime : "暂无抓拍时间" }}
                </p>
                <p class="PublicTimeAdress">
                  <i class="h-icon-info_location"></i>
                  {{ item.placeAddress ? item.placeAddress : "暂无抓拍地点" }}
                </p>
              </div>
              <p class="clusterAnalysis_in_manage_list_li_wordWrap_tag">
                <i
                  class="h-icon-delete fs22 fr cup"
                  @click="deleteClue(item.id)"
                  title="删除线索"
                ></i>
                <i
                  class="h-icon-edit"
                  @click="
                    openClueDetails(clueManageObj.resultList, index, 'photo')
                  "
                  title="编辑线索"
                ></i>
              </p>
            </div>
            <div
              class="clusterAnalysis_in_manage_list_li_checkWrap"
              @click="clueManageObjItemFlag(item)"
            >
              <img
                src="@/assets/images/clueSearch/checkbox-icon-02.png"
                v-if="item.flag"
              />
              <img
                src="@/assets/images/clueSearch/checkbox-icon-01.png"
                v-else
              />
            </div>
          </li>
        </ul>
      </el-scrollbar>
      <h-empty size="sm" v-else />
    </div>
    <div class="clusterAnalysis_in_manage_map">
      <h2
        class="
          clusterAnalysis_manage_map-title
          fs14
          color_333
          fw_n
          pl10
          bb_ccc
          bt_ccc
          lh44
        "
      >
        <div>
          <img
            src="@/assets/images/researchReport/title_icon_04.png"
            class="por"
          />
          地图
        </div>
        <i class="h-icon-windows_maximum" @click="showLargeMap"></i>
      </h2>
      <div class="clusterAnalysis_manage_map-in">
        <the-multiple-display-size-small
          ref="multipledisplaySizeSmall"
          @showLargeMap="showLargeMap"
        ></the-multiple-display-size-small>
      </div>
    </div>
    <clue-detail-dialog
      :data="modal.pics"
      :index="modal.showIndex"
      :visible.sync="modal.visible"
      :upload="modal.upload"
      :form-type="modal.formType"
      :content-type="modal.contentType"
      @updateList="updateList"
    />
  </div>
</template>

<script>
import helper from "@/helper";
import "@/filters";
import api from "@/api";
import rest from "@/rest";
import Bus from "@/bus";
import TheMultipleDisplaySizeSmall from "@/components/map/TheMultipleDisplaySizeSmall.vue";
import ClueDetailDialog from "@/components/photo-details-dialog/clue-detail-dialog";

export default {
  components: {
    TheMultipleDisplaySizeSmall,
    ClueDetailDialog,
  },
  props: ["humanId"],
  data() {
    return {
      clueManageObj: {
        // 线索管理列表
        list: [
          {
            value: 0,
            label: "全部时间",
          },
          {
            value: 7,
            label: "最近一周",
          },
          {
            value: 30,
            label: "最近一个月",
          },
          {
            value: 90,
            label: "最近三个月",
          },
        ],
        resultList: [],
        type: 0,
        loading: false,
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
      pageNo: 1,
      count: 0,
      isChangePageNo: false,
      selectList: [],
    };
  },
  watch: {
    pageNo(val) {
      if (val !== 1) {
        this.changeTimeAside(true);
      }
    },
  },
  methods: {
    updateList() {
      this.changeTimeAside();
      this.$emit("updateList");
    },
    showLargeMap() {
      this.$emit("showLargeMap");
      Bus.$emit(
        "clueManageToupdateTheMultipleDisplaySizeLarge",
        this.selectList
      );
    },
    // 切换线索管理—时间
    changeTimeAside(pageNoChange) {
      let that = this;
      let end = new Date();
      let start = new Date();
      this.clueManageObj.loading = true;
      start.setTime(
        start.getTime() - 3600 * 1000 * 24 * this.clueManageObj.type
      );
      if (!pageNoChange) {
        this.pageNo = 1;
        this.clueManageObj.resultList.length = 0;
        if (!this.clueManageObj.loading) this.$refs.scrollbar.setScroll(0);
      }
      let params = {
        startTime: this.clueManageObj.type
          ? helper.dateFormat("YYYY-mm-dd HH:MM", start).substr(0, 10)
          : null,
        endTime: this.clueManageObj.type
          ? helper.dateFormat("YYYY-mm-dd HH:MM", end).substr(0, 10)
          : null,
        clueType: 1,
        humanId: this.humanId,
        arrayType: "clueType",
        pageNo: this.pageNo,
        pageSize: 20,
      };
      rest
        .post(api.clueManage.findAllClues, params)
        .done((res) => {
          if (helper.isSuccess(res)) {
            if (res.data && res.data.length > 0) that.count = res.data[0].count;
            if (that.pageNo === 1) that.clueManageObj.resultList.length = 0;
            res.data.forEach((itemMonth) => {
              itemMonth &&
                itemMonth.list &&
                itemMonth.list.forEach((item) => {
                  item.flag = false;
                  item.activeStatus = false;
                });
              that.clueManageObj.resultList.push(...itemMonth.list);
            });
            if (this.selectList.length > 0) {
              this.selectList.length = 0;
              // this.selectList.pop();
            }
            Bus.$emit(
              "clueManageToupdateTheMultipleDisplaySizeSmall",
              this.selectList
            );
            Bus.$emit(
              "clueManageToupdateTheMultipleDisplaySizeLarge",
              this.selectList
            );
          } else {
            that.$message.error(res.msg);
          }
          that.clueManageObj.loading = false;
          if (pageNoChange) {
            that.isChangePageNo = false;
          } else {
            that.$nextTick(() => {
              that.isChangePageNo = false;
            });
          }
        })
        .catch((err) => {
          that.$message.error(err);
          if (pageNoChange) {
            that.isChangePageNo = false;
          } else {
            that.$nextTick(() => {
              that.isChangePageNo = false;
            });
          }
        });
    },
    // 线索管理-列表-勾选切换
    clueManageObjItemFlag(item) {
      item.flag = !item.flag;
      let selectList = this.clueManageObj.resultList.filter((item) => {
        if (item.flag && item.longitude && item.latitude) {
          return item;
        }
      });
      this.selectList = selectList;
      Bus.$emit("clueManageToupdateTheMultipleDisplaySizeSmall", selectList);
      Bus.$emit("clueManageToupdateTheMultipleDisplaySizeLarge", selectList);
    },
    // 打开详情弹框
    openClueDetails(list, index, type) {
      this.modal = {
        ...this.modal,
        ...{ visible: true, pics: list, showIndex: index, contentType: type },
      };
    },
    // 删除线索
    deleteClue(id) {
      let that = this;
      rest
        .post(api.clusterAnalysis.deleteClueInfos, {
          ids: id,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.$message.success("删除成功!");
            that.changeTimeAside();
            that.updateList();
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    handleScroll({ scrollTop, percentY }) {
      if (
        percentY * 100 > 70 &&
        this.clueManageObj.resultList.length < this.count &&
        !this.isChangePageNo
      ) {
        this.pageNo++;
        this.isChangePageNo = true;
      }
    },
  },
  mounted() {
    this.changeTimeAside(); // 线索管理时间
    Bus.$on("changeClueDatas", () => {
      this.changeTimeAside();
    });
  },
};
</script>

<style lang="scss">
.clusterAnalysis_in_manage_header {
  ::v-deep .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
}
.clusterAnalysis_in_manage_list {
  position: absolute;
  top: 44px;
  bottom: 271px;
  .scroll-wrap {
    height: 100%;
    overflow-x: hidden;
  }
  > div {
    width: 100%;
    height: 100%;
  }
  .clusterAnalysis_in_manage_list_li {
    border: 1px solid #fff;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    width: 100%;
    height: 90px;
    .clusterAnalysis_in_manage_list_li_imgWrap {
      display: flex;
      align-items: center;
      flex: 0 0 88px;
    }
    .clusterAnalysis_in_manage_list_li_wordWrap {
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
      .clusterAnalysis_in_manage_list_li_wordWrap_tag {
        width: 40px;
        height: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-left: 1px #e0e0e0 solid;
        > i {
          font-size: 1.5rem;
          cursor: pointer;
        }
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
    .clusterAnalysis_in_manage_list_li_checkWrap {
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
.clusterAnalysis_in_manage_map {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  .clusterAnalysis_manage_map-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    & img {
      top: 10px;
    }
    > i {
      font-size: 24px;
      margin-right: 8px;
      cursor: pointer;
    }
  }
  .clusterAnalysis_manage_map-in {
    height: 220px;
  }
}
</style>
