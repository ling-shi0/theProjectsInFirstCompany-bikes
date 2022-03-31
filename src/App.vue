<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-08-26 16:54:49
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-08-30 10:05:55
-->
<template>
  <div id="app">
    <!-- out-in指的是先过渡现有的元素，在过渡新元素 -->
    <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
