<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-30 19:25:02
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-11 14:15:23
-->
<template>
  <div class="search-car-tab">
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane label="以脸搜脸" name="face"> 以脸搜脸 </el-tab-pane>
      <el-tab-pane label="以车搜车" name="car"> 以车搜车 </el-tab-pane>
      <el-tab-pane label="特征搜车" name="features">特征搜车</el-tab-pane>
    </el-tabs>
    <div class="content">
      <transition name="car-fade" mode="out-in">
        <component
          :is="defaultCom"
          :defaultProps="defaultProps"
          @clearDefaultProps="clearDefaultProps"
        ></component>
      </transition>
    </div>
  </div>
</template>

<script>
import searchCar from "./searchCar/index.vue";
import FaceSearch from "./searchCar/FaceSearch.vue";
import FeatureSearch from "./searchCar/FeatureSearch.vue";
import Bus from "@/bus";
export default {
  name: "SearchCarTab",
  data() {
    return {
      activeName: "face",
      defaultCom: FaceSearch,
      defaultProps: {},
      tabMap: {
        face: FaceSearch,
        car: searchCar,
        features: FeatureSearch,
      },
    };
  },
  mounted() {
    Bus.$on("changeTab", (data) => {
      this.defaultProps = data.props;
      this.activeName = data.tabName;
    });
  },
  watch: {
    activeName(val) {
      this.defaultCom = this.tabMap[val];
    },
  },
  methods: {
    clearDefaultProps() {
      this.defaultProps = {};
    },
  },
  beforeDestroy() {
    Bus.$off("changeTab");
  },
};
</script>

<style>
.search-car-tab .el-tabs__content {
  display: none;
}
</style>

<style lang="scss" scoped>
.search-car-tab {
  width: 100%;
  height: 100%;
  .tabs {
    width: 100%;
    height: 52px;
  }
  .content {
    width: 100%;
    height: calc(100% - 52px);
  }
}

.car-fade-enter-active,
.car-fade-leave-active {
  transition: all 0.8s;
}
.car-fade-enter, .car-fade-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
</style>