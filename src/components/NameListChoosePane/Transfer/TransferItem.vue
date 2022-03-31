<!--
 * @Description: 穿梭框左右显示框
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-05-27 15:25:24
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-11 14:47:35
-->
<template>
  <div class="transfer-item">
    <div class="transfer-item-header">
      {{ title }}
    </div>
    <div class="transfer-item-content">
      <div class="transfer-item-content-input">
        <el-input
          style="width: 100%; height: 32px"
          v-model="inputVal"
          :placeholder="filterPlaceHolder"
          suffix-icon="h-icon-search"
          :on-icon-click="searchClick"
        ></el-input>
      </div>
      <div
        class="transfer-item-content-scroll"
        @scroll="scrollFetch"
        v-if="listData && listData.length"
      >
        <el-checkbox-group v-model="checkedIdArr" @change="checkDataChange">
          <el-checkbox
            v-for="(item, index) in listData"
            :label="item[labelId]"
            :key="item[labelId]"
            style="height: 30px"
            >{{ item[labelName] }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <div class="transfer-item-content-empty" v-else>暂无数据</div>
    </div>
    <div class="transfer-item-footer" v-if="footerVisible">
      {{ footerVisible }} <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "TransferItem",
  props: {
    title: String,
    footerVisible: { type: Boolean, default: true },
    labelName: { type: String, default: "libName" },
    onScrollY: { type: Function, default: () => {} },
    filterPlaceHolder: { type: String, default: "请输入" },
    checkboxList: { type: Array, default: [] },
    filterSearch: { type: Function, default: () => {} },
    labelId: { type: String, default: "libCode" },
  },
  data() {
    return {
      listData: [],
      checkedIdArr: [],
      inputVal: "",
    };
  },
  watch: {
    checkboxList(val) {
      this.listData = val;
    },
  },
  methods: {
    scrollFetch(e) {
      this.onScrollY(
        Math.floor(
          (e.srcElement.scrollTop + e.srcElement.offsetHeight) /
            e.srcElement.scrollHeight
        )
      );
    },
    checkDataChange(val) {
      this.$emit("change", val);
    },
    searchClick() {
      this.filterSearch(this.inputVal);
    },
    clearQuery() {
      this.inputVal = "";
    },
  },
};
</script>
<style lang="scss">
.el-checkbox-group {
  width: 100%;
  & label {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
.transfer-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebebeb;
  background: #fff;
  border-radius: 4px;
  &-header {
    width: 100%;
    height: 50px;
    color: #1a1a1a;
    line-height: 50px;
    font-size: 14px;
    text-align: center;
  }
  &-content {
    width: 100%;
    flex: 1;
    overflow: hidden;
    &-input {
      padding: 8px 16px;
    }
    &-scroll {
      width: 100%;
      height: calc(100% - 50px);
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0 0 0 16px;
    }
    &-empty {
      width: 100%;
      height: calc(100% - 50px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  &-footer {
    width: 100%;
    height: 40px;
  }
}
</style>
