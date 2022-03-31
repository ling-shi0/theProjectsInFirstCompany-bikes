<template>
    <div class="clue-detail-dialog-preview-wrapper">
        <video
            :src="src"
            controls="controls"
            class="w100"
            style="width:750px; height:500px;"
            v-if="contentType == 'video'">
            您的浏览器不支持 video 标签。
        </video>
        <!--图片预览-->
        <!--
            mode：图片填充类型
        -->
        <h-img-view
            ref="view"
            :mode="mode"
            class="clue-detail-dialog-preview"
            bg="gray"
            :cursor="cursor"
            :lock="drawable"
            :view-data.sync="imgViewData"
            :src="src"
            @mousedown="_handleMousedown"
            v-if="contentType == 'photo'">
            <!--<h-img-snippets-rect
                v-for="(item, key) in rectsX"
                class="clue-detail-dialog-preview-rect-item"
                :rect="_computedRect(item)"
            />-->
            <!-- <template v-if="smartMarkable && !drawComplete">
                图片矩形框，返回数据，可能有多个
                <h-img-snippets-rect
                    v-for="(item, key) in rects"
                    :key="key"
                    class="clue-detail-dialog-preview-rect-item"
                    :class="{'is-complete': JSON.stringify(rect) === JSON.stringify(item)}"
                    :rect="_computedRect(item)"
                    @click.native="_selectRect(item)"
                    v-if="0"
                />
            </template> -->
            <!--图片矩形框，单个的时候，自己画-->
            <h-img-snippets-rect
                v-if="drawable || drawComplete"
                class="clue-detail-dialog-preview-rect"
                :class="{'is-complete': drawComplete}"
                :rect="rectProps"
            />
        </h-img-view>
    </div>
</template>

<script>
import { on, off } from '@hui-pro/utils';
import Bus from '@/bus';

export default {
  name: 'ClueDetailDialogPreview',
  props: {
    visible: { // 是否是上传
      type: Boolean,
      default: false
    },
    itemData: { // 每一条数据
      type: Object,
      default: () => ({})
    },
    viewData: { // h-img-view 组件 view-data 属性（工具集中点击放大、缩小）
      type: Object,
      default: null
    },
    upload: { // 是否是上传
      type: Boolean,
      default: false
    },
    enableDraw: { // 手动标注
      type: Boolean,
      default: false
    },
    autoMarkRequest: { // 智能标注
      type: Function,
      default: null
    },
    contentType: { // 内容类型（图片、视频）
      type: String,
      default: ''
    }
  },
  data () {
    return {
      imgViewData: this.viewData,

      // 绘画完成标识
      drawComplete: false,
      rect: this.itemData.rect,

      // 智能标注
      rects: this.itemData.rects
      //smartMarkAnimation:false,
    };
  },
  computed: {
    mode () {
      return 'adjust';// 1 ? 'adjust' : 'contain';
    },
    src () {
      return this.itemData.picUrl;
    },
    drawable () {
      return this.enableDraw;
    },
    smartMarkable () {
      return !this.enableDraw;
    },
    cursor () {
      return (this.drawable ? 'crosshair' : 'grab') + '!important';
    },
    rectProps () {
      if (typeof this.rect == 'string') {
        let rectObj = JSON.parse(this.rect);
        return {
          top: (rectObj && rectObj.y) || 0,
          left: (rectObj && rectObj.x) || 0,
          width: (rectObj && rectObj.width) || 0,
          height: (rectObj && rectObj.height) || 0
        };
      } else {
        return {
          top: (this.rect && this.rect.y) || 0,
          left: (this.rect && this.rect.x) || 0,
          width: (this.rect && this.rect.width) || 0,
          height: (this.rect && this.rect.height) || 0
        };
      }
    }
  },
  watch: {
    // 弹框显隐
    visible (val) {
      if (val) {
        this.rect = {};
      }
    },
    itemData: {
      handler (val) {
        if (val.rect) {
          if (typeof this.rect == 'string') {
            this.rect = JSON.parse(val.rect);
          } else if (typeof this.rect == 'object') {
            this.rect = val.rect;
          } else {
            this.rect = null;
          }
        }
        this.rects = val.rects;
        this.drawComplete = !!this.rect;
      },
      deep: true
    },
    imgViewData (val) {
      this.$emit('update:viewData', val);
    },
    enableDraw (val) {
      if (val) {
        this.$refs.view.$resetView();
        this.drawComplete = !!this.rect;
      }
    }
  },
  created () {
    this.rect = this.itemData.rect;
    this.drawComplete = (!this.rects || this.rects.length === 0) && !!this.rect;
  },
  methods: {
    ratio () {
      return '0.5';
    },
    zoomIn () {
      this.$refs.view.$zoomIn();
    },
    zoomOut () {
      this.$refs.view.$zoomOut();
    },
    resetZoom () {
      this.$refs.view.$resetView();
    },
    smartMark () {
      /* if (typeof this.autoMarkRequest !== 'function') {
                    throw new Error(
                        'the prop auto-mark-request is required and must be a function'
                    );
                }*/
      if (this.enableDraw) {
        this.$message({
          type: 'info',
          message: '请先关闭手动标注模式'
        });
        return;
      }
      if (!this.smartMarkable) return;
      this.drawComplete = false;
      //this.smartMarkAnimation = true;
      // 调用父组件的方法，拿到智能标注的数据
      const promise = this.autoMarkRequest(this.src);
      if (!promise || !(promise instanceof Promise)) {
        //this.smartMarkAnimation = false;
        //                    throw new Error(
        //                        'the prop auto-mark-request must return a [Promsie Object]'
        //                    );
      }
      const rects = [
        {
          "rect": {
            "height": 0.951786,
            "width": 0.507937,
            "x": 0.020833,
            "y": 0.046429
          }
        },
        {
          "rect": {
            "height": 0.258929,
            "width": 0.162698,
            "x": 0.612103,
            "y": 0.460714
          }
        }
      ];
      if (rects.length) {
        this.rects = rects;
        this.itemData.rects = rects;
      } else {
        this.$message({
          type: 'info',
          message: '暂未检测出目标'
        });
      }
      //                promise
      //                    .then(rects => {
      //                        if (rects.length) {
      //                            this.rects = rects;
      //                            this.itemData.rects = rects;
      //                        } else {
      //                            this.$message({
      //                                type: 'info',
      //                                message: '暂未检测出目标'
      //                            });
      //                        }
      //                        this.smartMarkAnimation = false;
      //                    })
      //                    .catch(() => {
      //                        this.smartMarkAnimation = false;
      //                    });
    },
    // 手动标注
    _handleMousedown (e) {
      this._mouseDown = true;
      if (!this.drawable) return;
      this.drawComplete = false;
      this._target = e.currentTarget;
      const { offsetX, offsetY } = e;
      this._startXY = {
        x: offsetX / this._target.clientWidth,
        y: offsetY / this._target.clientHeight
      };
      on(this._target, 'mousemove', this._handleMousemove);
      on(document, 'mouseup', this._handleMouseup);
    },
    _handleMousemove (e) {
      if (!this.drawable || !this._mouseDown) return;
      const { x, y } = this._startXY;
      const { offsetX, offsetY } = e;
      const _x = offsetX / this._target.clientWidth;
      const _y = offsetY / this._target.clientHeight;
      this.rect = {
        x: Math.min(x, _x),
        y: Math.min(y, _y),
        width: Math.abs(x - _x),
        height: Math.abs(y - _y)
      };
    },
    _handleMouseup (e) {
      this._mouseDown = false;
      if (!this.drawable) return;
      const { x, y } = this._startXY;
      const { offsetX, offsetY } = e;
      const _x = offsetX / this._target.clientWidth;
      const _y = offsetY / this._target.clientHeight;
      this.rect = {
        x: Math.min(x, _x),
        y: Math.min(y, _y),
        width: Math.abs(x - _x),
        height: Math.abs(y - _y)
      };
      this.drawComplete = true;
      off(this._target, 'mousemove', this._handleMousemove);
      off(document, 'mouseup', this._handleMouseup);
      this.itemData.rect = this.rect;
      Bus.$emit('draw-complete', this.rect);
      //this.$emit('draw-complete', {url: this.src, rect: this.rect});
    },
    // 后台数据装换为矩形框对象数据
    _computedRect (item) {
      return {
        top: item.rect.y,
        left: item.rect.x,
        width: item.rect.width,
        height: item.rect.height
      };
    },
    _selectRect (rect) {
      this.rect = rect;
      this.itemData.rect = rect;
      this.$emit('draw-complete', { url: this.src, rect, type: rect.type });
    }
  }
};
</script>

<style lang="scss">
    .clue-detail-dialog-preview {
        width: 750px;
        height: 500px;
        .clue-detail-dialog-preview-rect {
            pointer-events: none;
            &.is-complete {
                border-color: #74ff7e;
            }
        }
        .clue-detail-dialog-preview-rect-item {
            cursor: pointer;
            &.is-complete {
                border-color: #74ff7e;
            }
        }
    }

    .clue-detail-dialog-preview-wrapper {
        position: relative;
        .clue-detail-dialog-preview__overlay {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
            z-index: 20;
            overflow: hidden;
            margin: auto;
            background-image: linear-gradient(
                90deg,
                rgba(166, 204, 252, 0.15) 10%,
                rgba(166, 204, 252, 0) 0
            ),
            linear-gradient(rgba(166, 204, 252, 0.15) 10%, rgba(166, 204, 252, 0) 0);
            background-size: 16px 16px;
            .clue-detail-dialog-preview__scan {
                position: relative;
                height: 50%;
                animation: scan 1.75s ease-out 0s infinite;
                background-image: linear-gradient(
                    transparent,
                    rgba(210, 230, 253, 0.6) 75%,
                    rgba(188, 217, 253, 0.8),
                    rgba(32, 128, 274, 0.8)
                );
            }
            @keyframes scan {
                from {
                    top: -50%;
                }
                to {
                    top: 50%;
                }
            }
        }
    }
</style>
