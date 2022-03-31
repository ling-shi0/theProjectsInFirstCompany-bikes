<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-09-09 14:02:51
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-09-10 09:50:39
-->
<template>
  <div class="filter-check-box">
    <div
      @click="checkAll"
      :class="checkAllFlag ? 'whole-item active' : 'whole-item'"
    >
      全部
    </div>
    <div v-for="item in checkBoxList" :key="item.id" class="item">
      <CheckBoxItem
        :itemMes="item"
        ref="checkboxitem"
        @checkChange="checkChange"
      ></CheckBoxItem>
    </div>
  </div>
</template>

<script>
import CheckBoxItem from "./CheckBoxItem.vue";
import Bus from "@/bus";
export default {
  name: "FilterCheckBox",
  props: {
    checkBoxList: Array,
  },
  components: {
    CheckBoxItem,
  },
  data() {
    return {
      checkedList: [],
      checkAllFlag: false,
    };
  },
  // 点击重置后 ：取消全选及车身颜色、前置物框
  mounted() {
    Bus.$on("reset",(value) => {
      if(value){
        this.checkedList = [];
        this.$emit("checkedListChange", []);
        this.$refs.checkboxitem.forEach((item) => {
          item.unchecked();
        });
        this.checkAllFlag = false;
      }
    })
  },
  methods: {
    checkAll() {
      if (!this.checkAllFlag) {
        this.checkedList = this.checkBoxList.map((item) => item.text);
        this.$emit("checkedListChange", this.checkedList);
        this.$refs.checkboxitem.forEach((item) => {
          item.checked();
        });
        this.checkAllFlag = true;
      } else {
        this.checkedList = [];
        this.$emit("checkedListChange", []);
        this.$refs.checkboxitem.forEach((item) => {
          item.unchecked();
        });
        this.checkAllFlag = false;
      }
    },
    checkChange(data) {
      let checkIndex = -1;
      this.checkedList.forEach((item, index) => {
        if (item === data.text) {
          checkIndex = index;
        }
      });
      // 是选中的情况下  且  已选中数组中没有这个值时
      if (checkIndex === -1 && data.checked) {
        this.checkedList.push(data.text);
      } else if (checkIndex > -1 && !data.checked) {
        // 取消选中情况下 已选数组中有他了  删了他
        this.checkedList.splice(checkIndex, 1);
      }
      this.checkAllFlag = this.checkedList.length === this.checkBoxList.length;
      this.$emit("checkedListChange", this.checkedList);
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-check-box {
  width: calc(100% - 52px);
  height: 24px;
  display: flex;
  .item {
    width: 62px;
    height: 24px;
    margin-left: 24px;
  }
  .whole-item {
    width: 62px;
    height: 24px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    font-size: 12px;
    line-height: 24px;
    margin-left: 24px;
    border: 1px solid #BEBEBE;
    &:hover {
      background: #2080f7;
      color: white;
    }
    &.active {
      background: #2080f7;
      color: white;
    }
  }
}
</style>