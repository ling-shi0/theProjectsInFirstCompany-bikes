<template>
  <el-dialog
    title="线索详情"
    :visible="visible"
    :area="[1324, 677]"
    top="middle"
    class="clue-dialog-template"
    @close="close"
  >
    <div class="clue-preview">
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
            :data="list[item.$$index]"
            :enable-draw="enableDrawByHand"
            :auto-mark-request="_imageDetection"
            :view-data.sync="viewData"
            @draw-complete="handleDrawComplete"
          />
        </div>
      </h-img-carousel>
      <div v-for="(item, key) in list" :key="key" class="clue-preview-form">
        <template v-if="key === currentIndex">
          <!--右侧基本信息-->
          <!--
                        item：每一条数据
                        enable-draw：手动标注
                        image-model-success：图片模型成功
                        auto-flag：自动标记
                    -->
          <clue-detail-dialog-form
            :ref="`form_${key}`"
            :model="item"
            :enable-draw="enableDrawByHand"
            :image-model-success="imageModelSuccess"
            :auto-flag="autoFlag"
            :form-active-tab="formActiveTab"
            :form-type="formType"
          />
        </template>
      </div>
    </div>
    <!--工具集-->
    <h-img-snippets-btn-group theme="light-gray" class="clue-btnGroup">
      <el-checkbox
        v-if="list[currentIndex] && list[currentIndex].type == 0"
        v-model="enableDrawByHand"
      >
        手动标注
      </el-checkbox>
      <h-img-snippets-zoom
        v-if="list[currentIndex] && list[currentIndex].type == 0"
        :scale="viewDataRatio"
        @zoom-in="$refs[`preview_${currentIndex}`].zoomIn()"
        @zoom-out="$refs[`preview_${currentIndex}`].zoomOut()"
      />
      <el-button
        icon="h-icon-search"
        @click="$refs[`preview_${currentIndex}`].resetZoom()"
      >
        适当尺寸
      </el-button>
      <!-- <el-button>轨迹查询</el-button> -->
      <el-button
        v-if="list[currentIndex] && list[currentIndex].type == 0"
        @click="cover"
      >
        设置封面
      </el-button>
      <el-button
        v-if="list[currentIndex] && list[currentIndex].type == 0"
        @click="$refs[`preview_${currentIndex}`].smartMark()"
      >
        智能标注
      </el-button>
      <el-button
        v-if="list[currentIndex] && list[currentIndex].type == 1"
        icon="h-icon-video"
        @click="openVideo(list[currentIndex])"
      >
        <span class="video-play-icon">频播放按钮-三角形</span>
        播放视频
      </el-button>
    <!-- </h-img-snippets-btn-group> -->
    <!--相册-->
    <h-album
      class="clue-album"
      theme="light-gray"
      :shadow="false"
      :data="list"
      always-center
      :current-index.sync="currentIndex"
    >
      <template slot="item" slot-scope="{ item }">
        <h-img-view
          :src="item.coverUrl"
          mode="fill"
          :title="item.name"
          empty-size="xs"
        />
        <!--视频播放按钮-三角形-->
        <span v-if="item.type === 1" class="clue-video-play"
          >频播放按钮-三角形</span
        >
        <div
          v-if="
            item.archiveLabelVO &&
            item.archiveLabelVO.modelRect &&
            item.type == 0
          "
          class="clue-image-bottom"
        >
          已标注
        </div>
      </template>
    </h-album>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">确 定</el-button>
      <el-button @click="close">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ClueDetailDialogPreview from "./clue-detail-dialog-preview";
import ClueDetailDialogForm from "./clue-detail-dialog-form";
import { deepClone } from "@hui-pro/utils";
import Player from "@/upload/player";

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
      formActiveTab: false, // tab 标识类型
      autoFlag: false, // 自动标记
    };
  },
  watch: {
    // 弹框显隐
    visible(val) {
      if (val) {
        this.list = deepClone(this.data) || []; // 父组件传过来的列表数据，克隆一份
        this.currentIndex = this.index || 0; // 当前显示第几个
        this.enableDrawByHand = false; // 允许手动标注
        setTimeout(() => {
          this.viewDataRatio = this.$refs[`preview_${this.currentIndex}`].$refs[
            "view"
          ].viewData.ratio;
        }, 0);
      }
    },
    // 当前显示第几个
    currentIndex(val, oldVal) {
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
      this.$emit("update:visible", false);
    },
    // 保存
    async save() {
      const vm = this;
      try {
        // 调用 form 里面的方法
        await this.$refs[`form_${this.currentIndex}`][0].validate();
      } catch (e) {
        // this.currentIndex = i;
        this.formActiveTab = true;
        return;
      }
      this.formActiveTab = false;
      try {
        await saveClue(this.list); // 更改后的数据还是保存在该条数据里, 保存的时候提交整个列表
        this.$message({
          type: "info",
          message: "保存成功",
        });
        // 更新父组件中，该子组件中的传参数据（即：visible: false —— 关闭弹框）
        vm.$emit("update:visible", false);
        this.formActiveTab = true;
      } catch (e) {}
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
        this.list[this.currentIndex].archiveLabelVO = {
          rect: rect,
          id:
            (this.list[this.currentIndex].archiveLabelVO &&
              this.list[this.currentIndex].archiveLabelVO.id) ||
            null,
          archiveTargetVO: { type: type || "" },
        };
        this.imageModelSuccess = true;
        this.autoFlag = false;
      }
    },
    // 手动标注画好后建模
    _imageModel(url, rect, type) {
      this.imageModelSuccess = false;
      //const { data } = await imageModel(url, JSON.stringify(rect), type);
      // 调取接口，更新数据
      const data = {
        targetModelData:
          "gSAEEAAC//oCAwMIBgkBAAcCA/kBBv7+AwL8CfcCAwQI/fz7B/n/Av0FCf8P/foBCgcC9QkE+AcEAvn4+Af4A/n9Avr7/gL+CPgABfv7AwoB/wIA+QIB+v8JCAEB/AX8AgUBAP36CwsGA//8/QUG+wb/B/YK9AUD/v8DBfz5Awf//foEBQQE+wEB/gT2AAAACg39+fsJ9gf2BwACBgXw+QD4AwACAAb5B/0B+/wBAgD5+QUIAgT4CQQEAv0CBAcJAQQC9wv7AfoFAvcF/vz+Avb3//4E+v8ABfz9AQD9+QIFAv/8/QUC/P0FAgH3AQYGAAP/+f3+/vn8//7//AX6EQj9/v//9/oDCgMJBvz//gsI/QIF+An/Awn2//kF+gH4Cfz+BPoJ/AH+AQP8Bf0NDPz+/wr5/P8L+P789AYB9wb/Av0CCPr8+QP9BAUBBvb6+fn9/P4N+fwHAfv9Cf8I+QIEA/zzAwAACvsHAv36+wT9B/39+f8D+AAEAf8A//4A9gIM/wMK/gUE//sD+wL/+wH5+AT+CP3+CQH7//cECgUA8QUBBf78///5/v79+//8Awv/+f32+AL7AwcGBAIJAQEJ/QQD/P7u+wgC+wT6A/X+AAPwBgT9Av0D+Qv7AfwCA/0P+AIM/ggHAQb///sE/gICAPr5A/sI+QEDAAEE///9Bv0EAAQ=",
        ageGroup: "young",
        gender: "female",
        glass: "no",
        bag: "no",
        hat: "yes",
        mask: "no",
        jacketType: "shortSleeve",
        trousersType: "longTrousers",
        hairStyle: "longHair",
        jacketColor: "white",
        trousersColor: "gray",
        ride: "no",
        things: "no",
        cyclingType: null,
        cyclingPersonNumber: null,
        rect: {
          height: 0.854762,
          width: 0.431425,
          x: 0.388815,
          y: 0.07619,
        },
      };

      this.imageModelSuccess = true;
      this.autoFlag = true;
      // 标注成功，更新数据
      this.$set(this.list[this.currentIndex], "archiveLabelVO", {
        ...data,
        id:
          (this.list[this.currentIndex].archiveLabelVO &&
            this.list[this.currentIndex].archiveLabelVO.id) ||
          null,
        archiveTargetVO: { type: type || "" },
      });
    },
    // 设置封面
    cover() {},
    // 打开 video
    openVideo(item) {
      const url = item.realDetail;
      if (!this.player) this.player = new Player();
      if (url) this.player.run(url).listen();
    },
  },
};
</script>

<style lang="scss" scope>
.clue-preview {
  display: flex;
  .clue-preview-carousel {
    width: 910px;
    .clue-preview-carousel-item {
      padding: 0 80px;
    }
  }
  .clue-preview-form {
    flex: 1;
    // margin-left: 10px;
    width: 400px;
  }
}

.clue-btnGroup {
  width: 910px;
  .video-play-icon {
    color: rgba(219, 219, 219, 0.7);
    font-size: 18px;
    vertical-align: -3px;
  }
}

.clue-album {
  height: 88px;
  width: 910px;
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

.clue-dialog-template.el-dialog__wrapper {
  overflow: hidden;
}
</style>
