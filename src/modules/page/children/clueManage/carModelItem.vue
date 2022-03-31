<template>
  <div
    class="car-model-item"
    @mouseenter="deleteFlag = true"
    @mouseleave="deleteFlag = false"
    :class="openMoreFlag ? 'active' : ''"
    draggable="true"
    @dragstart="dragGroupStart"
    @dragleave="handleDragLeave"
    @dragover="dragoverVehicle"
    @drop="handleDrop"
    :style="itemData.dragFlag ? 'border: 1px #409eff solid' : ''"
  >
    <div class="car-model-item-left">
      <div class="car-model-item-left-title">
        <div
          v-if="itemData.bikeLabel !== '0'"
          :class="
            itemData.bikeLabel === '1'
              ? 'car-model-item-left-title-question'
              : 'car-model-item-left-title-own'
          "
        >
          <div
            :class="
              itemData.bikeLabel === '1'
                ? 'car-model-item-left-title-question-code'
                : 'car-model-item-left-title-own-code'
            "
          >
            {{ itemData.bikeCode }}
          </div>
          {{ itemData.bikeLabel === "1" ? "可疑车辆" : "自用车辆" }}
        </div>
        <div class="car-model-item-left-title-unGroup" v-else>
          <div class="car-model-item-left-title-unGroup-code"></div>
          未分组
        </div>
        <span :title="'(' + (itemData.clueCount || 0) + ')'">{{
          "(" + (itemData.clueCount || 0) + ")"
        }}</span>
      </div>
      <div class="car-model-item-left-img">
        <EditRemarkPane
          :itemMes="itemData"
          :groupMes="{
            humanId: humanId,
            bikeCode: itemData.bikeCode,
            bikeLabel: itemData.bikeLabel,
          }"
          @refreshCarGroup="refreshCarGroup"
          style="width: 100%; height: 200px; background: rgba(0, 0, 0, 0)"
          :dontShowTitle="true"
          v-if="itemData.bikeLabel !== '0'"
        ></EditRemarkPane>
      </div>
    </div>
    <div class="car-model-item-right">
      <div
        class="car-model-item-right-list"
        :style="openMoreFlag ? 'overflow-y: auto;' : ''"
        @scroll="handleScroll"
      >
        <clue-manage-card-list-item
          v-for="(itemType, indexType) in itemData.clueInfoDOList"
          :key="indexType"
          :hasAddToClue="0"
          :itemFlag="itemType.flag"
          @dragstart.native="
            (e) => {
              e.stopPropagation();
              itemType.flag = true;
              $emit('flagChangeArr', itemType);
            }
          "
          @flagChange="
            () => {
              itemType.flag = !itemType.flag;
              $emit('flagChangeArr', itemType);
            }
          "
          @sendToCompare="
            (type) => {
              sendToCompare(type, itemType);
            }
          "
        >
          <div slot="img">
            <div>
              <div
                v-if="itemType.picUrl"
                style="position: relative"
                @click="
                  openClueDetails(itemData.clueInfoDOList, indexType, 'photo')
                "
              >
                <h-img-view
                  :src="itemType.picUrl"
                  mode="fill"
                  class="wh100 item_in_img"
                  style="pointer-events: none; width: 220px; height: 158px"
                />
                <h-img-snippets-rect
                  v-if="itemType.rect"
                  :rect="getItemRect(JSON.parse(itemType.rect))"
                />
              </div>
              <img
                src="@/assets/images/personList/head_sex_01.png"
                class="wh100 item_in_img"
                style="width: 220px; height: 158px"
                v-else
              />
            </div>
          </div>
          <div slot="info">
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                height: 60px;
                width: 216px;
              "
            >
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <div style="display: flex; align-items: center">
                  <i
                    class="
                      h-icon-info_time
                      clueManage-main-content-footer-listIn-info-item-flex-icon
                      fs20
                      color_999
                      por
                    "
                    title="线索时间"
                    style="font-size: 24px"
                  ></i>
                  <div>
                    {{ itemType.passTime ? itemType.passTime : "暂无" }}
                  </div>
                </div>
              </div>
              <div style="display: flex; align-items: center">
                <i
                  class="
                    h-icon-info_location
                    clueManage-main-content-footer-listIn-info-item-flex-icon
                    fs20
                    color_999
                    por
                  "
                  style="font-size: 24px"
                  title="抓拍地点"
                ></i>
                <div :title="itemType.placeAddress" class="text-ellipsis">
                  {{ itemType.placeAddress || "暂无抓拍地点" }}
                </div>
              </div>
              <div style="display: flex; align-items: center">
                <i
                  class="
                    h-icon-info_data
                    clueManage-main-content-footer-listIn-info-item-flex-icon
                    fs20
                    color_999
                    por
                  "
                  title="案件编号"
                  style="font-size: 24px"
                ></i>
                <div :title="itemType.archiveCode" class="text-ellipsis">
                  {{ itemType.archiveCode || "暂无案件编号" }}
                </div>
                <i
                  class="h-icon-copy fs20 por copy cup copyIcon"
                  :data-clipboard-text="itemType.archiveCode"
                  style="font-size: 24px; margin-left: 2px"
                  title="点击关联案件编号"
                  @click="copyText()"
                  v-if="itemType.archiveCode"
                ></i>
              </div>
            </div>
          </div>
          <div slot="overflow">
            <div style="width: 200px; height: 90px; margin: -6px auto 0">
              <div
                style="
                  height: 65px;
                  display: flex;
                  justify-content: space-around;
                  align-items: space-around;
                  flex-wrap: wrap;
                "
              >
                <div class="item-button" @click="goCaseIntelligence(itemType)">
                  <img src="@/assets/images/clueManage/archive.png" />
                  周边案件
                </div>
                <div class="item-button" @click="bodySearchHander(itemType)">
                  <img src="@/assets/images/clueManage/findPerson.png" />
                  以人搜人
                </div>
                <div
                  class="item-button"
                  @click="faceSearchFaceHander(itemType)"
                >
                  <img src="@/assets/images/clueManage/findFace.png" />
                  以脸搜脸
                </div>
                <div class="item-button" @click="$gotoSearchCar(itemType)">
                  <!-- <i
                    class="h-icon-car"
                    style="
                      font-size: 24px;
                      margin-left: -4px;
                      margin-right: 1px;
                    "
                  ></i> -->
                  <img src="@/assets/images/clueManage/findCar.png" alt="">
                  以车搜车
                </div>
                <div class="item-button" @click="goClueSearch(itemType)">
                  <img src="@/assets/images/clueManage/clue.png" />
                  周边线索
                </div>
                <div class="item-button" @click="goDeleteClue(itemType.id)">
                  <i
                    class="h-icon-delete"
                    style="
                      font-size: 24px;
                      margin-left: -4px;
                      margin-right: 1px;
                    "
                  ></i>
                  删除线索
                </div>
              </div>
            </div>
          </div>
        </clue-manage-card-list-item>
      </div>
      <transition name="fade">
        <div
          class="car-model-item-right-moreButton"
          v-if="
            !openMoreFlag &&
            (itemData.clueCount > 6 ||
              (sliceCarListOpen && itemData.clueCount >= 5))
          "
          @click="readMore"
        >
          <i class="h-icon-angles_right_sm"></i>
        </div>
      </transition>
      <div
        class="car-model-item-right-wrapWhole"
        v-if="openMoreFlag"
        @click="swapWhole"
      >
        收起全部 <i></i>
      </div>
    </div>
    <transition name="fade">
      <div
        class="car-model-item-delete"
        v-if="deleteFlag"
        title="删除分组"
        @click="deleteGroup(itemData.bikeLabel, itemData.bikeCode)"
      >
        <i class="h-icon-delete"></i>
      </div>
    </transition>
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
import clueManageCardListItem from "./clueModelitemCard";
import EditRemarkPane from "./EditRemarkPane.vue";
import ClueDetailDialog from "@/components/photo-details-dialog/clue-detail-dialog";
import groupDialog from "@/components/groupDialog";
import Clipboard from "clipboard";
import helper from "@/helper";
import api from "@/api";
import rest from "@/rest";
import Bus from "@/bus";

export default {
  name: "carModelItem",
  data() {
    return {
      deleteFlag: false,
      openMoreFlag: false,
      readMoreFetchTimer: false,
      page: {
        pageNo: 1,
        pageSize: 18,
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
      sliceCarListOpen: false,
    };
  },
  components: {
    clueManageCardListItem,
    ClueDetailDialog,
    EditRemarkPane,
  },
  props: {
    carLabelItemData: {
      type: [Array, Object],
      default: () => {
        return [];
      },
    },
    itemData: {
      type: Object,
      default: {},
    },
    humanId: {
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
  mounted() {
    Bus.$on("sliceCarListOpen", () => {
      this.sliceCarListOpen = true;
      !this.openMoreFlag &&
        this.$set(
          this.itemData,
          "clueInfoDOList",
          this.itemData.clueInfoDOList.slice(0, 4)
        );
      Bus.$emit("picCompareFlag", true);
    });

    Bus.$on("sliceCarListClose", () => {
      this.sliceCarListOpen = false;
      !this.openMoreFlag && Bus.$emit("refreshCarModelGroup");
      Bus.$emit("picCompareFlag", false);
    });
  },
  methods: {
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
    getItemRect(item) {
      return {
        top: (item && item.y) || 0,
        left: (item && item.x) || 0,
        width: (item && item.width) || 0,
        height: (item && item.height) || 0,
      };
    },
    sendToCompare(type, item) {
      Bus.$emit("sendPicToCompare", {
        type,
        item,
      });
    },
    deleteGroup(bikeLabel, bikeCode) {
      this.$confirm("确定删除该分组?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          rest
            .post(api.clueManage.deleteGroup, {
              humanId: this.humanId,
              bikeLabel,
              bikeCode,
            })
            .done((res) => {
              if (helper.isSuccess(res)) {
                this.$message.success("删除成功");
                this.$emit("refresh");
              } else {
                this.$message.error(res.msg);
              }
            });
        })
        .catch(() => {});
    },
    handleScroll(e) {
      if (this.readMoreFetchTimer) {
        return;
      }
      if (
        e.srcElement.scrollTop + e.srcElement.offsetHeight >
        e.srcElement.scrollHeight - 100
      ) {
        this.readMoreFetchTimer = true;
        this.page.pageNo++;
        rest
          .post(api.clueManage.bikeModelQueryMore, {
            humanId: this.humanId,
            startTime: helper.dateFormat(
              "YYYY-mm-dd HH:MM:SS",
              new Date(this.startTime)
            ),
            endTime: helper.dateFormat(
              "YYYY-mm-dd HH:MM:SS",
              new Date(this.endTime)
            ),
            pageNo: this.page.pageNo,
            pageSize: this.page.pageSize,
            bikeLabel: this.itemData.bikeLabel,
            bikeCode: this.itemData.bikeCode,
          })
          .done((res) => {
            if (helper.isSuccess(res)) {
              this.$set(
                this.itemData,
                "clueInfoDOList",
                this.itemData.clueInfoDOList.concat(res.data.list)
              );
              if (
                !(res.data && res.data.list != null && res.data.list.length)
              ) {
                this.page.pageNo--;
              }
              setTimeout(() => {
                this.readMoreFetchTimer = false;
              }, 200);
            } else {
              that.$message.error(res.msg);
              setTimeout(() => {
                this.readMoreFetchTimer = false;
              }, 200);
            }
          });
      }
    },
    readMore() {
      this.openMoreFlag = true;
      rest
        .post(api.clueManage.bikeModelQueryMore, {
          humanId: this.humanId,
          startTime: helper.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            new Date(this.startTime)
          ),
          endTime: helper.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            new Date(this.endTime)
          ),
          pageNo: 1,
          pageSize: this.page.pageSize,
          bikeLabel: this.itemData.bikeLabel,
          bikeCode: this.itemData.bikeCode,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.$set(this.itemData, "clueInfoDOList", res.data.list);
            this.$nextTick(() => {
              this.sliceCarListOpen && Bus.$emit("picCompareFlag", true);
            });
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    swapWhole() {
      this.openMoreFlag = false;
      this.$set(
        this.itemData,
        "clueInfoDOList",
        this.sliceCarListOpen
          ? this.itemData.clueInfoDOList.slice(0, 4)
          : this.itemData.clueInfoDOList.slice(0, 6)
      );
    },
    //以人搜人
    bodySearchHander(item) {
      const { protocol, hostname, port } = location;
      let temp = item.picUrl;
      temp = protocol + "//" + hostname + "/ngx/proxy?i=" + btoa(temp);
      if (top === window) {
        let path =
          protocol +
          "//" +
          hostname +
          ":" +
          port +
          "/ibody-web/index.do#personSearch?imageUrl=" +
          temp;
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
          "/ibody-web/index.do#personSearch?" +
          "imageUrl=" +
          temp,
        param: "",
        name: "以人搜人",
      });
    },
    //以脸搜脸
    faceSearchFaceHander(item) {
      let { protocol, hostname, port } = location;
      let temp = item.picUrl;
      let linkParam = "faceUrl=" + temp;
      if (top === window) {
        let path =
          protocol +
          "//" +
          hostname +
          ":" +
          port +
          "/iface-web/index.do#snapshot?faceUrl=" +
          temp;
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
            idCard: this.humanId, // 人员 id
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
        name: "周边线索",
        url: `${prefix}/erim-web/#/home/clueSearch?idCard=${this.humanId}&placeAddress=${item.placeAddress}&passTime=${item.passTime}&longitude=${item.longitude}&latitude=${item.latitude}&id=${item.id}`,
        param: ``,
        callback: { func: "", param: {} },
        reload: true,
      });
    },
    // 打开详情弹框
    openClueDetails(list, index, type) {
      this.modal = {
        ...this.modal,
        ...{
          visible: true,
          pics: list,
          showIndex: index,
          contentType: type,
        },
      };
    },
    updateList() {
      this.$emit("refresh");
    },
    handleDragLeave() {
      this.itemData.dragFlag = false;
    },
    dragoverVehicle(ele) {
      this.itemData.dragFlag = true;
      ele.preventDefault();
    },
    async handleDrop() {
      if (this.itemData.bikeCode === "0" && this.itemData.bikeLabel === "0") {
        this.$message.warning("已分组的线索不允许移动到未分组中!");
        this.$set(this.itemData, "dragFlag", false);
        return;
      }
      let dragGroupMes = sessionStorage.getItem("dragGroupMes");
      if (dragGroupMes) {
        dragGroupMes = eval("(" + dragGroupMes + ")");
        if (
          dragGroupMes.bikeLabel === this.itemData.bikeLabel &&
          dragGroupMes.bikeCode === this.itemData.bikeCode
        ) {
          sessionStorage.removeItem("dragGroupMes");
          this.itemData.dragFlag = false;
          return;
        }
        let list = new Set();
        let archiveCode = null;
        let archiveType = 1;
        let ifCancel = false;
        if (dragGroupMes.archiveCode && dragGroupMes.archiveCode !== "null") {
          list.add(dragGroupMes.archiveCode);
          archiveType = 1;
        }
        if (
          this.itemData.clueInfoDOList &&
          this.itemData.clueInfoDOList[0].archiveCode
        ) {
          list.add(
            this.itemData.clueInfoDOList &&
              this.itemData.clueInfoDOList[0].archiveCode
          );
          archiveType = 2;
        }
        this.$set(this.itemData, "dragFlag", false);
        if (list.size === 0) {
          archiveCode = null;
        } else if (list.size === 1) {
          archiveCode = Array.from(list)[0];
        } else {
          await groupDialog
            .show(list)
            .then((res) => {
              // 返回序号
              if (typeof res === "number") {
                archiveCode = Array.from(list)[res];
                archiveType = res + 1;
              }
            })
            .catch(() => {
              ifCancel = true;
              list = null;
            });
        }
        sessionStorage.removeItem("dragGroupMes");
        if (!ifCancel) {
          let judgeBikeLabel =
            dragGroupMes.bikeLabel === "0" ? null : dragGroupMes.bikeLabel;
          let judgeBikeCode =
            dragGroupMes.bikeCode === "0" ? null : dragGroupMes.bikeCode;
          rest
            .post(api.clueManage.updateGroup, {
              humanId: this.humanId,
              oldBikeLabel: judgeBikeLabel,
              oldBikeCode: judgeBikeCode,
              archiveCode,
              bikeLabel: this.itemData.bikeLabel || "",
              bikeCode: this.itemData.bikeCode || "",
              archiveType,
              vehicleColorNote: this.itemData.vehicleColorNote,
              vehicleFeatureNote: this.itemData.vehicleFeatureNote,
              otherNote: this.itemData.otherNote,
            })
            .done((res) => {
              if (helper.isSuccess(res)) {
                this.$message.success("合并成功");
                this.$emit("refresh");
              } else {
                this.$message.error(res.msg);
              }
            });
        }
      } else {
        this.itemData.dragFlag = false;
        Bus.$emit("dropCarModel", this.itemData);
      }
    },
    // go 周边案件页面
    goCaseIntelligence(item) {
      const { protocol, hostname, port } = location;
      let prefix = `${protocol}//${hostname}`;
      if (port) {
        prefix += `:${port}`;
      }
      if (top === window) {
        let routeData = this.$router.resolve({
          path: "/home/caseIntelligence",
          query: {
            idCard: this.humanId, // 人员 id
            id: item.id, // 线索 id
            passTime: item.passTime,
          },
        });
        window.open(routeData.href, "_blank");
        return false;
      }
      top.window.goToApp({
        name: "周边案件",
        url: `${prefix}/erim-web/#/home/caseIntelligence?idCard=${this.humanId}&id=${item.id}&passTime=${item.passTime}`,
        param: ``,
        callback: { func: "", param: {} },
        reload: true,
      });
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
                that.$emit("refresh");
                if (that.openMoreFlag) {
                  that.readMore();
                }
              } else {
                that.$message.error(res.msg);
              }
            });
        })
        .catch((_) => {});
    },
    dragGroupStart() {
      let archiveCode =
        this.itemData.clueInfoDOList &&
        this.itemData.clueInfoDOList[0].archiveCode;
      sessionStorage.setItem(
        "dragGroupMes",
        `{ "bikeCode": "${this.itemData.bikeCode}", "bikeLabel": "${this.itemData.bikeLabel}", archiveCode: "${archiveCode}"}`
      );
    },
    refreshCarGroup(data) {
      this.$emit("changeRemarkData", data);
    },
  },
};
</script>

<style lang="scss">
.car-model-item-left-img .edit-icon {
  top: -40px !important;
}
.car-model-item-right .item-out {
  margin-top: 12px !important;
  margin-right: 0 !important;
  margin-left: 12px !important;
  margin-bottom: 0 !important;
}
</style>
<style lang="scss" scoped>
.car-model-item {
  width: 98%;
  height: 264px;
  margin: 16px 16px 0 16px;
  background: #ffffff;
  border: 1px solid #d9e9ff;
  box-shadow: 0 3px 10px 0 rgba(130, 143, 153, 0.44);
  position: relative;
  display: flex;
  transition: all 0.5s;
  cursor: pointer;
  &-left {
    width: 192px;
    height: 100%;
    background: rgba(187, 191, 196, 0.1);
    &-title {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      &-question {
        height: 26px;
        width: 97px;
        text-indent: 30px;
        background: #ffeaea;
        border-radius: 2.4px;
        line-height: 26px;
        position: relative;
        color: rgba(255, 0, 0, 0.7);
        font-weight: 600;
        margin: 6px 16px 0;
        &-code {
          position: absolute;
          top: 0;
          left: 0;
          width: 22px;
          height: 100%;
          text-indent: 0;
          text-align: center;
          background: #ff3333;
          font-family: PingFangSC-Semibold;
          font-size: 14.4px;
          color: #ffffff;
          letter-spacing: 0;
        }
      }
      &-own {
        height: 26px;
        width: 97px;
        text-indent: 30px;
        background: #edf4ff;
        border-radius: 2.4px;
        position: relative;
        line-height: 26px;
        color: #4a90e2;
        font-weight: 600;
        margin: 6px 16px 0;
        &-code {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 22px;
          text-indent: 0;
          background: #4a90e2;
          text-align: center;
          font-family: PingFangSC-Semibold;
          font-size: 14.4px;
          color: #ffffff;
          letter-spacing: 0;
        }
      }
      &-unGroup {
        height: 26px;
        width: 97px;
        text-align: center;
        background: #f4f4f4;
        border-radius: 2.4px;
        line-height: 26px;
        position: relative;
        color: #898989;
        font-weight: 600;
        margin: 6px 16px 0;
        &::before {
          content: "";
          display: block;
          position: absolute;
          width: 4px;
          height: 30px;
          top: -2px;
          left: -2px;
          background: #b6b6b6;
          border-radius: 2px;
        }
        &::after {
          content: "";
          display: block;
          position: absolute;
          width: 4px;
          height: 30px;
          top: -2px;
          right: -2px;
          background: #b6b6b6;
          border-radius: 2px;
        }
      }
      > span {
        margin-top: 6px;
        display: inline-block;
        width: 3.5em;
        height: 1.5em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
      }
    }
    &-img {
      width: 100%;
      height: 160px;
      margin: 10px auto;
    }
  }
  &-right {
    width: calc(100% - 192px);
    height: 100%;
    display: flex;
    position: relative;
    &-list {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;

      padding-bottom: 10px;
    }
    &-moreButton {
      width: 32px;
      height: 240px;
      border: 1px rgba(56, 72, 77, 0.37) solid;
      background: rgba(187, 191, 196, 0.1);
      border-radius: 4px;
      margin: 12px 8px 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      > i {
        font-size: 24px;
      }
      &:hover {
        border: 1px #4592f1 solid;
        background: rgba(173, 210, 255, 0.3);
        > i {
          color: #4592f1;
        }
      }
    }
    &-wrapWhole {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 40px;
      background: rgba(131, 184, 249, 0.35);
      text-align: center;
      line-height: 40px;
      border: 1px solid rgba(47, 137, 247, 1);
      color: rgba(47, 137, 247, 1);
      cursor: pointer;
      > i {
        width: 0;
        height: 0;
        border: 10px solid;
        position: absolute;
        top: -48%;
        left: calc(50% - 10px);
        border-color: transparent transparent rgba(131, 184, 249, 0.35)
          transparent;
        z-index: 10002;
      }
    }
  }
  &-delete {
    position: absolute;
    top: calc(50% - 16px);
    right: -16px;
    width: 32px;
    height: 32px;
    border: 1px solid white;
    overflow: hidden;
    background: white;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    > i {
      width: 32px;
      height: 32px;
      font-size: 28px;
      line-height: 32px;
      text-align: center;
    }
    &:hover {
      border: 1px solid #d9e9ff;
      > i {
        background-image: linear-gradient(180deg, #99d1fd 0%, #60a4f9 100%);
        color: white;
      }
    }
  }
  &.active {
    height: 604px;
    .car-model-item-right .item-out {
      margin-top: 12px;
      margin-right: 0 !important;
      margin-left: 18px !important;
    }
    .car-model-item-right-list {
      height: calc(100% - 50px);
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s linear;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
.text-ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.car-model-item-right-wrapWhole::before {
  content: "";
  width: 0;
  height: 0;
  border: 10px solid;
  position: absolute;
  top: -52%;
  left: calc(50% - 10px);
  border-color: transparent transparent rgba(47, 137, 247, 1) transparent;
  z-index: 10000;
}
.car-model-item-right-wrapWhole::after {
  content: "";
  width: 0;
  height: 0;
  border: 10px solid;
  position: absolute;
  top: -48%;
  left: calc(50% - 10px);
  border-color: transparent transparent #fff transparent;
  z-index: 10001;
}
.item-button {
  width: 90px;
  height: 30px;
  margin: 1px;
  color: #4d4d4d;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: rgba(222, 222, 222, 0.5);
  }
  > img {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
}
.copyIcon:hover {
  color: #0cb3ff;
}
</style>
