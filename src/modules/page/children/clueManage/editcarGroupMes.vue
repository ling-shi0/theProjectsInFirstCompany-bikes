<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-04-18 14:40:56
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-04-18 16:06:10
-->
<template>
  <el-dialog
    title="编辑分组信息"
    :visible.sync="dialogVisible"
    size="small"
    @close="cancel"
  >
    <div style="width: 80%; height: 100px; margin: 0 auto; color: black">
      分组备注：
      <el-input
        v-model="note"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="请输入"
      ></el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Bus from "@/bus.js";
import api from "@/api";
import rest from "@/rest";
import helper from "@/helper";
export default {
  name: "EditCarGroupMes",
  data() {
    return {
      dialogVisible: false,
      note: "",
      bikeCode: "",
      bikeLabel: "",
      humanId: "",
    };
  },
  mounted() {
    Bus.$on(
      "showCarEditGroupDialog",
      ({ visible, bikeCode, bikeLabel, humanId, note }) => {
        this.dialogVisible = visible;
        this.bikeCode = bikeCode;
        this.bikeLabel = bikeLabel;
        this.humanId = humanId;
        this.note = note;
      }
    );
  },
  methods: {
    save() {
      // if(!this.note) {
      //   return;
      // }
      rest
        .post(api.clueManage.updateNote, {
          humanId: this.humanId,
          bikeCode: this.bikeCode,
          bikeLabel: this.bikeLabel,
          note: this.note,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.$message.success("保存成功!");
            this.dialogVisible = false;
            this.note = "";
            this.$emit("refreshList");
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    cancel() {
      this.dialogVisible = false;
      this.note = "";
    },
  },
};
</script>

<style>
</style>