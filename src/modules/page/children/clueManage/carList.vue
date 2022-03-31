<template>
  <el-scrollbar wrap-class="car-list-scrollbar-wrap">
    <div class="car-list">
      <div
        class="car-list-item"
        @click="addIntoGroup('加入新建自用车辆', 1, '2')"
      >
        <div class="car-list-item-inset">
          <!-- <div class="car-list-item-inset-icon"><i class="h-icon-add"></i></div> -->
          <div style="width: 90%; text-align: center; margin-top: 30px">
            添加到新的<span style="font-weight: bold">自用车辆</span>分组
          </div>
        </div>
      </div>
      <div
        class="car-list-item"
        @click="addIntoGroup('加入新建可疑车辆', 2, '1')"
      >
        <div class="car-list-item-inset">
          <!-- <div class="car-list-item-inset-icon">
            <i class="h-icon-add" style="color: #ff3333"></i>
          </div> -->
          <div style="width: 90%; text-align: center; margin-top: 30px">
            添加到新的<span style="font-weight: bold">可疑车辆</span>分组
          </div>
        </div>
      </div>
      <div
        class="car-list-item"
        v-for="item in carListArr"
        :key="item.id"
        @click="addIntoGroup('加入该', 3, item.bikeLabel, item.bike_code, item)"
      >
        <div class="car-list-item-img">
          <h-img-view :src="item.pic_url[0]" mode="fill" />
        </div>
        <div class="car-list-item-carCode">
          <div
            class="car-list-item-carCode-question"
            v-if="item.bikeLabel === 1"
          >
            <div class="car-list-item-carCode-question-code">
              {{ item.bike_code }}
            </div>
            可疑车辆
          </div>
          <div class="car-list-item-carCode-own" v-else>
            <div class="car-list-item-carCode-own-code">
              {{ item.bike_code }}
            </div>
            自用车辆
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import helper from "@/helper";
import api from "@/api";
import rest from "@/rest";
import moment from "moment";
// import Bus from "@/bus";

export default {
  name: "carList",
  data() {
    return {
      carListArr: [],
    };
  },
  props: {
    certificateNumber: {
      type: String,
      default: "",
    },
    initCarListFlag: {
      type: Boolean,
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
    initCarListFlag() {
      this.initList();
    },
  },
  mounted() {
    this.initList();
  },
  methods: {
    initList() {
      this.carListArr.length = 0;
      rest
        .get(api.clueManage.findBikeLabelAndCodes, {
          humanId: this.certificateNumber,
          bikeLabel: 1,
          startTime: moment(this.startTime).format("YYYY-MM-DD 00:00:00"),
          endTime: moment(this.endTime).format("YYYY-MM-DD 23:59:59"),
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            let result = res.data ? res.data : [];
            result.forEach((item) => {
              item.bikeLabel = 1;
            });
            this.carListArr = this.carListArr.concat(result);
          } else {
            this.$message.error(res.msg);
          }
        });
      // 获取自用车辆列表
      rest
        .get(api.clueManage.findBikeLabelAndCodes, {
          humanId: this.certificateNumber,
          bikeLabel: 2,
          startTime: moment(this.startTime).format("YYYY-MM-DD 00:00:00"),
          endTime: moment(this.endTime).format("YYYY-MM-DD 23:59:59"),
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            let result = res.data ? res.data : [];
            result.forEach((item) => {
              item.bikeLabel = 2;
            });
            this.carListArr = this.carListArr.concat(result);
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    addIntoGroup(mes, type, bikeLabel, bikeCode, item) {
      this.$emit("addIntoGroup", mes, type, bikeLabel, bikeCode, item);
    },
  },
};
</script>

<style lang="scss">
.car-list-scrollbar-wrap {
  position: relative;
  width: 98%;
  // padding: 25px 0 25px 16px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
<style lang="scss" scoped>
.car-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-top: 16px;
  &-item {
    width: 166px;
    height: 166px;
    margin-left: 16px;
    margin-top: 16px;
    cursor: pointer;
    &:nth-child(1),
    &:nth-child(2) {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #ebebeb;
      .car-list-item-inset {
        width: 100%;
        height: 100%;
        background: url(~@/assets/images/clueManage/ownCarNormal.png);
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.7);
        letter-spacing: 0;
        &-icon {
          width: 100%;
          text-align: center;
          > i {
            font-size: 24px;
            color: #4a90e2;
          }
        }
        &:hover {
          background: url(~@/assets/images/clueManage/ownCarHover.png);
          background-size: 100% 100%;
        }
      }
    }
    &:nth-child(2) {
      .car-list-item-inset {
        background: url(~@/assets/images/clueManage/doubtCarNormal.png);
        background-size: 100% 100%;
        &:hover {
          background: url(~@/assets/images/clueManage/doubtCarHover.png);
          background-size: 100% 100%;
        }
      }
    }
    &-img {
      width: 100%;
      height: 86%;
    }
    &-carCode {
      width: 100%;
      height: 14%;
      &-question {
        height: 100%;
        width: 100%;
        text-align: center;
        background: #ffeaea;
        border-radius: 2.4px;
        position: relative;
        color: rgba(255, 0, 0, 0.7);
        &-code {
          position: absolute;
          top: 0;
          left: 0;
          width: 22px;
          height: 100%;
          background: #ff3333;
          font-family: PingFangSC-Semibold;
          font-size: 14.4px;
          color: #ffffff;
          letter-spacing: 0;
        }
      }
      &-own {
        height: 100%;
        width: 100%;
        text-align: center;
        background: #edf4ff;
        border-radius: 2.4px;
        position: relative;
        color: #4a90e2;
        &-code {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 22px;
          background: #4a90e2;
          font-family: PingFangSC-Semibold;
          font-size: 14.4px;
          color: #ffffff;
          letter-spacing: 0;
        }
      }
    }
  }
}
</style>