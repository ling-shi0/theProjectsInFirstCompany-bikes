<!--
 * @Description: 
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-09-07 16:01:46
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-12-20 17:07:07
-->
<template>
  <div class="edit-remark-pane">
    <i
      class="h-icon-edit edit-icon"
      title="编辑/修改分组备注信息"
      @click="editGroup"
    ></i>
    <h3 class="color_fff fw_n dib" v-if="!dontShowTitle">分组备注</h3>
    <div v-if="showNote">
      <div class="edit-pane" v-if="editFlag">
        <div>
          车身颜色:<el-input
            v-model="remark.vehicleColorNote"
            style="width: calc(100% - 55px)"
            class="edit-remark-pane-input"
            placeholder="请输入车身颜色"
          ></el-input>
        </div>
        <div>
          车辆特征:<el-input
            v-model="remark.vehicleFeatureNote"
            style="width: calc(100% - 55px)"
            class="edit-remark-pane-input"
            placeholder="请输入车辆特征"
          ></el-input>
        </div>
        <div>
          <el-input
            v-model="remark.otherNote"
            class="edit-remark-pane-input"
            type="textarea"
            :rows="1"
            placeholder="请输入其他备注"
          ></el-input>
        </div>
        <div>
          <el-button
            type="primary"
            @click="saveRecord"
            class="edit-remark-pane-but"
            >保 存</el-button
          >
          <el-button
            @click="cancelRecord"
            class="edit-remark-pane-but edit-remark-pane-cancel"
            >取 消</el-button
          >
        </div>
      </div>
      <div class="show-pane" v-else>
        <div>
          车身颜色: <span>{{ itemMes.vehicleColorNote }}</span>
        </div>
        <div>
          车辆特征: <span>{{ itemMes.vehicleFeatureNote }}</span>
        </div>
        <div>
          <span>{{ itemMes.otherNote }}</span>
        </div>
        <div></div>
      </div>
    </div>
    <div v-else>
      <h-empty size="xs"
        ><template #description>
          暂未相关备注，点击<el-button type="link" @click="editGroup"
            >备注</el-button
          >
        </template></h-empty
      >
    </div>
  </div>
</template>

<script>
import helper from "@/helper";
import api from "@/api";
import rest from "@/rest";

export default {
  name: "EditRemarkPane",
  props: {
    itemMes: Object,
    groupMes: Object,
    dontShowTitle: Boolean,
  },
  mounted() {
    this.showNote =
      this.itemMes.vehicleColorNote ||
      this.itemMes.vehicleFeatureNote ||
      this.itemMes.otherNote;
    this.remark.vehicleColorNote = this.itemMes.vehicleColorNote;
    this.remark.vehicleFeatureNote = this.itemMes.vehicleFeatureNote;
    this.remark.otherNote = this.itemMes.otherNote;
  },
  watch: {
    itemMes(val) {
      this.showNote =
        val.vehicleColorNote || val.vehicleFeatureNote || val.otherNote;
      this.remark.vehicleColorNote = val.vehicleColorNote;
      this.remark.vehicleFeatureNote = val.vehicleFeatureNote;
      this.remark.otherNote = val.otherNote;
    },
  },
  data() {
    return {
      showNote: false,
      editFlag: false,
      remark: {
        vehicleColorNote: "",
        vehicleFeatureNote: "",
        otherNote: "",
      },
    };
  },
  methods: {
    saveRecord() {
      rest
        .post(api.clueManage.updateNote, {
          humanId: this.groupMes.humanId,
          bikeCode: this.groupMes.bikeCode,
          bikeLabel: this.groupMes.bikeLabel,
          notesVO: { ...this.remark },
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.$message.success("保存成功!");
            this.$emit("refreshCarGroup", { ...this.remark });
            this.$nextTick(() => {
              this.showNote = true;
              this.editFlag = false;
            });
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    cancelRecord() {
      this.showNote =
        this.itemMes.vehicleColorNote ||
        this.itemMes.vehicleFeatureNote ||
        this.itemMes.otherNote;
      this.editFlag = false;
    },
    editGroup() {
      this.showNote = true;
      this.editFlag = true;
    },
  },
};
</script>

<style lang="scss">
.edit-remark-pane-input input,
.edit-remark-pane-input textarea {
  height: 18px;
  border: none;
  outline: none;
  font-size: 12px;
}
.edit-remark-pane-but {
  width: 35px;
  height: 18px;
  max-width: 35px;
  min-width: 35px;
  background: rgba(32, 128, 247, 0.1);
  border-radius: 2px;
  font-size: 12px;
  padding: 0;
  color: #2080f7;
  border: none;
  &.edit-remark-pane-cancel {
    background: #fbfbfb;
    color: rgba(0, 0, 0, 0.7);
  }
}
</style>
<style lang="scss" scoped>
.edit-remark-pane {
  width: 260px;
  height: 136px;
  background: #fbfbfb;
  position: relative;
  font-size: 12px;
  h3 {
    background-image: linear-gradient(174deg, #fdc12d 0%, #fa8d14 100%);
    border: 1px solid #f2a520;
    border-radius: 1px;
    padding: 0 5px;
  }
  > div {
    width: 100%;
    height: calc(100% - 24px);
    .edit-pane,
    .show-pane {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-around;
      color: rgba(102, 67, 67, 0.3);
      padding: 8px;
      > div {
        width: 100%;
        display: flex;
        align-items: center;
        > span {
          color: rgba(0, 0, 0, 0.7);
        }
      }
      > div:last-child {
        justify-content: flex-end;
      }
    }
  }
  .edit-icon {
    position: absolute;
    top: -34px;
    right: 0px;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 1.5rem;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
}
</style>