<template>
  <div class="h-target-img-upload">
    <el-upload
      ref="upload"
      :action="uploadApi"
      :data="uploadData"
      :headers="uploadHeaders"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleOnSuccess"
      :on-error="handleOnError"
      :http-request="httpRequest"
      :accept="accept"
      list-type="picture-card"
      :single-file="singleFile"
    >
      <slot />
    </el-upload>
    <el-dialog
      :visible.sync="showDialog"
      size="small"
      class="h-target-img-upload__dialog"
      @closed="cancel"
    >
      <template #title>
        <span class="el-dialog__title">
          {{ t("h.targeImgUpload.title") }}
          <span class="h-target-img-upload__title-description">
            (
            {{ t("h.targeImgUpload.searchTarge") }}
            <span class="h-target-img-upload__title-num">
              {{ total }}/{{ limit.total }}
            </span>
            )
          </span>
        </span>
      </template>
      <div class="h-target-img-upload__container">
        <div class="h-target-img-upload__view">
          <!-- <div class="h-target-img-upload__types">
            <span class="h-target-img-upload__type-item">
              <el-radio v-model="isManual" :label="false">
                {{ t("h.targeImgUpload.viewImage") }}
              </el-radio>
              <el-radio v-model="isManual" :label="true">
                {{ t("h.targeImgUpload.unitSelected") }}
              </el-radio>
            </span>
            <span v-if="isManual" class="h-target-img-upload__type-item">
              <span
                class="h-target-img-upload__types-label"
                v-text="t('h.targeImgUpload.type')"
              />
              <el-select v-model="type" class="h-target-img-upload__select">
                <el-option
                  v-for="currentType in types"
                  :key="currentType"
                  :label="typeList[currentType]"
                  :value="currentType"
                />
              </el-select>
            </span>
          </div> -->
          <div
            v-if="showTips && !isDrag && lockView"
            :style="tipsStyle"
            class="el-popover h-target-img-upload__tips"
            x-placement="right"
          >
            <div class="popper__arrow" />
            {{
              t("h.targeImgUpload.mouseTips", {
                type: t(`h.targeImgUpload.${type}`),
              })
            }}
          </div>
          <div ref="view" class="h-target-img-upload__img-carousel">
            <h-img-carousel
              :data="list"
              :current-index.sync="currentIndex"
              @on-changed="onChanged"
              @on-change="onChange"
            >
              <template slot="item" slot-scope="{ item }">
                <h-img-view
                  :ref="item.$$index"
                  :src="item.url"
                  :cursor="viewCursor"
                  :lock="lockView"
                  :view-data.sync="viewData"
                  bg="gray"
                  no-transition
                  @mousedown="onMousedown"
                  @mousemove="onMousemove"
                  @mousewheel.native="imgMousewheel"
                >
                  <template v-if="hasRectData && !detailsLoading">
                    <template
                      v-for="(value, dataType) in list[currentIndex].rectData"
                    >
                      <h-img-snippets-rect
                        v-for="dataItem in value"
                        :class="{
                          'is-active': dataItem.$$active,
                          'is-hover': dataItem.$$hover,
                          'is-manual': isManual,
                        }"
                        :ref="`${dataType}-rect-${dataItem.$$id}`"
                        :key="`${dataType}-rect-${dataItem.$$id}`"
                        :rect="getRect(dataItem, dataType)"
                        class="h-upload-rect"
                      />
                    </template>
                    <h-img-snippets-rect
                      v-show="isDrag"
                      :rect="drawRect"
                      class="h-upload-rect is-drag"
                    />
                  </template>
                </h-img-view>
              </template>
            </h-img-carousel>
            <div v-if="!isDone" class="h-target-img-upload__overlay">
              <div class="h-target-img-upload--scan" />
            </div>
          </div>
          <div class="h-target-img-upload__operation">
            <!-- <button
              type="button"
              class="el-button el-button--default is-icon h-target-img-upload__operation-btn"
              @click="swichImgList"
            >
              {{ t("h.targeImgUpload.imgList") }}
              <i
                :class="
                  showList ? 'h-icon-angle_down_sm' : 'h-icon-angle_up_sm'
                "
              />
            </button> -->
            <button
              type="button"
              class="
                el-button el-button--default
                is-icon
                h-target-img-upload__operation-btn
              "
              @click="resetView"
            >
              {{ t("h.targeImgUpload.suitable") }}
              <target-img-upload-suit-size-svg />
            </button>
          </div>
          <!-- <div
            v-loading="!isDone"
            :class="{
              'is-hide': !showList
            }"
            class="h-target-img-upload__album-wrapper"
          >
            <h-album
              ref="album"
              :data="list"
              :current-index.sync="currentIndex"
              :shadow="false"
            >
              <template
                slot="item"
                slot-scope="{ item }"
                class="h-target-img-upload__album-item"
              >
                <el-badge
                  :value="getRectTotal(item)"
                  :max="99"
                  :show-tip="false"
                >
                  <h-img-view
                    :src="item.url"
                    :title="item.title"
                    mode="scale-down"
                  />
                </el-badge>
              </template>
            </h-album>
          </div> -->
        </div>
        <div class="h-target-img-upload__details">
          <!-- <el-tabs v-model="viewType">
            <el-tab-pane :label="t('h.targeImgUpload.all')" name="all" />
            <el-tab-pane
              v-for="(type, index) in types"
              :key="`type-${index}`"
              :label="typeList[type]"
              :name="type"
            />
          </el-tabs> -->
          <el-scrollbar
            v-loading="!isDone || detailsLoading"
            v-if="list[currentIndex]"
            class="h-target-img-upload__details-container"
          >
            <template v-for="(value, dataType) in getRectData()">
              <div
                v-show="
                  (dataType === viewType || viewType === 'all') &&
                  !detailsLoading
                "
                :key="dataType"
              >
                <div class="h-target-img-upload__details-title">
                  <target-img-upload-face-svg
                    v-if="dataType === 'face'"
                    class="h-target-img-upload__details-thumbnail-svg"
                  />
                  <target-img-upload-body-svg
                    v-else-if="dataType === 'body'"
                    class="h-target-img-upload__details-thumbnail-svg"
                  />
                  <target-img-upload-vehicle-svg
                    v-else-if="dataType === 'vehicle'"
                    class="h-target-img-upload__details-thumbnail-svg"
                  />
                  <span v-text="typeList[dataType]" />
                </div>
                <transition-group
                  :name="drawTransition ? 'h-target-img-upload-list' : null"
                  class="h-target-img-upload__details-thumbnail-wrapper"
                  tag="div"
                  @after-leave="afterLeave"
                >
                  <div
                    v-for="(item, index) in value"
                    :key="`${dataType}-thumbnail-${item.$$id || index}`"
                    class="h-target-img-upload__details-thumbnail"
                    @mouseenter="handleMouseenter(item, dataType)"
                    @mouseleave="handleMouseLeave(item, dataType)"
                    @click="handleRectClick(item, dataType)"
                  >
                    <div
                      :class="{
                        'has-plate-num': hasPlateNum(item),
                        'is-active': item.$$active,
                        'is-hover': item.$$hover,
                      }"
                      class="h-target-img-upload__details-thumbnail-item"
                    >
                      <h-img-snippets-thumbnail
                        :rect="getRect(item, dataType)"
                        :img-url="imgUrl"
                        mode="contain"
                        bg="gray"
                        original
                      />
                      <h-vehicle-plate-tag
                        v-if="hasPlateNum(item)"
                        :color="item[props.vehicle.plateColor.key]"
                        :value="item[props.vehicle.plateNum.key]"
                        class="h-target-img-upload__details-thumbnail-plate"
                      />
                    </div>
                    <i
                      :class="{
                        'is-active': item.$$active,
                        'is-hover': item.$$hover,
                      }"
                      class="h-icon-done h-target-img-upload__thumbnail-checked"
                    />
                  </div>
                </transition-group>
                <span
                  v-if="
                    !value ||
                    (value.length === 0 && transitionType !== dataType)
                  "
                  class="h-target-img-upload__empty-description"
                  v-text="t('h.targeImgUpload.noTarge')"
                />
              </div>
            </template>
          </el-scrollbar>
        </div>
      </div>
      <div slot="footer" class="h-target-img-upload__footer">
        <el-button :disabled="disabledConfirm" type="primary" @click="confirm">
          <slot v-if="$slots.confirmText" name="confirmText" />
          <template v-else>
            {{ t("h.targeImgUpload.confirm") }}
          </template>
        </el-button>
        <el-button @click="showDialog = false">
          <slot v-if="$slots.cancelText" name="cancelText" />
          <template v-else>
            {{ t("h.targeImgUpload.cancel") }}
          </template>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { t } from "@hui-pro/locale";
import {
  merge,
  on,
  off,
  bytes2text,
  getPage,
  isEmpty,
  isObject,
  isArray,
  hasOwn,
  offset,
  size,
  isUndefined,
  trim,
  Stack,
} from "@hui-pro/utils";

import ajax from "hui/packages/upload/src/ajax.js";
// components
import ImgView from "@hui-pro/img-view/src/img-view.vue";
import Thumbnail from "@hui-pro/img-snippets/src/thumbnail.vue";
import Rect from "@hui-pro/img-snippets/src/rect.vue";
import ImgCarousel from "@hui-pro/img-carousel/src/img-carousel.vue";
// import Album from "@hui-pro/album/src/album.vue";
import VehiclePlateTag from "@hui-pro/vehicle-plate-tag/src/vehicle-plate-tag.vue";

const ignoreDuplicateOf = [
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent",
];

export default {
  name: "TargetImgUpload",
  components: {
    HImgView: ImgView,
    HimgSnippetsThumbnail: Thumbnail,
    HimgSnippetsRect: Rect,
    HImgCarousel: ImgCarousel,
    // HAlbum: Album,
    HVehiclePlateTag: VehiclePlateTag,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    uploadApi: {
      type: String,
      default: "/",
      require: true,
    },
    scan: {
      type: Function,
      require: true,
      default: null,
    },
    uploadData: {
      type: Object,
      default: null,
    },
    uploadHeaders: {
      type: Object,
      default: null,
    },
    dataProps: {
      type: Object,
      default: () => {
        return {};
      },
    },
    limitData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    types: {
      type: Array,
      default() {
        return ["face", "body", "vehicle"];
      },
      validator(value) {
        for (const type of value) {
          if (!["face", "body", "vehicle"].includes(type)) {
            return false;
          }
        }
        return value.length > 0;
      },
    },
    uploadApiFormatter: {
      type: Function,
      default: (res) => {
        return res.data;
      },
    },
    beforeConfirm: {
      type: Function,
      default: (list) => {
        return new Promise((resolve) => {
          resolve(list);
        });
      },
    },
    accept: String,
    singleFile: Boolean,
    httpRequest: {
      type: Function,
      default: ajax,
    },
  },
  data() {
    return {
      t,
      showDialog: false,
      imgUrl: null,
      img: null,
      limit: {
        img: {
          types: ["jpg", "jpeg", "png", "bmp"],
          minSize: {
            width: 48,
            height: 48,
          },
          maxSize: {
            width: 4096,
            height: 4096,
          },
          minFileSize: 128, // b
          maxFileSize: 8388608, // 8M
        },
        total: 5,
      },
      props: {
        face: {
          key: "face",
          rect: {
            key: "rect",
            height: "height",
            width: "width",
            left: "x",
            top: "y",
          },
        },
        body: {
          key: "body",
          rect: {
            key: "rect",
            height: "height",
            width: "width",
            left: "x",
            top: "y",
          },
        },
        vehicle: {
          key: "vehicle",
          rect: {
            key: "rect",
            height: "height",
            width: "width",
            left: "x",
            top: "y",
          },
          plateRect: {
            key: "plateRect",
            height: "height",
            width: "width",
            left: "x",
            top: "y",
          },
          plateNum: {
            key: "plateNum",
          },
          plateType: {
            key: "plateType",
          },
          plateColor: {
            key: "plateColor",
          },
        },
      },
      isDone: false,
      rects: [],
      list: [],
      imgSize: {},
      viewType: "all",
      type: "face",
      target: {},
      drawRect: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
      },
      drawData: {},
      isDrag: false,
      lockView: false,
      imgTarget: null,
      showTips: false,
      tipsStyle: {},
      transitionType: false,
      currentIndex: 0,
      showList: false,
      drawTransition: false,
      naturalSize: {
        width: 0,
        height: 0,
      },
      viewData: {
        scale: 1,
        ratio: 1,
        translateX: 0,
        translateY: 0,
      },
      hasUrl: false,
      isManual: false,
      detailsLoading: false,
      isConfirm: false,
    };
  },
  computed: {
    viewCursor() {
      if (!this.isManual) {
        if (this.isDrag) {
          return "grabbing";
        } else {
          return "grab";
        }
      } else {
        return "crosshair";
      }
    },
    typeList() {
      return {
        face: t("h.targeImgUpload.face"),
        body: t("h.targeImgUpload.body"),
        vehicle: t("h.targeImgUpload.vehicle"),
      };
    },
    disabledConfirm() {
      return this.total === 0;
    },
    currentItem() {
      return this.itemData;
    },
    itemData() {
      const item = this.list[this.currentIndex];
      const defaultData = {
        rectData: this.getDefaultRectData(),
        url: null,
      };
      if (item) {
        return merge(defaultData, item);
      } else {
        return defaultData;
      }
    },
    hasRectData() {
      return (
        this.list[this.currentIndex] &&
        !isEmpty(this.list[this.currentIndex].rectData)
      );
    },
    total() {
      let total = 0;
      for (const item of this.list) {
        total += this.getRectTotal(item);
      }
      return total;
    },
  },
  watch: {
    showDialog(val) {
      if (!val) {
        this.unbindEvent();
      } else {
        this.drawTransition = false;
        this.isDone = false;
      }
    },
    currentIndex() {
      this.drawTransition = false;
      this.isManual = false;
      this.lockView = false;
      this.imgUrl = this.itemData.url;
      this.$nextTick(() => {
        const ref = this.getItemRef();
        if (ref) {
          ref.$reset();
        }
      });
    },
    isManual(val) {
      this.lockView = false;
      if (!val) {
        this.resetView();
      }
    },
  },
  created() {
    this.stack = new Stack();
    this.mergeProps();
  },
  methods: {
    // httpRequest(opts) {
    //   const xhr = ajax(opts);
    //   opts.onError = err => {
    //     this.$refs.upload.onError(xhr, err);
    //   };
    //   return xhr;
    // },
    unbindEvent() {
      if (this.imgTarget) {
        off(this.imgTarget, "mouseenter", this.imgViewMouseenter);
        off(this.imgTarget, "mouseleave", this.imgViewMouseleave);
        off(this.imgTarget, "mousemove", this.imgViewMousemove);
      }
    },
    bindEvent() {
      if (this.imgTarget) {
        on(this.imgTarget, "mouseenter", this.imgViewMouseenter);
        on(this.imgTarget, "mouseleave", this.imgViewMouseleave);
        on(this.imgTarget, "mousemove", this.imgViewMousemove);
      }
    },
    swichImgList() {
      this.showList = !this.showList;
    },
    resetView() {
      this.viewData = {
        scale: 1,
        ratio: 1,
        translateX: 0,
        translateY: 0,
        transition: true,
      };
    },
    onChange() {
      this.detailsLoading = true;
    },
    onChanged() {
      this.unbindEvent();
      const ref = this.getItemRef();
      if (ref) {
        this.imgTarget = ref.$el;
      }
      this.bindEvent();
      this.$nextTick(() => {
        this.detailsLoading = false;
      });
    },
    afterLeave() {
      this.transitionType = false;
    },
    getRectData() {
      return this.list[this.currentIndex].rectData || this.getDefaultRectData();
    },
    getDefaultRectData() {
      const defaultRectData = {};
      for (const type of this.types) {
        defaultRectData[type] = [];
      }
      return defaultRectData;
    },
    getRectTotal(item, isDefault) {
      const data = item.rectData;
      const getLength = (arr) => {
        let total = 0;
        for (const rectItem of arr) {
          if (rectItem.$$active || isDefault) {
            total++;
          }
        }
        return total;
      };
      if (isObject(data)) {
        const faceLength = isArray(data.face) ? getLength(data.face) : 0;
        const bodyLength = isArray(data.body) ? getLength(data.body) : 0;
        const vehicleLength = isArray(data.vehicle)
          ? getLength(data.vehicle)
          : 0;
        return faceLength + bodyLength + vehicleLength;
      }
      return 0;
    },
    mergeProps() {
      this.limit = merge(this.limit, this.limitData);
      this.props = merge(this.props, this.dataProps);
    },
    hasPlateNum(item) {
      const { props } = this;
      const plateNumKey = props.vehicle.plateNum.key;
      const plateColorKey = props.vehicle.plateColor.key;
      return item[plateNumKey] && item[plateColorKey];
    },
    getItemProps(type, key = "rect") {
      const { props } = this;
      const typeProps = props[type];
      const rectProps = hasOwn(typeProps, key) && typeProps[key];
      return rectProps;
    },
    getRect(item, type) {
      if (!this.types.includes(type)) {
        return null;
      }
      const { key, width, height, top, left } = this.getItemProps(type);
      const rectData = item[key];
      if (!rectData) {
        return null;
      } else {
        return {
          width: rectData[width],
          height: rectData[height],
          top: rectData[top],
          left: rectData[left],
        };
      }
    },
    resetData() {
      Object.assign(this.$data, this.$options.data(), {
        isDone: true,
      });
      this.isConfirm = false;
      this.mergeProps();
    },
    imgViewMouseenter() {
      this.showTips = true;
    },
    imgViewMouseleave() {
      this.showTips = false;
    },
    imgViewMousemove(e) {
      this.tipsStyle = {
        left: `${e.clientX}px`,
        top: `${e.clientY - 12}px`,
      };
    },
    getItemRef() {
      const ref = this.$refs[this.currentIndex];
      if (ref) {
        return ref;
      }
      return null;
    },
    async confirm() {
      let list = [];
      this.list.map((item, index) => {
        const newData = {
          url: item.url,
          rectData: {},
        };
        for (const rectData in item.rectData) {
          const propKey = this.props[rectData].key;
          const newArr = [];
          for (const rectItem of item.rectData[rectData]) {
            const newItem = merge({}, rectItem);
            delete newItem.$$id;
            delete newItem.$$hover;
            // 保留 $$isManual, $$active;
            newArr.push(newItem);
          }
          newData.rectData[propKey] = newArr;
        }
        list.push(newData);
      });
      try {
        list = await this.stack.promise(this.beforeConfirm(list));
        this.$emit("on-confirm", list);
        this.showDialog = false;
        this.isConfirm = true;
      } catch (error) {
        return false;
      }
    },
    cancel() {
      if (!this.isConfirm) this.$emit("on-cancel");
      this.resetData();
    },
    // 图片尺寸大小校验
    checkImgSize(resolve, reject) {
      const done = () => {
        this.img = null;
      };
      off(this.img, "load", this.checkImgSize);
      const minWidth = this.limit.img.minSize.width;
      const minHeight = this.limit.img.minSize.height;
      const maxWidth = this.limit.img.maxSize.width;
      const maxHeight = this.limit.img.maxSize.height;
      this.naturalSize = {
        width: this.img.naturalWidth,
        height: this.img.naturalHeight,
      };
      const { width, height } = this.naturalSize;
      if (
        width < minWidth ||
        height < minHeight ||
        width > maxWidth ||
        height > maxHeight
      ) {
        this.$message({
          message: t("h.targeImgUpload.imgSize", {
            smallSize: `${minWidth}px * ${minHeight}px`,
            bigSize: `${maxWidth}px * ${maxHeight}px`,
          }),
          type: "error",
        });
        if (reject) {
          done();
          reject(new Error("size error"));
        }
        return false;
      }
      done();
      resolve();
    },
    getId() {
      return Math.random().toString(36).slice(2);
    },
    setList(url) {
      this.hasUrl = true;
      const list = [];
      for (const item of this.data) {
        const newItem = merge({}, item);
        newItem.rectData = this.formatRectData(newItem.rectData);
        list.push(newItem);
      }
      list.push({
        url: url,
        rectData: this.getDefaultRectData(),
      });
      this.list = list;
      this.currentIndex = this.list.length - 1;
      this.showList = this.list.length > 1;
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        this.isDone = false;
        this.img = new Image();
        this.img.src = URL.createObjectURL(file);
        const fileType = file.type.split("/")[1].toLowerCase();
        this.setList(this.img.src);
        // 图片类型校验
        if (file.type === "" || this.limit.img.types.indexOf(fileType) === -1) {
          this.$message({
            message: t("h.targeImgUpload.imgType", {
              type: `.${this.limit.img.types.join("/.")}`,
            }),
            type: "error",
          });
          this.img = null;
          reject(new Error("type error"));
        } else if (
          // 图片文件大小校验
          file.size < this.limit.img.minFileSize ||
          file.size > this.limit.img.maxFileSize
        ) {
          this.$message({
            message: t("h.targeImgUpload.fileSize", {
              size: `${bytes2text(this.limit.img.minFileSize)} - ${bytes2text(
                this.limit.img.maxFileSize
              )}`,
            }),
            type: "error",
          });
          this.img = null;
          reject(new Error("size error"));
        }
        if (this.limit.total < this.total) {
          this.showMaxTargeMsg();
          reject(new Error("count error"));
        }
        on(this.img, "load", this.checkImgSize.bind(this, resolve, reject));
        on(this.img, "error", this.imgLoadError);
      });
    },
    parseHeaders(headers) {
      const parsed = {};
      let key;
      let val;
      let i;
      if (!headers) {
        return parsed;
      }
      headers.split("\n").forEach((line) => {
        i = line.indexOf(":");
        key = trim(line.substr(0, i)).toLowerCase();
        val = trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === "set-cookie") {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
          }
        }
      });
      return parsed;
    },
    handleOnSuccess(res, file) {
      const url = this.uploadApiFormatter(res);
      this.$emit("on-success", res, file);
      this.$scan(url);
    },
    handleOnError(xhr) {
      const responseHeaders =
        "getAllResponseHeaders" in xhr
          ? this.parseHeaders(xhr.getAllResponseHeaders())
          : null;
      const text = xhr.responseText || xhr.response;
      let responseData;
      try {
        responseData = JSON.parse(text);
      } catch (error) {
        responseData = {};
      }
      xhr.data = responseData;
      xhr.headers = responseHeaders;
      const response = {
        data: responseData,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
        request: xhr,
      };
      const err = new Error(`Request failed with status code ${xhr.status}`);
      err.response = response;
      this.$emit("on-error", err);
      this.isDone = true;
      if (isUndefined(this._events["on-error"])) {
        this.$message({
          message: t("h.targeImgUpload.imgUploadError"),
          type: "error",
        });
      }
    },
    imgLoadError() {
      if (this.img) {
        off(this.img, "error", this.imgLoadError);
        this.img = null;
      }
      this.$message({
        message: t("h.targeImgUpload.imgLoadError"),
        type: "error",
      });
      this.isDone = true;
    },
    formatRectData(data) {
      const rectData = {};
      for (const type of this.types) {
        const propKey = this.props[type].key;
        const arr = [];
        if (propKey && data[propKey]) {
          for (const item of data[propKey]) {
            const itemData = merge(
              {
                $$id: this.getId(),
                $$active: false,
                $$hover: false,
              },
              item
            );
            arr.push(itemData);
          }
        }
        rectData[type] = arr;
      }
      return rectData;
    },
    $scan(url) {
      this.showDialog = true;
      if (!this.hasUrl) {
        this.setList(url);
      } else {
        this.$set(this.list[this.currentIndex], "url", url);
      }
      this.imgUrl = url;
      this.img = new Image();
      const reject = (showMsg) => {
        if (this.showDialog) {
          this.lockView = true;
          this.isManual = true;
          this.onChanged();
          if (showMsg) {
            this.$message({
              message: t("h.targeImgUpload.noTargeMsg"),
              type: "error",
            });
          }
        }
      };
      const resolve = () => {
        this.scan({
          url,
          imgSize: this.naturalSize,
        })
          .then((res) => {
            if (this.showDialog) {
              // 过滤无效数据
              const rectData = this.formatRectData(res);
              this.$set(this.list[this.currentIndex], "rectData", rectData);
              this.isDone = true;
              if (this.getRectTotal(this.currentItem, true) === 0) {
                reject(true);
              }
            }
          })
          .catch((err) => {
            this.$emit("on-error", err);
            this.showDialog = false;
            this.$message({
              message: err,
              type: "error",
            });
            this.isDone = true;
            reject(isUndefined(this._events["on-error"]));
          });
      };
      on(this.img, "load", this.checkImgSize.bind(this, resolve));
      on(this.img, "error", this.imgLoadError);
      this.img.src = url;
    },
    showMaxTargeMsg() {
      this.$message.warning(
        t("h.targeImgUpload.maxTargeMsg", {
          num: this.limit.total,
        })
      );
    },
    onMousedown(e) {
      this.isDrag = true;
      if (this.isManual) {
        this.lockView = true;
        this.target = e.currentTarget || e.srcElement;
        this.drawData.pageX = getPage(e).pageX;
        this.drawData.pageY = getPage(e).pageY;
        this.drawData.offsetX = e.offsetX;
        this.drawData.offsetY = e.offsetY;
        this.drawRect.left = e.offsetX / this.target.clientWidth;
        this.drawRect.top = e.offsetY / this.target.clientHeight;
        on(this.target, "mousemove", this.onMousemove);
      }
      on(document, "mouseup", this.onMouseup);
    },
    imgMousewheel() {
      this.lockView = false;
    },
    onMousemove(e) {
      if (this.isManual && this.isDrag) {
        const ref = this.getItemRef();
        const scale = ref ? ref.$getZoomData().scale : 1;
        const x = getPage(e).pageX - this.drawData.pageX;
        const y = getPage(e).pageY - this.drawData.pageY;
        const width = this.target.clientWidth * scale;
        const height = this.target.clientHeight * scale;
        this.drawRect.width = Math.abs(x) / width;
        this.drawRect.height = Math.abs(y) / height;
        if (x < 0) {
          this.drawRect.left =
            (this.drawData.offsetX * scale - Math.abs(x)) / width;
        }
        if (y < 0) {
          this.drawRect.top =
            (this.drawData.offsetY * scale - Math.abs(y)) / height;
        }
      }
    },
    onMouseup(e) {
      this.isDrag = false;
      if (this.isManual) {
        this.lockView = true;
        this.drawTransition = true;
        off(this.target, "mousemove", this.onMousemove);
        off(document, "mouseup", this.onMouseup);
        const rectData = this.currentItem.rectData;
        const { key, width, height, top, left } = this.getItemProps(this.type);
        const itemData = {
          [key]: {
            [width]: this.drawRect.width,
            [height]: this.drawRect.height,
            [top]: this.drawRect.top,
            [left]: this.drawRect.left,
          },
          $$active: true,
          $$isManual: true,
          $$id: Math.random().toString(36).slice(2),
        };
        if (this.drawRect.width && this.drawRect.height) {
          if (this.limit.total > this.total) {
            rectData[this.type].push(itemData);
          } else {
            this.showMaxTargeMsg();
          }
        }
        this.$set(this.list[this.currentIndex], "rectData", rectData);
        this.drawRect = {
          width: 0,
          height: 0,
          top: 0,
          left: 0,
        };
      }
    },
    manualDelete(data, index, type) {
      this.drawTransition = true;
      this.transitionType = type;
      data.splice(index, 1);
    },
    handleRectClick(item, type) {
      // if (this.limit.total <= this.total && !item.$$active) {
      //   this.showMaxTargeMsg();
      //   return;
      // }
      // this.$set(item, "$$active", !item.$$active);
      this.list.map((item, index) => {
        for (const rectData in item.rectData) {
          const propKey = this.props[rectData].key;
          const newArr = [];
          for (const rectItem of item.rectData[rectData]) {
            this.$set(rectItem, "$$active", false)
          }
        }
      });
      this.$set(item, "$$active", true);
    },
    setOriginalSize(item, type) {
      const { key, width, height } = this.getItemProps(type);
      const { scale } = this.viewData;
      const ref = this.getItemRef();
      const imgViewSize = ref
        ? ref.imgViewSize
        : {
            width: 0,
            height: 0,
          };
      const imgViewWrapperSize = size(this.$refs.view);
      const rectW = item[key][width] * imgViewSize.width * scale;
      const rectH = item[key][height] * imgViewSize.height * scale;
      const rectOffset = offset(
        this.$refs[`${type}-rect-${item.$$id}`][0].$el,
        this.$refs.view
      );
      if (
        rectOffset.top < 0 ||
        rectOffset.left < 0 ||
        rectOffset.top + rectH > imgViewWrapperSize.height ||
        rectOffset.left + rectW > imgViewWrapperSize.width
      ) {
        this.resetView();
      }
    },
    handleMouseenter(item, type) {
      this.setOriginalSize(item, type);
      this.$set(item, "$$hover", !item.$$hover);
    },
    handleMouseLeave(item) {
      this.hoverTarget = null;
      this.$set(item, "$$hover", !item.$$hover);
    },
  },
};
</script>
<style scoped>
/* .h-target-img-upload__dialog .el-dialog {
  width: 732px;
}
.h-target-img-upload__view{
  width: 100%;
} */
</style>
