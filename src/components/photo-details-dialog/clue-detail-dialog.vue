<!--
 * @Descripttion: 线索详情对话框
 * @version:
 * @Author: someone
 * @Date: 2020-10-12 13:11:59
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-05-17 14:22:57
 -->
<template>
  <el-dialog
    title="线索详情"
    :visible="visible"
    :area="[1324, 710]"
    top="middle"
    class="clue-dialog"
    :close-on-press-escape="true"
    :close-on-click-modal="true"
    @close="close"
  >
    <div class="clue-preview">
      <div>
        <!--轮播图切换-->
        <!--
          view-data.sync：h-img-view 组件 view-data 属性（工具集中点击放大、缩小）
        -->
        <h-img-carousel
          class="clue-preview-carousel"
          theme="dark"
          :data="list"
          :view-data.sync="viewData"
          :current-index.sync="currentIndex"
        >
          <div
            slot="item"
            slot-scope="{ item }"
            class="clue-preview-carousel-item"
          >
            <!--图片预览、图片矩形框-->
            <!--
              item.$$index：其实就是 index（把 index 变成了 item 的属性）
              enable-draw：手动标注
              data：每一条数据
              auto-mark-request：智能标注
              view-data.sync：h-img-view 组件 view-data 属性（工具集中点击放大、缩小）
            -->
            <clue-detail-dialog-preview
              :ref="`preview_${item.$$index}`"
              :itemData="list[item.$$index]"
              :enable-draw="enableDrawByHand"
              :auto-mark-request="_imageDetection"
              :view-data.sync="viewData"
              :content-type="contentType"
              :upload="upload"
              :visible="visible"
              @drawComplete="handleDrawComplete"
            />
          </div>
        </h-img-carousel>
        <!--工具集-->
        <h-img-snippets-btn-group
          theme="light-gray"
          class="clue-btnGroup"
          style="
            border-bottom: #e6e6e6 1px solid;
            border-top: #e6e6e6 1px solid;
          "
        >
          <el-button
            class="handle-note"
            @click="enableDrawByHand = !enableDrawByHand"
            >手动标注</el-button
          >
          <div class="btn-divider"></div>
          <h-img-snippets-zoom
            :scale="viewDataRatio"
            @zoom-in="$refs[`preview_${currentIndex}`].zoomIn()"
            @zoom-out="$refs[`preview_${currentIndex}`].zoomOut()"
            v-if="contentType == 'photo'"
          />
          <div
            class="btn-divider"
            style="margin-right: 0; margin-left: -4px"
          ></div>
          <el-button
            class="suit-size"
            @click="$refs[`preview_${currentIndex}`].resetZoom()"
            v-if="contentType == 'photo'"
            >&nbsp;适当尺寸</el-button
          >
          <div class="btn-divider" style="margin-right: 0"></div>
          <el-button
            class="find-people"
            @click="bodySearchHander(list[currentIndex])"
            >以人搜人</el-button
          >
          <div class="btn-divider" style="margin-right: 0"></div>
          <el-button
            class="find-face"
            @click="faceSearchFaceHander(list[currentIndex])"
            >以脸搜脸</el-button
          >
          <div class="btn-divider" style="margin-right: 0"></div>
          <el-button
            icon="h-icon-car"
            @click="$gotoSearchCar(list[currentIndex])"
            >以车搜车</el-button
          >
          <!--<el-button @click="cover" v-if="contentType == 'photo'">
        设置封面
      </el-button>
       <el-button v-if="0" @click="$refs[`preview_${currentIndex}`].smartMark()">
        智能标注
      </el-button>
      <el-button v-if="0">
        <i class="h-icon-edit"></i>
        播放视频
          </el-button>-->
        </h-img-snippets-btn-group>
      </div>
      <!--右侧基本信息-->
      <clue-detail-dialog-form
        ref="clueDetailDialogForm"
        :model="list[currentIndex]"
        :form-type="formType"
        :content-type="contentType"
        :startTime="startTime"
        :endTime="endTime"
      />
    </div>

    <div>
      <div class="album-title">
        共
        <span>{{ list.length }}</span>
        张图片
      </div>
      <!--相册-->
      <h-album
        ref="album"
        class="clue-album"
        theme="light"
        :shadow="false"
        :data="list"
        :current-index.sync="currentIndex"
      >
        <template slot="item" slot-scope="{ item }">
          <video
            src="http://10.67.166.90:6201/jiachenglu330/5e4752a4-c7fc-4257-97bd-9fe6cf67a17a?AccessKeyId=96sPpMuN41Z03VmoQz8I6w4W9A18t2Ow&Expires=2000000000&Signature=c38aJDAZScxYYGjmf9bwlZvQsD0="
            controls="controls"
            class="w100"
            style="width: 72px; height: 72px"
            v-if="contentType == 'video'"
          >
            您的浏览器不支持 video 标签。
          </video>
          <h-img-view
            :src="item.picUrl"
            mode="fill"
            :title="item.name"
            empty-size="xs"
          />
          <!--视频播放按钮-三角形-->
          <span v-if="item.type === 1" class="clue-video-play"
            >频播放按钮-三角形</span
          >
          <div v-if="item.rect" class="clue-image-bottom">已标注</div>
        </template>
        <template slot="prev">
          <!-- @click.stop="handleLeftClick" -->
          <el-button
            icon="h-icon-angle_left"
            :disabled="currentIndex === 0"
            size="large"
            class="left-button"
          ></el-button>
        </template>
        <template slot="next">
          <!-- @click.stop="handleRightClick" -->
          <el-button
            icon="h-icon-angle_right"
            :disabled="currentIndex === list.length - 1"
            size="large"
            class="right-button"
          ></el-button>
        </template>
      </h-album>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveClueInfo"
        ><p v-show="!saveLoading">保存</p>
        <el-load-icon v-if="saveLoading" style="color: #fff"></el-load-icon
      ></el-button>
      <el-button @click="close">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ClueDetailDialogPreview from "./clue-detail-dialog-preview";
import ClueDetailDialogForm from "./clue-detail-dialog-form";
import { deepClone } from "@hui-pro/utils";
import helper from "@/helper";
import api from "@/api";
import rest from "@/rest";
// import Player from "@/upload/player";

export default {
  name: "ClueDetailDialog",
  components: {
    ClueDetailDialogPreview,
    ClueDetailDialogForm,
  },
  props: {
    visible: {
      // 弹框显隐
      type: Boolean,
      default: false,
    },
    data: {
      // 列表数据
      type: Array,
      default: () => [],
    },
    index: {
      // 当前显示第几个
      type: Number,
      default: 0,
    },
    upload: {
      // 是否是上传
      type: Boolean,
      default: false,
    },
    formType: {
      // 弹框右侧展示哪个表格
      type: String,
      default: "",
    },
    contentType: {
      // 内容类型（图片、视频）
      type: String,
      default: "",
    },
    closeUpdate: {
      type: Boolean,
      default: false,
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
  data() {
    return {
      // 大图轮播（监听 visible：拿到传过来的数据）
      list: [], // 父组件传过来的值，克隆一份
      viewData: {}, // h-img-view 组件 view-data 属性（工具集中点击放大、缩小）
      currentIndex: 0, // 当前显示第几个
      enableDrawByHand: false, // 允许手动标注

      // 工具集
      viewDataRatio: 1, // 放大缩小

      //右侧 form
      imageModelSuccess: true, // 图片模型成功

      isNoted: false,
      saveLoading: false,
      // innerdialogVisible: false,
    };
  },
  watch: {
    // 是否手动标注了
    enableDrawByHand(val) {
      this.isNoted = val;
    },
    // 弹框显隐
    visible(val) {
      if (val) {
        this.list = deepClone(this.data) || []; // 父组件传过来的列表数据，克隆一份
        this.currentIndex = this.index || 0; // 当前显示第几个
        this.enableDrawByHand = false; // 允许手动标注
        if (this.contentType == "photo") {
          setTimeout(() => {
            this.viewDataRatio = this.$refs[
              `preview_${this.currentIndex}`
            ].$refs["view"].viewData.ratio;
          }, 100);
        }
      }
    },
    // 当前显示第几个
    currentIndex(val, oldVal) {
      if (this.contentType == "photo") {
        setTimeout(() => {
          this.viewDataRatio = this.$refs[`preview_${this.currentIndex}`].$refs[
            "view"
          ].viewData.ratio;
          if (this.$refs[`preview_${oldVal}`]) {
            this.$refs[`preview_${oldVal}`].resetZoom();
          }
        }, 0);
        if (val !== oldVal) {
          this.enableDrawByHand = false;
        }
      }
    },
    "viewData.scale"() {
      setTimeout(() => {
        this.viewDataRatio = this.$refs[`preview_${this.currentIndex}`].$refs[
          "view"
        ].viewData.ratio;
      });
    },
  },
  methods: {
    // 关闭弹框
    close() {
      // 如果已经标注，则关闭线索窗口时弹出提示框
      if (this.isNoted) {
        this.$confirm("标注信息未保存，是否退出?", {
          buttons: [
            { name: "返回", type: "default", action: "onConfirm" },
            { name: "退出", type: "primary", action: "onCancel" },
          ],
          type: "question",
        }).then((action) => {
          if (action === "onCancel") {
            // this.$emit("updateList");
            if (this.closeUpdate) {
              this.$emit("updateList", true);
              this.$emit("update:closeUpdate", false);
            }
            this.$emit("update:visible", false);
            this.isNoted = false;
          } else {
          }
        });
      } else {
        // this.$emit("updateList");
        if (this.closeUpdate) {
          this.$emit("updateList", true);
          this.$emit("update:closeUpdate", false);
        }
        this.$emit("update:visible", false);
      }
    },
    // 图片检测-智能标注
    _imageDetection(url) {
      //const { data } = await imageDetection(url);       // 智能检测-调接口拿数据
      const data = {
        face: [
          {
            faceRect: {
              height: 0.308121,
              width: 0.172318,
              x: 0.096771,
              y: 0.250467,
            },
            recommendFaceRect: {
              height: 0.92326,
              width: 0.516953,
              x: 0.0,
              y: 0.0,
            },
            faceMark: {
              leftEye: {
                x: 0.154747,
                y: 0.354569,
              },
              rightEye: {
                x: 0.211852,
                y: 0.322478,
              },
              noseTip: {
                x: 0.157395,
                y: 0.395711,
              },
              leftMouth: {
                x: 0.171886,
                y: 0.462664,
              },
              rightMouth: {
                x: 0.175714,
                y: 0.491248,
              },
            },
            facePose: {
              pitch: 5.985441,
              yaw: 35.381058,
              roll: 17.466366,
            },
          },
          {
            faceRect: {
              height: 0.301465,
              width: 0.168476,
              x: 0.60783,
              y: 0.422977,
            },
            recommendFaceRect: {
              height: 0.902676,
              width: 0.505428,
              x: 0.439354,
              y: 0.097324,
            },
            faceMark: {
              leftEye: {
                x: 0.698784,
                y: 0.508993,
              },
              rightEye: {
                x: 0.709603,
                y: 0.519643,
              },
              noseTip: {
                x: 0.723779,
                y: 0.584991,
              },
              leftMouth: {
                x: 0.699291,
                y: 0.647959,
              },
              rightMouth: {
                x: 0.699291,
                y: 0.647959,
              },
            },
            facePose: {
              pitch: -7.036657,
              yaw: -91.04229,
              roll: -28.86224,
            },
          },
        ],
        human: [
          {
            rect: {
              height: 0.951786,
              width: 0.507937,
              x: 0.020833,
              y: 0.046429,
            },
          },
          {
            rect: {
              height: 0.258929,
              width: 0.162698,
              x: 0.612103,
              y: 0.460714,
            },
          },
        ],
        vehicle: [],
      };
      let rects = [];
      for (const type in data) {
        if (type !== "face") {
          rects = rects.concat(
            data[type].map((item) => ({ ...item.rect, type }))
          );
        }
      }
      return rects;
    },
    // clue-detail-dialog-preview —— 绘画完成
    handleDrawComplete({ url, rect, type }) {
      let _type; // 下划线定义私有变量
      if (type) {
        // 第一次画的时候，此时为 undefined
        const _TYPE = {
          human: "0", // 人
          vehicle: "1", // 车辆
        };
        _type = _TYPE[type];
      } else {
        type =
          this.list[this.currentIndex].archiveLabelVO &&
          this.list[this.currentIndex].archiveLabelVO.archiveTargetVO &&
          this.list[this.currentIndex].archiveLabelVO.archiveTargetVO.type;
      }
      this._imageModel(url, rect, _type);
      if (!this.imageModelSuccess) {
        this.list[this.currentIndex].rect = {
          rect: rect,
          id:
            (this.list[this.currentIndex].rect &&
              this.list[this.currentIndex].id) ||
            null,
          archiveTargetVO: { type: type || "" },
        };
        this.imageModelSuccess = true;
      }
    },
    // 手动标注画好后建模
    _imageModel(url, rect, type) {
      this.imageModelSuccess = false;
      //const { data } = await imageModel(url, JSON.stringify(rect), type);
      this.imageModelSuccess = true;
      // console.log('fdsjfskd');
      // 标注成功，更新数据
      /*this.$set(this.list[this.currentIndex], 'archiveLabelVO', {
                    ...data,
                    id: (this.list[this.currentIndex].archiveLabelVO && this.list[this.currentIndex].archiveLabelVO.id) || null,
                    archiveTargetVO: {type: type || ''}
                });*/
    },
    // 设置封面
    // cover() {},
    // 打开 video
    // openVideo (item) {
    //   const url = item.realDetail;
    //   if (!this.player) this.player = new Player();
    //   if (url) this.player.run(url).listen();
    // },
    // 保存线索信息
    async saveClueInfo() {
      if (!this.saveLoading) {
        this.isNoted = false;
        // let res = [];
        // this.list.forEach(item => {
        //   if (
        //     item.rect &&
        //     typeof item.rect === "object" &&
        //     item.id !== this.$refs.clueDetailDialogForm.formData.id
        //   ) {
        //     // res.push(item);
        //     item.rect = JSON.stringify(item.rect)
        //     rest.post(api.clueDetails.updateClueInfo, item).done(res => {
        //       if (helper.isSuccess(res)) {
        //         this.$message.success("保存成功!");
        //       } else {
        //         this.$message.error(res.msg);
        //       }
        //     });
        //   }
        // });
        await this.$refs.clueDetailDialogForm.saveClueInfo("clueDetailForm");
        this.saveLoading = false;
        if (!this.closeUpdate) this.$emit("updateList");
        this.$emit("update:visible", false);
      }
    },
    // handleLeftClick(e) {
    //   this.$refs.album.$prev();
    // },
    // handleRightClick(e) {
    //   this.$refs.album.$next();
    // }
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
          "/ibody-web/index.do#personSearch",
        param: "imageUrl=" + temp,
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
          "/iface-web/index.do#snapshot",
        param: linkParam,
        name: "以脸搜脸",
      });
    },
  },
};
</script>

<style lang="scss" scope>
.clue-preview {
  width: 100%;
  height: 586px;
  display: flex;
  > div {
    width: 910px;
    display: flex;
    flex-direction: column;
    .clue-preview-carousel {
      flex: 1;
      width: 910px;
      .clue-preview-carousel-item {
        padding: 0 80px;
      }
      .h-img-carousel__prev,
      .h-img-carousel__next {
        border: none;
      }
    }
    .clue-btnGroup {
      width: 910px;
      height: 40px;
      .video-play-icon {
        color: rgba(219, 219, 219, 0.7);
        font-size: 18px;
        vertical-align: -3px;
      }
    }
  }
  .clue-preview-form {
    flex: 1;
    width: 390px;
  }
}
.album-title {
  height: 42px;
  width: 100%;
  line-height: 42px;
  text-indent: 39px;
  font-family: MicrosoftYaHeiUI;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
  letter-spacing: 0;
  > span {
    color: #ec7f12;
  }
}
.clue-album {
  width: 100%;
  .clue-image-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 24px;
    line-height: 24px;
    text-align: center;
    color: #fff;
    background-color: rgba(4, 190, 20, 0.6);
  }
  .clue-video-play {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -21px;
    margin-top: -21px;
    font-size: 42px;
    color: rgba(219, 219, 219, 0.7);
    opacity: 0.5;
  }
}
.clue-dialog .el-dialog__body {
  padding: 0;
}
.clue-dialog.el-dialog__wrapper {
  overflow: hidden;
}
.left-button,
.right-button {
  width: 32px;
  height: 100%;
  border: none;
  background: #eaeaea;
  border-radius: 2px;
}
.find-people {
  background: rgba(0, 0, 0, 0);
  border: none;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  width: 6em;
  &::before {
    content: url(~@/assets/images/clueManage/findPerson.png);
    display: inline-block;
    width: 16px;
    height: 16px;
  }
}
.find-face {
  background: rgba(0, 0, 0, 0);
  border: none;
  display: flex;
  align-items: center;
  padding-left: 0.5rem;
  width: 6em;
  &::before {
    content: url(~@/assets/images/clueManage/findFace.png);
    display: inline-block;
    width: 16px;
    height: 16px;
  }
}
.suit-size {
  background: rgba(0, 0, 0, 0);
  border: none;
  display: flex;
  align-items: center;
  padding-left: 0.3rem;
  width: 6em;
  &::before {
    content: url(~@/assets/images/clueManage/suit-size-icon.png);
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-top: -4px;
  }
}
.handle-note {
  background: rgba(0, 0, 0, 0);
  border: none;
  display: flex;
  align-items: center;
  padding-left: 0.2rem;
  width: 6em;
  &::before {
    content: url(~@/assets/images/clueManage/edit-icon.png);
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-top: -4px;
    margin-right: 0.3em;
  }
}
.btn-divider {
  border-right: 1px solid rgb(188, 188, 188);
  width: 1px;
  height: 20px;
  margin-left: 2px;
  margin-right: -4px;
}
</style>
<style>
.h-img-view--bg-gray {
  background: rgba(0, 0, 0, 0);
}
</style>
