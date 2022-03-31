<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-30 18:42:18
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2022-02-09 10:49:20
-->
<template>
  <div class="tab-page-pane">
    <div class="tab-page-pane-tabs">
      <el-button
        type="default"
        class="tabBut"
        :class="activeBut === 1 ? 'active' : ''"
        @click="changeTab(1)"
        >特征搜车</el-button
      >
      <el-button
        type="primary"
        class="tabBut"
        :class="activeBut === 0 ? 'active' : ''"
        @click="changeTab(0)"
        >一人多骑</el-button
      >
    </div>
    <div class="tab-page-pane-content">
      <transition name="component-fade" mode="out-in">
        <component :is="tabCom"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import personList from "./page/personList.vue";
import SearchCarTab from "./page/searchCar/FeatureSearchCar.vue";
export default {
  name: "TabPages",
  data() {
    return {
      tabCom: SearchCarTab,
      activeBut: 1,
      tabMap: {
        0: personList,
        1: SearchCarTab,
      },
    };
  },
  methods: {
    changeTab(index) {
      if (index === this.activeBut) return;
      this.activeBut = index;
      this.tabCom = this.tabMap[index];
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-page-pane {
  width: 100%;
  height: 100%;
  &-tabs {
    width: 100%;
    height: 56px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    padding-left: 11px;
    .tabBut {
      width: 140px;
      height: 40px;
      background: #ffffff;
      border: 1px solid #2080f7;
      border-radius: 2px;
      color: black;
      &.active {
        background: #2080f7;
        color: white;
      }
    }
  }
  &-content {
    width: 100%;
    height: calc(100% - 56px);
  }
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.8s ease;
}

.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>