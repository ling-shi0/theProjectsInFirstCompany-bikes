<!--
 * @Description: Record
 * @Project:
 * @Version:
 * @Author: DengDu
 * @Date: 2022-03-17 11:27:14
 * @LastEditors: DengDu
 * @LastEditTime: 2022-03-21 10:23:31
 * @FilePath: \erim-frontend\src\modules\page\searchCar\CarImgOnMap.vue
-->

<template>
  <div class="car-img-on-map">
    <img v-if="isShowImg" :src="propsData.imgUrl" alt="">
    <div @click="isShowImg=!isShowImg">
      <i v-if="isShowImg" class="h-icon-angle_down"></i>
      <i v-else class="h-icon-angle_up"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "CarImgOnMap",
  data() {
    return {
      isShowImg: false
    }
  },
  props: {
    propsData: {
      type: Object,
      default: () => {
        return {
          imgUrl: ""
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.car-img-on-map {
  width: 16px;
  height: 16px;
  border: 1px solid rgba(235, 112, 112, 0.808);
  border-radius: 50%;
  margin-top: -(20px + 16px);
  margin-left: -8px;
  background: #fff;
  position: relative;
  > div {
    width: 100%;
    height: 100%;
    line-height: 14px;
    text-align: center;
    i {
      font-size: 14px;
      color: rgba(235, 112, 112, 0.808);
    }
  }
  img {
    width: 100px;
    height: 100px;
    border: 1px solid rgba(235, 112, 112, 0.808);
    position: absolute;
    bottom: 16px;
    left: -(50px - 8px);
  }
}
</style>
