<!--
 * @Descripttion: 线索管理-中间卡片列表内容
 * @version:
 * @Author: someone
 * @Date: 2020-10-15 19:15:51
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-01-05 15:56:05
 -->
<template>
  <el-scrollbar
    ref="scrollbar"
    class="clueManage-card-list"
    overflow-y="auto"
    @on-scrolling-y="handleScroll"
    @on-scrollbar-y="handleScrollBar"
  >
    <div class="clueManage-main-content-footer">
      <div
        v-for="itemMonth in clueManageMainContentFooter"
        :key="itemMonth.showName"
      >
        <div class="title por mb5">
          {{ itemMonth.showName.substr(0, 4) }}
          <div
            class="month fs12 color_333 pl5 por cup"
            @click="handleArrowClick(itemMonth)"
          >
            <p>{{ itemMonth.showName.substr(5, 2) }}月</p>
            <div
              :class="['iconfont arrow fs24', itemMonth.show ? '' : 'active']"
            >
              &#xf98b;
            </div>
          </div>
        </div>
        <transition name="heightShow">
          <div v-show="itemMonth.show">
            <div
              class="clueManage-main-content-footer-listIn-info pl5 pr5"
              v-if="itemMonth.list.length > 0"
            >
              <h2 class="fs12 color_666 fw_n pb5 pl5 pr5"></h2>
              <div class="pl10" style="display: flex; flex-wrap: wrap">
                <clue-manage-card-list-item
                  v-for="(itemType, indexType) in itemMonth.list"
                  :key="indexType"
                  :hasAddToClue="0"
                  :itemFlag="itemType.flag"
                  @flagChange="itemType.flag = !itemType.flag"
                  @dragstart.native="itemType.flag = true"
                  @sendToCompare="
                    (type) => {
                      sendToCompare(type, itemType);
                    }
                  "
                >
                  <div slot="img">
                    <div
                      @click="
                        openClueDetails(itemMonth.list, indexType, 'photo')
                      "
                    >
                      <div v-if="itemType.picUrl" style="position: relative">
                        <h-img-view
                          :src="itemType.picUrl"
                          mode="fill"
                          class="wh100 item_in_img"
                          style="pointer-events: none"
                        />
                        <h-img-snippets-rect
                          v-if="itemType.rect"
                          :rect="getItemRect(JSON.parse(itemType.rect))"
                        />
                      </div>
                      <img
                        src="@/assets/images/personList/head_sex_01.png"
                        class="wh100 item_in_img"
                        v-else
                      />
                    </div>
                  </div>
                  <div slot="info" style="height: 100%; width: 100%">
                    <div
                      style="
                        display: flex;
                        flex-direction: column;
                        justify-content: space-around;
                        height: 100%;
                        width: 100%;
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
                            {{
                              itemType.passTime
                                ? itemType.passTime.substr(5)
                                : "暂无"
                            }}
                          </div>
                        </div>
                        <div>
                          <el-popover
                            ref="popover"
                            placement="right"
                            width="330"
                            trigger="click"
                            @show="
                              itemType.bikeLabel
                                ? (bikeLabel = itemType.bikeLabel)
                                : (bikeLabel = '1')
                            "
                          >
                            <div
                              class="popover-normal"
                              :class="activePopover ? 'active' : ''"
                            >
                              <div style="border-bottom: 1px solid #ebebeb">
                                <el-radio-group v-model="bikeLabel">
                                  <el-radio :label="'1'">可疑车辆</el-radio>
                                  <el-radio :label="'2'">自用车辆</el-radio>
                                </el-radio-group>
                              </div>
                              <div class="popover-normal-content">
                                <div style="width: 90px; height: 130px">
                                  <p>
                                    创建{{
                                      bikeLabel === "1"
                                        ? "可疑车辆"
                                        : "自用车辆"
                                    }}
                                  </p>
                                  <div
                                    style="
                                      border: 1px dashed rgb(204, 204, 204);
                                      width: 88px;
                                      height: 88px;
                                      margin-top: 1rem;
                                      display: flex;
                                      flex-direction: column;
                                      justify-content: center;
                                      align-items: center;
                                      cursor: pointer;
                                    "
                                    @click="
                                      addCarClassify(
                                        itemType,
                                        null,
                                        bikeLabel === '1' ? 1 : 3,
                                        bikeLabel
                                      )
                                    "
                                  >
                                    <i class="h-icon-add fs24"></i>
                                    <p>新增车辆</p>
                                  </div>
                                </div>
                                <div
                                  style="
                                    height: 130px;
                                    width: 200px;
                                    margin-left: 0.5rem;
                                  "
                                >
                                  <p>
                                    添加到已有分组 ({{
                                      (bikeLabel === "1"
                                        ? suspiciousCarList
                                        : normalCarList
                                      ).length
                                    }})
                                  </p>
                                  <div
                                    class="popover-normal-content-pics"
                                    style="position: relative"
                                  >
                                    <ul>
                                      <li
                                        style="margin-left: 2px"
                                        v-for="item in bikeLabel === '1'
                                          ? suspiciousCarList
                                          : normalCarList"
                                        :key="item.bike_code"
                                        @click="
                                          addCarClassify(
                                            itemType,
                                            item,
                                            bikeLabel === '1' ? 2 : 4,
                                            bikeLabel
                                          )
                                        "
                                      >
                                        <el-tooltip placement="bottom">
                                          <div slot="content">
                                            <img
                                              :src="item.pic_url[0]"
                                              style="
                                                width: 144px;
                                                height: 144px;
                                              "
                                              v-if="item.pic_url"
                                            />
                                          </div>
                                          <img
                                            :src="item.pic_url[0]"
                                            :style="
                                              itemType.bikeCode ===
                                                item.bike_code &&
                                              bikeLabel === itemType.bikeLabel
                                                ? 'width:56px; height:56px;border: 2px #2080f7 solid;'
                                                : 'width:56px; height:56px;'
                                            "
                                            v-if="item.pic_url"
                                          />
                                        </el-tooltip>
                                      </li>
                                    </ul>
                                    <div
                                      style="
                                        height: 23px;
                                        width: 180px;
                                        position: absolute;
                                        bottom: 0;
                                      "
                                      v-if="
                                        (bikeLabel === '1'
                                          ? suspiciousCarList
                                          : normalCarList
                                        ).length > 3
                                      "
                                    >
                                      <el-button
                                        type="link"
                                        style="
                                          height: 20px;
                                          width: 6rem;
                                          margin-left: 55px;
                                        "
                                        @click="activePopover = !activePopover"
                                      >
                                        {{
                                          activePopover
                                            ? "收起更多"
                                            : "展开更多"
                                        }}
                                        <i
                                          :class="
                                            activePopover
                                              ? 'h-icon-angles_up_sm'
                                              : 'h-icon-angles_down_sm'
                                          "
                                        ></i>
                                      </el-button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div
                              v-if="itemType.bikeStatus"
                              :class="
                                itemType.bikeStatus === '1'
                                  ? 'icon-question'
                                  : 'icon-ownuse'
                              "
                              :style="
                                itemType.iconClick
                                  ? itemType.bikeStatus === '1'
                                    ? 'border: 1px #ff3333 solid;'
                                    : 'border: 1px #4a90e2 solid;'
                                  : ''
                              "
                              @click="itemType.iconClick = true"
                              slot="reference"
                            >
                              <div>{{ itemType.bikeCode }}</div>
                              <div>
                                {{
                                  itemType.bikeStatus === "1" ? "可疑" : "自用"
                                }}
                              </div>
                            </div>
                            <div
                              v-else
                              class="icon-unarray"
                              slot="reference"
                              :style="
                                itemType.iconClick
                                  ? 'border: 1px #b6b6b6 solid;'
                                  : ''
                              "
                              @click="itemType.iconClick = true"
                            >
                              <div>分组</div>
                              <div>
                                <i class="h-icon-angle_right"></i>
                              </div>
                            </div>
                          </el-popover>
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
                          title="抓拍地点"
                          style="font-size: 24px"
                        ></i>
                        <div :title="itemType.placeAddress">
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
                        <div
                          :title="itemType.archiveCode"
                          style="font-size: 12px"
                        >
                          {{ itemType.archiveCode || "暂无案件编号" }}
                        </div>
                        <i
                          class="h-icon-copy fs20 por copy cup copyIcon"
                          :data-clipboard-text="itemType.archiveCode"
                          style="font-size: 24px; margin-left: 2px"
                          title="点击复制关联案件编号"
                          @click="copyText()"
                          v-if="itemType.archiveCode"
                        ></i>
                      </div>
                    </div>
                  </div>
                  <div slot="overflow">
                    <div style="width: 200px; height: 90px; margin: -5px auto">
                      <div
                        style="
                          height: 65px;
                          display: flex;
                          justify-content: space-around;
                          align-items: space-around;
                          flex-wrap: wrap;
                        "
                      >
                        <div
                          class="item-button"
                          @click="goCaseIntelligence(itemType)"
                        >
                          <img src="@/assets/images/clueManage/archive.png" />
                          周边案件
                        </div>
                        <div
                          class="item-button"
                          @click="bodySearchHander(itemType)"
                        >
                          <img
                            src="@/assets/images/clueManage/findPerson.png"
                          />
                          以人搜人
                        </div>
                        <div
                          class="item-button"
                          @click="faceSearchFaceHander(itemType)"
                        >
                          <img src="@/assets/images/clueManage/findFace.png" />
                          以脸搜脸
                        </div>
                        <div
                          class="item-button"
                          @click="$gotoSearchCar(itemType)"
                        >
                          <i
                            class="h-icon-car"
                            style="
                              font-size: 24px;
                              margin-left: -4px;
                              margin-right: 1px;
                            "
                          ></i>
                          以车搜车
                        </div>
                        <div
                          class="item-button"
                          @click="goClueSearch(itemType)"
                        >
                          <img src="@/assets/images/clueManage/clue.png" />
                          周边线索
                        </div>
                        <div
                          class="item-button"
                          @click="goDeleteClue(itemType.id)"
                        >
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
                      <!-- <div
                        style="
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          margin: 1px;
                        "
                      >
                        <i
                          class="h-icon-delete"
                          style="font-size: 1.5rem; cursor: pointer"
                          @click="goDeleteClue(itemType.id)"
                        ></i>
                      </div> -->
                    </div>
                  </div>
                </clue-manage-card-list-item>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <periphery-case-map ref="peripheryCaseMap"></periphery-case-map>
    <clue-detail-dialog
      :data="modal.pics"
      :index="modal.showIndex"
      :visible.sync="modal.visible"
      :upload="modal.upload"
      :form-type="modal.formType"
      :content-type="modal.contentType"
      @updateList="updateList"
    />
  </el-scrollbar>
</template>

<script>
import api from "@/api";
import rest from "@/rest";
import helper from "@/helper";
import "@/filters";
import ClueDetailDialog from "@/components/photo-details-dialog/clue-detail-dialog";
import peripheryCaseMap from "../../../../components/map/peripheryCaseMap.vue";
import clueManageCardListItem from "@/components/clueManageCardListItem";
import Clipboard from "clipboard";
import groupDialog from "@/components/groupDialog";
import Bus from "@/bus";
export default {
  name: "clueManageCardList",
  components: {
    ClueDetailDialog,
    peripheryCaseMap,
    clueManageCardListItem,
  },
  props: [
    "arrayType",
    "clueManageMainContentFooter",
    "suspiciousCarList",
    "clueManageMainContentFooterTypeReault",
    "normalCarList",
    "formType",
  ],
  data() {
    return {
      listData: [],
      modal: {
        // clue-detail-dialog 弹框参数
        visible: false, // 弹框显隐
        pics: [], // 列表数据
        showIndex: 0, // 当前显示第几个
        upload: false, // 是否是本地上传的数据
        formType: "clueDetail", // 弹框右侧展示哪个表格
        contentType: null, // 内容类型（图片、视频）
      },
      clueType: 1,
      activePopover: false,
      bikeLabel: "1",
    };
  },
  watch: {
    clueManageMainContentFooter: {
      handler(item) {
        if (item) {
          for (let i in item) {
            item[i].list &&
              item[i].list.forEach((items) => {
                items.bikeStatus = items.bikeLabel;
              });
          }
          this.clueManageMainContentFooter = item;
        }
        // this.listData = helper.deepClone(this.clueManageMainContentFooter);
      },
      deep: true,
    },
  },
  methods: {
    errorImgFn(itemType) {
      itemType.picUrlDefault = true;
    },
    // 打开详情弹框
    openClueDetails(list, index, type) {
      // console.log(list);
      // let tempList = [];
      // list.forEach(item => {
      //   // if (type === "photo") {
      //   tempList = tempList.concat(list);
      //   // } else if (type === "video") {
      //   //   tempList = tempList.concat(item.videoArr);
      //   // }
      // });
      this.modal = {
        ...this.modal,
        ...{
          visible: true,
          pics: list,
          showIndex: index,
          contentType: type,
        },
      };
      // console.log(this.modal);
    },
    // 子组件保存数据时，及时的更新父组件
    updateList() {
      this.$emit("updateList");
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
            that.$emit("init");
            that.$emit("changeType");
          } else {
            that.$message.error(res.msg);
          }
        });
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
            idCard: this.formType.humanId, // 人员 id
            id: item.id, // 线索 id
            passTime: item.passTime,
          },
        });
        window.open(routeData.href, "_blank");
        return false;
      }
      top.window.goToApp({
        name: "周边案件",
        url: `${prefix}/erim-web/#/home/caseIntelligence?idCard=${this.formType.humanId}&id=${item.id}&passTime=${item.passTime}`,
        param: ``,
        callback: { func: "", param: {} },
        reload: true,
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
            idCard: this.formType.humanId, // 人员 id
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
        url: `${prefix}/erim-web/#/home/clueSearch?idCard=${this.formType.humanId}&placeAddress=${item.placeAddress}&passTime=${item.passTime}&longitude=${item.longitude}&latitude=${item.latitude}&id=${item.id}`,
        param: ``,
        callback: { func: "", param: {} },
        reload: true,
      });
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
    // 打开周边案件地图
    openPeripheryCaseMap(item) {
      this.$refs.peripheryCaseMap.init(item);
    },
    // 取消关联案件
    cancelRelation(item) {
      let that = this;
      rest
        .get(api.clueDetails.cancelArchiveCaseRelation, {
          id: item.id,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            that.$message.success("取消成功");
            that.search();
          } else {
            that.$message.error(res.msg);
          }
        });
    },
    /**
     * @description: 全选值改变事件
     */
    handleCheckAllChange(value) {
      if (this.arrayType == "time") {
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
                that.$emit("init");
                that.$emit("changeType");
              } else {
                that.$message.error(res.msg);
              }
            });
        })
        .catch((_) => {});
    },
    // 车辆归类
    async addCarClassify(itemType, item, num, bLabel) {
      itemType.iconClick = false;
      let that = this;
      let arr = [
        [],
        ["1", null], // 新增可疑车辆
        ["1", item && item.bike_code], // 添加到可疑车辆
        ["2", null], // 新增自用车辆
        ["2", item && item.bike_code], // 添加到正常车辆
      ];
      let bikeLabel = arr[num][0];
      let bikeCode = arr[num][1];
      if (
        itemType.bikeCode &&
        bikeCode &&
        itemType.bikeCode === bikeCode &&
        itemType.bikeLabel === bLabel
      ) {
        this.$message.warning("线索已在该分组中!", 3000);
        return;
      }
      let ifCancel = false;
      let archiveCode = null;
      if (item && item.archiveInfo && itemType.archiveCode) {
        if (itemType.archiveCode !== item.archiveInfo.archive_code) {
          archiveCode = item.archiveInfo.archive_code;
          let list = [item.archiveInfo.archive_code, itemType.archiveCode];
          await groupDialog
            .show(list)
            .then((res) => {
              // 返回序号
              if (res && res !== 0) archiveCode = list[res];
            })
            .catch(() => {
              //cancel
              ifCancel = true;
            });
        }
      } else if (item && item.archiveInfo) {
        archiveCode = item.archiveInfo.archive_code;
      } else if (itemType && itemType.archiveCode) {
        archiveCode = itemType.archiveCode;
      }
      if (!ifCancel) {
        let pamars = {
          clueIds: [itemType.id],
          bikeLabel: bikeLabel, // 可疑车辆、自用车辆
          bikeCode: bikeCode,
          humanId: this.formType.humanId,
          archiveCode,
          archiveType: archiveCode
            ? !(item && item.archiveInfo) ||
              archiveCode !== item.archiveInfo.archive_code
              ? 1
              : 2
            : null,
          vehicleColorNote: item.vehicleColorNote,
          vehicleFeatureNote: item.vehicleFeatureNote,
          otherNote: item.otherNote,
        };
        rest.post(api.clueManage.clueGroup, pamars).done((res) => {
          if (helper.isSuccess(res)) {
            that.$message.success("添加成功");
            that.$emit("init");
            that.$emit("changeType");
          } else {
            that.$message.error(res.msg);
          }
        });
      }
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
    handleScroll(e) {
      this.$emit("handleScroll", e);
    },
    handleScrollBar(e) {
      this.$emit("handleScrollBar", e);
    },
    handleArrowClick(itemMonth) {
      itemMonth.show = !itemMonth.show;
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
  },
};
</script>

<style lang="scss" scoped>
.clueManage-main-content-footer {
  padding: 20px 10px 100px;
  .title {
    .month {
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
      & > p {
        padding: 0 30px 0 10px;
      }
      & > .arrow {
        position: absolute;
        top: -2px;
        right: 0;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #77b2fb;
        transition: all 0.2s;
        &.active {
          transform: rotate(-180deg);
        }
      }
    }
  }
  .clueManage-main-content-footer-listIn-info {
    margin-left: 0.6rem;
    h2 {
      position: relative;
      &:before {
        content: "";
        width: 8px;
        height: 8px;
        position: absolute;
        top: 7px;
        left: -10px;
        background: #77b2fb;
        border-radius: 100%;
        box-shadow: 0 0 3px 3px #99ccff;
      }
    }
    border-left: 1px dashed #ccc;
    .clueManage-main-content-footer-listIn-info-item {
      margin-bottom: 10px;
      position: relative;
      width: 228px;
      display: inline-block;
      vertical-align: top;
      .clueManage-main-content-footer-listIn-info-item-flex {
        display: flex;
        .clueManage-main-content-footer-listIn-info-item-flex-icon {
          flex: 0 0 25px;
        }
        .clueManage-main-content-footer-listIn-info-item-flex-con {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .suspicious_car_word {
        line-height: 20px;
      }
      .wrap {
        word-wrap: break-word;
      }
      &:nth-child(8n) {
        margin-right: 0;
      }
      > div {
        border: 1px solid #fff;
      }
      .relation {
        .more {
          .more_in {
            i {
              position: relative;
              top: -4px;
            }
            &:hover {
              background: #e2e2e2;
            }
          }
        }
      }
      .hook_box {
        position: absolute;
        top: 1px;
        right: 0;
        cursor: pointer;
      }
      &:hover {
        > div {
          border: 1px solid #409eff;
          border-radius: 0 0 5px 5px;
          .hook_box {
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
    .case {
      background: rgba(255, 137, 62, 0.16);
      border: 1px solid #ffbc9a;
      border-radius: 5px;
      padding: 5px;
      background: #ffe4c4 url("~@/assets/images/clueManage/case_bg.png")
        no-repeat 5px 2px;
    }

    .clueManage-main-content-footer-listIn-video {
      .clueManage-main-content-footer-listIn-video-item {
        margin-bottom: 10px;
        position: relative;
        width: 228px;
        display: inline-block;
        vertical-align: top;
        .clueManage-main-content-footer-listIn-video-item-flex {
          display: flex;
          .clueManage-main-content-footer-listIn-video-item-flex-icon {
            flex: 0 0 25px;
          }
          .clueManage-main-content-footer-listIn-video-item-flex-con {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .hook_box {
          position: absolute;
          top: 1px;
          right: 0;
          cursor: pointer;
        }
        .clueManage-main-content-footer-listIn-video-item-bd {
          border: 1px solid #f2f2f2;
          &:hover {
            border: 1px solid #409eff;
            .hook_box {
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
    }
    .enclosure {
      border-left: 1px dashed #ccc;
      .enclosure_in {
        //width:calc(100% + 20px);
        .enclosure-in-item-in {
          position: relative;
          border: 1px solid #ccc;
          .hook_box {
            position: absolute;
            top: 0;
            right: 0;
            cursor: pointer;
          }
          &:hover {
            border: 1px solid #409eff;
            .hook_box {
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
    }
    .clueManage-main-content-footer-new {
      border-left: 1px dashed #ccc;
      .clueManage-main-content-footer-new-in {
        //width:calc(100% + 20px);
        > div {
          margin-bottom: 10px;
          > div {
            border: 1px solid #fff;
          }
          .conent {
            border: 1px solid #e2e2e2;
          }
          .bottom {
            display: flex;
            justify-content: space-between;
          }
          .case {
            background: rgba(255, 137, 62, 0.16);
            border: 1px solid #ffbc9a;
            border-radius: 5px;
            padding: 5px;
            background: #ffe4c4 url("~@/assets/images/clueManage/case_bg.png")
              no-repeat 5px 2px;
          }
          .hook_box {
            position: absolute;
            top: 1px;
            right: 7px;
            cursor: pointer;
          }
          &:hover {
            > div {
              border: 1px solid #409eff;
              border-radius: 0 0 5px 5px;
              .hook_box {
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
        .clueManage-main-content-footer-new-in-content {
          .clueManage-main-content-footer-new-in-content-flex {
            display: flex;
            span {
              flex: 0 0 70px;
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
    }
  }
}
.clueManage-card-list.el-scrollbar {
  // ::v-deep {
  //   overflow-y: auto !important;
  // }
}
.icon-question {
  width: 57px;
  height: 22px;
  cursor: pointer;
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
  &:hover {
    border: 1px solid #ff3333;
    border-radius: 2px;
    & > div:first-child {
      background: rgba(255, 51, 51, 0.6);
    }
  }
}
.icon-ownuse {
  width: 57px;
  height: 22px;
  cursor: pointer;
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
  &:hover {
    border: 1px solid #4a90e2;
    border-radius: 2px;
    & > div:first-child {
      background: rgba(74, 144, 226, 0.6);
    }
  }
}
.icon-unarray {
  width: 57px;
  height: 22px;
  cursor: pointer;
  border-radius: 2px;
  display: flex;
  text-align: center;
  position: relative;
  z-index: 2;
  font-family: PingFangSC-Semibold;
  font-size: 12px;
  & > div:first-child {
    width: 40.2px;
    height: 20px;
    color: #898989;
    background: #f4f4f4;
  }
  & > div:last-child {
    width: 16.8px;
    height: 20px;
    background: #b6b6b6;
    color: white;
  }
  &:hover {
    border: 1px solid #b6b6b6;
    border-radius: 2px;
    & > div:last-child {
      background: rgba(182, 182, 182, 0.6);
    }
  }
}
.popover-normal {
  width: 300px;
  height: 172px;
  transition: all 1s;
  &.active {
    height: 292px;
    .popover-normal-content-pics {
      height: 207px;
      > ul {
        height: 162px;
      }
    }
  }
  &-content {
    margin-top: 1rem;
    display: flex;
    color: #4d4d4d;
    &-pics {
      background: #f5f5f5;
      width: 191px;
      height: 88px;
      margin-top: 1rem;
      transition: all 1s;
      > ul {
        width: 180px;
        height: 65px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        transition: all 1s;
      }
    }
  }
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
.hook_box {
  /*放大热区*/
  width: 100%; /*以下开始放大热区*/
  height: 100%;
  text-align: right;
  & > img {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>
