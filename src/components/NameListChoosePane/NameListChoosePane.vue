<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-05-26 16:21:19
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-01 19:45:07
-->
<template>
  <div class="name-list-choose-pane">
    <div class="name-list-choose-pane-input" @click="handleIconClick">
      <div>{{ displayInputVal }}</div>
      <i class="h-icon-arrow_right"></i>
    </div>
    <transfer-dialog
      :visible="transferDialogVisible"
      @valueChange="transferValChange"
      @closeDialog="closeTransferDialog"
      :defaultCheckedVal="defaultCheckedVal"
    ></transfer-dialog>
  </div>
</template>

<script>
import TransferDialog from "./TransferDialog.vue";

export default {
  name: "NameListChoosePane",
  props: {
    defaultCheckedVal: Array,
  },
  data() {
    return {
      transferDialogVisible: false,
      valueChange: [],
      displayInputVal: "请点击选择名单库",
    };
  },
  components: {
    TransferDialog,
  },
  watch: {
    defaultCheckedVal(val) {
      this.displayNameChange(val);
    },
  },
  methods: {
    /**
     * 打开弹窗按钮
     */
    handleIconClick() {
      this.transferDialogVisible = true;
    },
    /**
     * 关闭穿梭框弹窗
     */
    closeTransferDialog() {
      this.transferDialogVisible = false;
    },
    /**
     * 选择更改
     */
    transferValChange(val) {
      this.valueChange = val;
      this.displayNameChange(val);
      this.$emit("valueChange", val);
    },
    /**
     *  展示名称修改
     */
    displayNameChange(val) {
      let str = "";
      if (val && val.length >= 2) {
        str += val[0].libName + "等";
      } else if (val && val.length === 1) {
        str += val[0].libName;
      }
      this.displayInputVal = str;
    },
  },
};
</script>

<style lang="scss" scoped>
.name-list-choose-pane {
  width: 100%;
  height: 30px;
  &-input {
    width: 100%;
    height: 100%;
    background: white;
    border: 1px solid rgb(179, 179, 179);
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 6px;
    color: rgb(153, 153, 153);
    > i {
      font-size: 16px;
      color: rgb(0, 0, 0);
    }
  }
}
</style>
