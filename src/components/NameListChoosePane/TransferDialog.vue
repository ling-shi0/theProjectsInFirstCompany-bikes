<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-05-26 16:31:59
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-01 19:50:41
-->
<template>
  <div class="transfer-dialog">
    <el-dialog
      title="选择名单库"
      :visible.sync="dialogVisible"
      :area="[800, 470]"
      @close="cancel"
    >
      <div class="transfer-dialog-pane">
        <transfer
          :titles="['名单库列表', '已选名单库']"
          :footerVisible="false"
          :labelName="'libName'"
          :filterPlaceHolders="['输入关键词查询名单库', '请输入关键词过滤']"
          @on-left-scrolling="fetchNewPageNo"
          :labelId="'libCode'"
          :leftData="leftListData"
          :rightData="rightListData"
          @change="rightDataChange"
          :leftSearchMethod="searchNewNameList"
          :rightSearchMethod="rightDataFilter"
        ></transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveTransform">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
import rest from "@/rest";
import helper from "@/helper";
import Transfer from "./Transfer";

export default {
  name: "TransferDialog",
  props: {
    visible: Boolean,
    defaultCheckedVal: Array,
  },
  components: {
    Transfer,
  },
  data() {
    return {
      dialogVisible: false,
      leftListData: [],
      rightListData: [],
      rightListObjs: [],
      nameListTempStr: "",
      waitTimer: false,
      namelistPage: {
        pageNo: 1,
        pageSize: 20,
      },
      tempRightData: [],
      rightFilterFlag: false,
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
      this.querySearchAsync("", () => {
        this.rightListData = this.defaultCheckedVal;
      });
    },
    rightListData(val) {
      this.rightListObjs = val;
      !this.rightFilterFlag && (this.tempRightData = val);
    },
  },
  methods: {
    /**
     *  右侧数据变化之后
     */
    rightDataChange(val) {
      this.$set(this, "rightListObjs", val);
      !this.rightFilterFlag && (this.tempRightData = val);
    },
    /**
     *  输入新的名称搜索的时候
     */
    searchNewNameList(str) {
      this.querySearchAsync(str);
    },
    /**
     *  下滑滚动分页搜索
     */
    fetchNewPageNo(percentY) {
      if (percentY > 0.9 && !this.waitTimer) {
        this.namelistPage.pageNo += 1;
        this.waitTimer = true;
        rest
          .post(api.taskConfig.getNameList, {
            libName: this.nameListTempStr,
            pageNo: this.namelistPage.pageNo,
            pageSize: this.namelistPage.pageSize,
          })
          .done((res) => {
            if (helper.isSuccess(res)) {
              this.leftListData = this.leftListData.concat(res.data.list);
              setTimeout(() => {
                this.waitTimer = false;
              }, 200);
            } else {
              this.$message.error(res.msg);
              setTimeout(() => {
                this.waitTimer = false;
              }, 200);
            }
          })
          .catch((err) => {
            this.$message.error(err);
            setTimeout(() => {
              this.waitTimer = false;
            }, 200);
          });
      }
    },
    /**
     *  保存最后结果
     */
    saveTransform() {
      this.$emit("valueChange", this.tempRightData);
      this.dialogVisible = false;
      this.$emit("closeDialog");
    },
    cancel() {
      this.dialogVisible = false;
      this.$emit("closeDialog");
      this.leftListData = [];
      this.rightListData = [];
      this.rightListObjs = [];
    },
    querySearchAsync(nameStr, cb) {
      // 获得远程名单库信息
      this.nameListTempStr = nameStr;
      this.namelistPage.pageNo = 1;
      rest
        .post(api.taskConfig.getNameList, {
          libName: nameStr,
          pageNo: this.namelistPage.pageNo,
          pageSize: this.namelistPage.pageSize,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.leftListData = res.data.list;
            setTimeout(() => {
              this.waitTimer = false;
            }, 200);
            cb && cb();
          } else {
            this.$message.error(res.msg);
            setTimeout(() => {
              this.waitTimer = false;
            }, 200);
          }
        })
        .catch((err) => {
          this.$message.error(err);
          setTimeout(() => {
            this.waitTimer = false;
          }, 200);
        });
    },
    rightDataFilter(nameStr) {
      if (!nameStr) {
        this.rightFilterFlag = false;
        this.rightListData = this.tempRightData;
      } else {
        this.rightFilterFlag = true;
        this.rightListData = this.rightListData.filter(
          (item) => item.libName.indexOf(nameStr) > -1
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.transfer-dialog {
  &-pane {
    width: 770px;
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
<style lang="scss">
.transfer-dialog-pane {
  & .el-transfer {
    width: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
    & .el-transfer-panel {
      width: 40% !important;
    }
    & .el-scrollbar.has-gutter {
      height: calc(100% - 52px);
    }
  }
}
</style>