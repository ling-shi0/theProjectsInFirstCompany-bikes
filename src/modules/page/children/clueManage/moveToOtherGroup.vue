<template>
  <el-dialog
    title="添加到车辆分组"
    :visible.sync="dialogVisible"
    :area="[1744, 790]"
    top="middle"
    @close="
      () => {
        $emit('closeDialog');
        cancelBut && $emit('init');
      }
    "
  >
    <div class="move-group-dialog">
      <div class="move-group-dialog-left">
        <div class="move-group-dialog-left-carousel">
          <h-img-carousel
            :data="moveCheckedArr"
            theme="light"
            :current-index.sync="currentIndex"
            style="width: 100%; height: 100%"
          />
        </div>
        <div class="move-group-dialog-left-album">
          <h-album
            :data="moveCheckedArr"
            :current-index.sync="currentIndex"
            style="width: 100%; height: 100%"
            :shadow="false"
          >
            <template slot="item" slot-scope="{ item }">
              <AlbumItem
                :itemData="item"
                :itemFlag="item.flag"
                @flagChange="changeAlbumFlag(item.key)"
              ></AlbumItem>
            </template>
          </h-album>
        </div>
      </div>
      <div class="move-group-dialog-right">
        <car-list
          :certificateNumber="certificateNumber"
          @addIntoGroup="addIntoGroup"
          :initCarListFlag="initCarListFlag"
          :startTime="startTime"
          :endTime="endTime"
        ></car-list>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import api from "@/api";
import rest from "@/rest";
import helper from "@/helper";
import carList from "./carList";
import groupDialog from "@/components/groupDialog";
import AlbumItem from "./albumItem.vue";
import Bus from "@/bus";

export default {
  name: "moveToOtherGroup",
  data() {
    return {
      dialogVisible: false,
      moveCheckedArr: [],
      currentIndex: 0,
      cancelBut: false,
      initCarListFlag: false,
    };
  },
  components: {
    carList,
    AlbumItem,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    certificateNumber: {
      type: String,
      default: "",
    },
    moveGroups: {
      type: [Array, Object],
      default: [],
    },
    startTime: {
      type: [String, Date],
      default: "",
    },
    endTime: {
      type: [String, Date],
      default: "",
    },
  },
  watch: {
    visible(val) {
      this.moveCheckedArr.length = 0;
      this.dialogVisible = val;
      this.currentIndex = 0;
    },
    dialogVisible(val) {
      val &&
        (this.initCarListFlag = !this.initCarListFlag) &&
        (this.cancelBut = false);
    },
    moveGroups(arr) {
      const newArr = [];
      arr &&
        arr.forEach((item) => {
          newArr.push({
            url: item.picUrl,
            key: item.id,
            title: item.placeAddress,
            flag: true,
            bikeCode: item.bikeCode,
            bikeLabel: item.bikeLabel,
            archiveCode: item.archiveCode,
          });
        });
      this.$set(this, "moveCheckedArr", newArr);
    },
  },
  methods: {
    closeDialog() {
      this.$emit("init");
      this.$emit("closeDialog");
      this.dialogVisible = false;
    },
    cancel() {
      this.$emit("init");
      this.$emit("closeDialog");
      this.cancelBut = true;
      this.dialogVisible = false;
    },
    createNewGroup(bikeLabel, bikeCode) {
      let checkedArr = [];
      this.moveCheckedArr.forEach((item) => {
        if (item.flag) {
          checkedArr.push(item.key);
        }
      });
      if (!checkedArr.length) {
        this.$message.error("请勾选要移动的线索！");
        return;
      }
      let judgeBikeLabel =
        bikeLabel === "0" || bikeLabel === 0 ? null : bikeLabel;
      let params = {
        humanId: this.certificateNumber,
        clueIds: checkedArr,
        archiveCode: this.moveGroups[this.currentIndex].archiveCode,
        // clueInfoDOList: paramArr,
        bikeLabel: judgeBikeLabel,
        archiveType: this.moveGroups[this.currentIndex].archiveType ? 1 : null,
        vehicleColorNote: "",
        vehicleFeatureNote: "",
        otherNote: "",
      };
      rest.post(api.clueManage.clueGroup, params).done((res) => {
        if (helper.isSuccess(res)) {
          this.$message.success("创建归类成功!");
          this.initCarListFlag = !this.initCarListFlag;
          Bus.$emit("clearCarArr");
          Bus.$emit("refreshCarModelGroup");
          this.spliceAndCloseDialog(checkedArr);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    addIntoGroup(mes, type, bikeLabel, bikeCode, item) {
      let typeMap = {
        1: this.createNewGroup,
        2: this.createNewGroup,
        3: this.addCarClassify,
      };
      this.$confirm(`确定将左侧所选线索${mes}分组?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          typeMap[type](bikeLabel, bikeCode, item);
        })
        .catch(() => {});
    },
    async addCarClassify(bikeLabel, bikeCode, item) {
      let that = this;
      // 判断是否全部已经为将要归类的分组
      let checkedArr = this.moveCheckedArr.filter((item) => item.flag);
      if (
        checkedArr.every((selectItem) => {
          return (
            selectItem.bikeCode === bikeCode &&
            bikeLabel === selectItem.bikeLabel
          );
        })
      ) {
        this.$message.warning("所选线索已全部在该分组中!", 3000);
        return;
      }
      let list = [];
      // if (item && item.archiveInfo && item.archiveInfo.archive_code) {
      //   list.push(item.archiveInfo.archive_code);
      // }
      checkedArr.forEach((selectItem) => {
        if (
          selectItem.archiveCode &&
          list.indexOf(selectItem.archiveCode) < 0
        ) {
          list.push(selectItem.archiveCode);
        }
      });
      let ifCancel = false;
      let archiveCode = null;
      if (
        list.length === 0 &&
        item &&
        item.archiveInfo &&
        item.archiveInfo.archive_code
      ) {
        archiveCode = item.archiveInfo.archive_code;
      } else if (list.length > 0) {
        if (
          item &&
          item.archiveInfo &&
          item.archiveInfo.archive_code &&
          list.indexOf(item.archiveInfo.archive_code) < 0
        ) {
          list.unshift(item.archiveInfo.archive_code);
        }
        if (list.length > 1) {
          await groupDialog
            .show(list)
            .then((res) => {
              // 返回序号
              if (typeof res === "number") archiveCode = list[res];
            })
            .catch(() => {
              //cancel
              ifCancel = true;
            });
        } else if (
          !(item && item.archiveInfo && item.archiveInfo.archive_code) ||
          list[0] !== item.archiveInfo.archive_code
        ) {
          archiveCode = list[0];
        }
      }
      if (!ifCancel) {
        let ids = checkedArr.map((item) => item.key);
        if (ids.length == 0) {
          that.$message.success("请选择线索！");
        } else {
          let judgeBikeLabel =
            bikeLabel === "0" || bikeLabel === 0 ? null : bikeLabel;
          let judgeBikeCode =
            bikeCode === "0" || bikeCode === 0 ? null : bikeCode;
          let params = {
            humanId: this.certificateNumber,
            clueIds: ids,
            bikeLabel: judgeBikeLabel, // 可疑车辆、自用车辆
            bikeCode: judgeBikeCode,
            archiveCode,
            archiveType: archiveCode
              ? !(item && item.archiveInfo) ||
                archiveCode !== item.archiveInfo.archive_code
                ? 1 // 线索
                : 2 // 可疑车辆
              : null,
            vehicleColorNote: item.vehicleColorNote,
            vehicleFeatureNote: item.vehicleFeatureNote,
            otherNote: item.otherNote,
          };
          rest.post(api.clueManage.clueGroup, params).done((res) => {
            if (helper.isSuccess(res)) {
              that.$message.success("添加成功");
              this.initCarListFlag = !this.initCarListFlag;
              this.spliceAndCloseDialog(ids);
              Bus.$emit("clearCarArr");
              Bus.$emit("refreshCarModelGroup");
            } else {
              that.$message.error(res.msg);
            }
          });
        }
      }
    },
    changeAlbumFlag(key) {
      for (let i = 0; i < this.moveCheckedArr.length; i++) {
        if (this.moveCheckedArr[i].key === key) {
          this.$set(
            this.moveCheckedArr[i],
            "flag",
            !this.moveCheckedArr[i].flag
          );
          break;
        }
      }
    },
    // async addCarClassify(bikeLabel, bikeCode, item) {
    //   let that = this;
    //   let itemType = this.moveGroups[this.currentIndex];
    //   // console.log(this.moveGroups[this.currentIndex]);
    //   if (
    //     itemType.bikeCode &&
    //     bikeCode &&
    //     itemType.bikeCode == bikeCode &&
    //     itemType.bikeLabel == bikeLabel
    //   ) {
    //     this.$message.warning("线索已在该分组中!", 3000);
    //     return;
    //   }
    //   let ifCancel = false;
    //   let archiveCode = null;
    //   if (item && item.archiveInfo && itemType.archiveCode) {
    //     if (itemType.archiveCode !== item.archiveInfo.archive_code) {
    //       archiveCode = item.archiveInfo.archive_code;
    //       let list = [item.archiveInfo.archive_code, itemType.archiveCode];
    //       await groupDialog
    //         .show(list)
    //         .then((res) => {
    //           // 返回序号
    //           if (res && res !== 0) archiveCode = list[res];
    //         })
    //         .catch(() => {
    //           //cancel
    //           ifCancel = true;
    //         });
    //     }
    //   } else if (item && item.archiveInfo) {
    //     archiveCode = item.archiveInfo.archive_code;
    //   } else if (itemType && itemType.archiveCode) {
    //     archiveCode = itemType.archiveCode;
    //   }
    //   if (!ifCancel) {
    //     let pamars = {
    //       clueIds: [itemType.id],
    //       bikeLabel: bikeLabel, // 可疑车辆、自用车辆
    //       bikeCode: bikeCode,
    //       humanId: this.certificateNumber,
    //       archiveCode,
    //       archiveType: archiveCode
    //         ? !(item && item.archiveInfo) ||
    //           archiveCode !== item.archiveInfo.archive_code
    //           ? 1
    //           : 2
    //         : null,
    //     };
    //     rest.post(api.clueManage.clueGroup, pamars).done((res) => {
    //       if (helper.isSuccess(res)) {
    //         that.$message.success("添加成功");
    //         this.initCarListFlag = !this.initCarListFlag;
    //         Bus.$emit("clearCarArr");
    //         Bus.$emit("refreshCarModelGroup");
    //         this.removeAlbumPic();
    //       } else {
    //         that.$message.error(res.msg);
    //       }
    //     });
    //   }
    // },
    spliceAndCloseDialog(ids) {
      ids &&
        ids.forEach((item) => {
          for (let i = 0; i < this.moveGroups.length; i++) {
            if (item === this.moveGroups[i].id) {
              this.moveGroups.splice(i, 1);
            }
          }
        });
      if (this.moveGroups.length === 0) {
        this.closeDialog();
      }
    },
  },
};
</script>

<style lang="scss">
.move-group-dialog {
  & .h-img-carousel__prev,
  .h-img-carousel__next {
    border: none;
  }
}
</style>
<style lang="scss" scoped>
.move-group-dialog {
  width: 1730px;
  height: 670px;
  display: flex;
  &-left {
    width: 980px;
    height: 100%;
    border-right: 1px #e6e6e6 solid;
    &-carousel {
      height: 75%;
      width: 100%;
    }
    &-album {
      height: 23%;
      width: 100%;
    }
  }
  &-right {
    width: 750px;
    height: 100%;
  }
}
</style>