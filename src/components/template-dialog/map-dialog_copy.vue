<template>
  <el-dialog
    class="map-dialog"
    title="选取坐标"
    :visible="visible"
    :area="[1200, 766]"
    top="middle"
    no-scrollbar
    @close="close"
  >
    地图-选择经纬度
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit">
        确 定
      </el-button>
      <el-button @click="close">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "MapDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    lonlat: {
      type: Array,
      default: () => null
    }
  },
  data () {
    return {};
  },
  methods: {
    close () {
      // this.$emit("update:visible", false);
    },
    submit () {
      this.$emit("submit", this.result);
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="scss" scope></style>
