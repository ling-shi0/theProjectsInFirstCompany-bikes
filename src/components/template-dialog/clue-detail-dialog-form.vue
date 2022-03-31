<template>
  <div>
    <el-form
      ref="form"
      class="clue-preview-form"
      label-width="91px"
      :model="formData"
      v-if="formType == 'test'"
    >
      <el-tabs v-model="activePane" tab-position="top">
        <!--formData.type: 类型（如：人、车）-->
        <el-tab-pane label="基本信息" name="base" class="clue-form-base-tab">
          <el-form-item label="出现时间" prop="happenTime">
            <el-date-picker v-model="formData.happenTime" type="datetime" />
          </el-form-item>
          <el-form-item label="经纬度" prop="lonlat">
            <el-button>按钮</el-button>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="详细信息" name="detail">
          <el-scrollbar wrap-class="form-scrollbar-wrap">
            <template>
              <el-form-item label="性别" prop="gender">
                <!-- <el-select v-model="formData.gender">
                  <el-option
                    v-for="(item, key) in []"
                    :key="key"
                    :label="item.name"
                    :value="item.dataValue"
                  />
                </el-select> -->
              </el-form-item>
            </template>
            <template>
              <!--v-if="formData.targetType === '1'"-->
              <el-form-item label="车辆类型" prop="vehicleType">
                <el-select v-model="formData.vehicleType">
                  <el-option
                    v-for="(item, key) in []"
                    :key="key"
                    :label="item.name"
                    :value="item.dataValue"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>

      <map-dialog
        :visible.sync="mapVisible"
        :lonlat="formData.lonlat"
        @submit="getLnglat"
      />
    </el-form>
  </div>
</template>

<script>
import MapDialog from "./map-dialog_copy";
import moment from "moment";

export default {
  name: "ClueDetailDialogForm",
  components: {
    MapDialog
  },
  props: {
    model: {
      // 每一条数据
      type: Object,
      default: null
    },
    enableDraw: {
      // 手动标注（如果是：这里的 input 为不可编辑状态）
      type: Boolean,
      default: false
    },
    imageModelSuccess: {
      // 图片模型成功
      type: Boolean,
      default: true
    },
    autoFlag: {
      // 自动标记
      type: Boolean,
      default: false
    },
    formActiveTab: {
      // tab 标识
      type: Boolean,
      default: false
    },
    formType: {
      // 弹框右侧展示哪个表格
      type: String,
      default: ""
    }
  },
  data () {
    const val = this.model;
    return {
      activePane: "base",
      mapVisible: false,
      formData: {
        happenTime: val.happenTime && moment(val.happenTime),
        gender: (val.archiveLabelVO && val.archiveLabelVO.gender) || "",
        vehicleType:
          (val.archiveLabelVO && val.archiveLabelVO.vehicleType) || ""
      }
    };
  },
  watch: {
    model (val) {}
  },
  mounted () {},
  methods: {
    // 获取经纬度
    getLnglat ([lng, lat]) {
      this.$set(this.formData, "lonlat", [lng, lat]);
    },
    mapClick () {
      this.mapVisible = true;
    },
    // 表单没问题后，供父组件调用
    validate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            const val = this.formData;
            Object.assign(this.model, {
              happenTime:
                val.happenTime &&
                moment(val.happenTime).format("YYYY-MM-DD HH:mm:ss")
            });
            resolve(this.model);
            return;
          }
          reject(valid);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
