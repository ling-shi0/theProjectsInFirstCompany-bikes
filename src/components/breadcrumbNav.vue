<template>
  <div class="breadcrumbNav">
    <span class="iconfont back" @click="goBack()">&#xed45;</span>
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item v-for="item in breadcrumbNavObj" :key="item.name">
        <span v-bind:style="{ color: item.color }">{{ item.name }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import "@/filters";

export default {
  data () {
    return {};
  },
  props: ["breadcrumbNavObj", "type"],
  methods: {
    goBack () {
      if (this.type) {
        this.$emit("goBack");
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.breadcrumbNav {
  display: flex;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
  padding-left: 5px;
  font-size: 14px;
  background: #fff;
  position: fixed;
  z-index: 2;
  width: 100%;
  .back {
    margin-right: 10px;
    cursor: pointer;
  }
  .breadcrumb {
    line-height: 40px;
    height: 40px;
    ::v-deep .el-breadcrumb__separator {
      line-height: 44px;
      height: 44px;
    }
  }
}
</style>
