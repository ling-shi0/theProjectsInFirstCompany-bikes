<template>
  <div class="car-model-pane" id="car-model-pane-wrap">
    <!-- <el-scrollbar wrap-class="car-model-scrollbar-wrap"> -->
    <car-model-item
      v-for="(item, index) in carModelArr"
      :key="index"
      :itemData="item"
      @flagChangeArr="
        (item) => {
          $emit('flagChangeArr', item);
        }
      "
      :humanId="humanId"
      @refresh="init"
      :startTime="startTime"
      :endTime="endTime"
      @changeRemarkData="
        (data) => {
          carModelArr[index].otherNote = data.otherNote;
          carModelArr[index].vehicleColorNote = data.vehicleColorNote;
          carModelArr[index].vehicleFeatureNote = data.vehicleFeatureNote;
        }
      "
    ></car-model-item>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script>
import api from "@/api";
import rest from "@/rest";
import helper from "@/helper";
import carModelItem from "./carModelItem";
import Bus from "@/bus";

export default {
  name: "carModelGroup",
  data() {
    return {
      carModelArr: [],
    };
  },
  props: {
    humanId: {
      type: String,
      default: "",
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
  components: {
    carModelItem,
  },
  mounted() {
    this.init();
    Bus.$on("refreshCarModelGroup", (date) => {
      this.init(date);
    });
  },
  methods: {
    init(date) {
      rest
        .post(api.clueManage.bikeModelQuery, {
          humanId: this.humanId || this.$route.query.idCard,
          startTime:
            helper.dateFormat(
              "YYYY-mm-dd",
              (date && date[0] && new Date(date[0])) || new Date(this.startTime)
            ) + " 00:00:00",
          endTime:
            helper.dateFormat(
              "YYYY-mm-dd",
              (date && date[1] && new Date(date[1])) || new Date(this.endTime)
            ) + " 23:59:59",
          pageNo: 1,
          pageSize: 6,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            res.data.forEach((element) => {
              element.dragFlag = false;
            });
            this.carModelArr = res.data;
            Bus.$emit("clearCarArr");
          } else {
            that.$message.error(res.msg);
          }
        });
    },
  },
};
</script>

<style lang="scss">
// .car-model-scrollbar-wrap {
//   position: relative;
//   width: 100%;
//   // padding: 25px 0 25px 16px;
//   height: 100%;
//   overflow-y: auto;
//   overflow-x: hidden;
// }
</style>
<style lang="scss" scoped>
.car-model-pane {
  width: 100%;
  height: 94%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>