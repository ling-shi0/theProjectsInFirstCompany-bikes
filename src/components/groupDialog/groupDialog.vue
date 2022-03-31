<template>
  <el-dialog
    class="group-dialog"
    top="middle"
    title="分组提示"
    :visible.sync="showDialog"
    size="mini"
  >
    <p class="text">
      当前车辆关联案件与已分组车辆关联案件不同，请选择最终关联案件
    </p>
    <el-radio-group v-model="value">
      <el-radio
        :label="index"
        v-for="(item, index) in list"
        :key="item"
        class="radio"
        >{{ item }}</el-radio
      >
    </el-radio-group>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleConfirm">
        确 定
      </el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: "groupDialog",
  props: {
    choice: Array,
    callback: Function,
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: this.choice,
      showDialog: this.dialogVisible,
      value: 0
    };
  },
  watch: {
    choice(val) {
      this.list = val;
    },
    dialogVisible(val) {
      this.showDialog = val;
    }
  },
  methods: {
    // show(list) {
    //   this.list = list;
    //   this.showDialog = true;
    //   return new Promise(async (resolve, reject) => {
    //     let value = await this.getValue();
    //   });
    // },
    handleConfirm() {
      this.showDialog = false;
      this.callback("confirm", this.value);
    },
    handleCancel() {
      this.value = 0;
      this.showDialog = false;
      this.callback("cancel");
    }
  }
};
</script>
<style lang="scss" scoped>
.text {
  width: 25vw;
}
.radio {
  display: block;
  margin-left: 0;
}
</style>
<style lang="scss">
.group-dialog {
  .el-dialog {
    left: 50%;
    transform: translateX(-50%);
  }
  .el-dialog__body {
    padding: 32px 62px;
  }
}
</style>
