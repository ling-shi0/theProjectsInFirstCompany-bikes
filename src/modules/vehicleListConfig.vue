<template>
  <div class="config">
    <div class="config-main">
      <div class="config-main-cloud">
        <div class="config-main-cloud-title">云存储配置</div>
        <div class="config-main-cloud-content">
          <div class="config-main-cloud-content-item">
            <div class="config-main-cloud-content-item-title">存储服务</div>
            <div>
              <el-select v-model="saveServe" placeholder="请选择">
                <el-option
                  v-for="item in serveOptions"
                  :key="item.deviceId"
                  :label="item.deviceName"
                  :value="item.deviceId"
                  @click.native="chooseServeSelect(item, 0)"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="config-main-cloud-content-item">
            <div class="config-main-cloud-content-item-title">存储池</div>
            <div>
              <el-select
                v-model="savePool"
                placeholder="请选择"
                :disabled="poolDisable"
              >
                <el-option
                  v-for="item in poolOptions"
                  :key="item.poolId"
                  :label="item.poolName"
                  :value="item.poolId"
                  @click.native="chooseServeSelect(item, 1)"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>

      <!-- <span>电动车名单库配置</span>
      <div>
        <div>
          电动车累犯名单库名称<span style="color: red;">*</span><el-tooltip
            content="电动车同步案件管理刑嫌名单库的名称"
            placement="top-start"
            ><i class="h-icon-info config-main-title-icon"></i
          ></el-tooltip>
        </div>
        <el-select v-model="formDatas.listInput" placeholder="请选择">
          <el-option
            v-for="(item, index) in namelist"
            :key="index"
            :label="item.libName"
            :value="index"
          >
            <span>{{ item.libName }}</span>
          </el-option>
        </el-select>
      </div> -->
      <div class="config-main-bike">
        <div class="config-main-bike-title">一人多骑配置</div>
        <div class="config-main-bike-content">
          <el-form
            :model="formDatas"
            style="
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: space-around;
            "
          >
            <!-- <el-row>
              <div>
                一人多骑天数阈值<span style="color: red">*</span
                ><el-tooltip
                  content="配置一人多骑数据计算的最大天数"
                  placement="top-start"
                  ><i
                    class="h-icon-info config-main-title-icon"
                    style="position: relative; top: 5px"
                  ></i
                ></el-tooltip>
              </div>
              <el-form-item
                :prop="'dayCounts'"
                :error="dayCountsError"
                style="width: 100%"
              >
                <el-input
                  class="config-main-input"
                  v-model="formDatas.dayCounts"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-row> -->
            <div style="width: 42%">
              <div>
                一人多骑次数阈值<span style="color: red">*</span
                ><el-tooltip
                  content="配置一人多骑推送的最低次数"
                  placement="top-start"
                  ><i
                    class="h-icon-info config-main-title-icon"
                    style="position: relative; top: 5px"
                  ></i
                ></el-tooltip>
              </div>
              <el-form-item
                :prop="'timesCount'"
                :error="timesCountError"
                style="width: 100%"
              >
                <el-input
                  class="config-main-input"
                  v-model="formDatas.timesCount"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </div>
            <!-- </el-row>
            <el-row> -->
            <div style="width: 42%">
              <div>
                策略推送阈值<span style="color: red">*</span
                ><el-tooltip
                  content="配置策略推送阈值(范围0 - 100)"
                  placement="top-start"
                  ><i
                    class="h-icon-info config-main-title-icon"
                    style="position: relative; top: 5px"
                  ></i
                ></el-tooltip>
              </div>
              <el-form-item
                :prop="'strategyThresholdCount'"
                :error="strategyThresholdCountError"
                style="width: 100%"
              >
                <el-input
                  class="config-main-input"
                  v-model="formDatas.strategyThresholdCount"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="config-main-buts">
        <el-button type="info" @click="handleClickBut(false)">保存</el-button>
        <el-button type="default" @click="reset">重置</el-button>
      </div>
      <!-- <div class="refresh-icon" title="同步名单库" @click="handleClickRefresh">
        <i class="h-icon-refresh"></i>同步名单库
      </div> -->
    </div>
  </div>
</template>

<script>
import api from "@/api";
import rest from "@/rest";
import helper from "@/helper";

export default {
  async mounted() {
    await this.initSelect();
    this.getAllSystemConfig();
  },
  computed: {
    formDayCount: function () {
      return this.formDatas.dayCounts;
    },
    formTimesCount: function () {
      return this.formDatas.timesCount;
    },
    strategyThresholdCount: function () {
      return this.formDatas.strategyThresholdCount;
    },
  },
  watch: {
    formDayCount: function (val) {
      if (!val || !+val.toString() || val < 30) {
        this.dayCountsError = "一人多骑最大天数应大于30天";
      } else {
        this.dayCountsError = "";
      }
    },
    formTimesCount: function (val) {
      if (!val || !+val.toString() || val < 2) {
        this.timesCountError = "一人多骑推送的最低次数应大于2次";
      } else {
        this.timesCountError = "";
      }
    },
    strategyThresholdCount: function (val) {
      if (!val || !+val.toString() || val < 0 || val > 100) {
        this.strategyThresholdCountError = "阈值应大于0小于100";
      } else {
        this.strategyThresholdCountError = "";
      }
    },
    saveServe(val) {
      if (!val) {
        this.poolDisable = true;
        this.savePool = "";
      } else {
        this.poolDisable = false;
        this.savePool = "";
        this.getPoolData(val);
      }
    },
  },
  data() {
    return {
      formDatas: {
        dayCounts: "",
        timesCount: "",
        listInput: "",
        strategyThresholdCount: "",
      },
      namelist: [],
      initDatas: {
        dayCounts: "",
        timesCount: "",
        listInput: "",
        strategyThresholdCount: "",
      },
      id: [],
      timesCountError: "",
      dayCountsError: "",
      strategyThresholdCountError: "",
      saveServe: "",
      savePool: "",
      serveOptions: [],
      poolOptions: [],
      poolDisable: true,
      frequentTimesParam: {},
      strategyThresholdParam: {},
      hcsServerInfoDTO: {},
      activeServeObj: {},
      activePoolObj: {},
    };
  },
  methods: {
    handleClickBut() {
      if (this.timesCountError || this.strategyThresholdCountError) {
        this.$message.warning("请修改一人多骑配置信息!", 3000);
        return false;
      }
      if (
        !this.formDatas.timesCount ||
        !this.formDatas.strategyThresholdCount
      ) {
        this.$message.warning("请完善一人多骑配置信息!", 3000);
        return false;
      }
      if (!this.saveServe || !this.savePool) {
        this.$message.warning("请进行云存储配置！", 3000);
        return false;
      }
      let hcsServerInfoDTO = {};
      if (
        !(this.activeServeObj && this.activeServeObj.deviceId) &&
        !(this.activePoolObj && this.activePoolObj.poolId)
      ) {
        Object.assign(hcsServerInfoDTO, this.hcsServerInfoDTO, {
          id: (this.hcsServerInfoDTO && this.hcsServerInfoDTO.id) || "",
        });
      } else if (!(this.activeServeObj && this.activeServeObj.deviceId)) {
        Object.assign(
          hcsServerInfoDTO,
          this.hcsServerInfoDTO,
          this.activePoolObj,
          {
            id: (this.hcsServerInfoDTO && this.hcsServerInfoDTO.id) || "",
          }
        );
      } else if (!(this.activePoolObj && this.activePoolObj.poolId)) {
        Object.assign(
          hcsServerInfoDTO,
          this.hcsServerInfoDTO,
          this.activeServeObj,
          {
            id: (this.hcsServerInfoDTO && this.hcsServerInfoDTO.id) || "",
          }
        );
      } else {
        Object.assign(
          hcsServerInfoDTO,
          this.activeServeObj,
          this.activePoolObj,
          {
            id: (this.hcsServerInfoDTO && this.hcsServerInfoDTO.id) || "",
          }
        );
      }
      rest
        .post(api.systemConfig.saveConfig, {
          frequentTimesParam: {
            id: (this.frequentTimesParam && this.frequentTimesParam.id) || "",
            frequentTimes: this.formDatas.timesCount,
          },
          strategyThresholdParam: {
            id:
              (this.strategyThresholdParam && this.strategyThresholdParam.id) ||
              "",
            threshold: this.formDatas.strategyThresholdCount,
          },
          hcsServerInfoDTO,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.$message.success("保存成功!");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    async initSelect() {
      // 获得远程名单库信息
      // rest
      //   .get(api.systemConfig.getConfigLibInfo, {})
      //   .done((res) => {
      //     if (helper.isSuccess(res)) {
      //       this.namelist = res.data;
      //       this.getAllSystemConfig();
      //     } else {
      //       this.$message.error(res.msg);
      //     }
      //   })
      //   .catch((err) => {
      //     this.$message.error(err);
      //   });
      // 获得存储服务下拉框数据
      await rest
        .get(api.systemConfig.findDeviceList, {})
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.serveOptions = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    getAllSystemConfig() {
      // 获取所有配置信息
      rest
        .get(api.systemConfig.getAllSystemConfig, {})
        .done((res) => {
          if (helper.isSuccess(res)) {
            res = res.data;
            this.$set(this, "frequentTimesParam", res.frequentTimesParam);
            this.$set(this, "hcsServerInfoDTO", res.hcsServerInfoDTO);
            this.$set(
              this,
              "strategyThresholdParam",
              res.strategyThresholdParam
            );
            this.$set(
              this.formDatas,
              "timesCount",
              res.frequentTimesParam && res.frequentTimesParam.frequentTimes
            );
            this.formDatas.strategyThresholdCount =
              res.strategyThresholdParam.threshold;
            this.saveServe = res.hcsServerInfoDTO.deviceId;
            this.getPoolData(this.saveServe, res.hcsServerInfoDTO.poolId);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    reset() {
      this.formDatas.strategyThresholdCount = "";
      this.formDatas.timesCount = "";
      this.saveServe = "";
      this.savePool = "";
    },
    getPoolData(val, poolData) {
      // 获得存储池下拉框数据
      rest
        .get(api.systemConfig.findDevicePoolList, {
          deviceId: val,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.poolOptions = res.data;
            poolData && (this.savePool = poolData);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    chooseServeSelect(item, which) {
      if (which === 0) {
        this.activeServeObj = item;
      } else {
        this.activePoolObj = item;
      }
    },
  },
};
</script>

<style lang="scss">
.config {
  width: 100%;
  height: 100%;
  overflow: hidden;
  &-main {
    margin: 16px auto;
    width: 90%;
    height: 100%;
    position: relative;
    &-cloud {
      width: 100%;
      height: 216px;
      background: #ffffff;
      border: 1px solid #cdcdcd;
      &-title {
        width: 96%;
        height: 40px;
        margin: 16px auto 0;
        font-size: 16px;
        line-height: 40px;
        position: relative;
        text-indent: 12px;
        background: rgba(216, 216, 216, 0.2);
        &::after {
          content: "";
          width: 100%;
          height: 2px;
          position: absolute;
          left: 0;
          bottom: -4px;
          border-bottom: 1px solid #f0f0f0;
        }
      }
      &-content {
        width: 96%;
        margin: 0 auto;
        height: calc(100% - 60px);
        display: flex;
        justify-content: space-around;
        align-items: center;
        &-item {
          width: 42%;
        }
      }
    }
    &-bike {
      width: 100%;
      height: 216px;
      background: #ffffff;
      border: 1px solid #cdcdcd;
      margin-top: 16px;
      &-title {
        width: 96%;
        height: 40px;
        margin: 16px auto 0;
        font-size: 16px;
        line-height: 40px;
        position: relative;
        text-indent: 12px;
        background: rgba(216, 216, 216, 0.2);
        &::after {
          content: "";
          width: 100%;
          height: 2px;
          position: absolute;
          left: 0;
          bottom: -4px;
          border-bottom: 1px solid #f0f0f0;
        }
      }
      &-content {
        width: 96%;
        margin: 0 auto;
        height: calc(100% - 60px);
      }
    }
    &-buts {
      position: absolute;
      bottom: 60px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
    &-title-icon {
      margin-left: 5px;
      font-size: 1.7em;
    }
    &-input {
      width: 100%;
    }
  }
}
.refresh-icon {
  position: absolute;
  top: 62px;
  right: -6.4rem;
  width: 6.2rem !important;
  height: 2rem !important;
  display: flex;
  align-items: center;
  cursor: pointer;
  > i {
    font-size: 1.6rem;
  }
  &:hover {
    background: rgba(200, 200, 200, 0.6);
    > i {
      animation: selfRotate 0.5s infinite;
      animation-fill-mode: forwards;
    }
  }
}
@keyframes selfRotate {
  0% {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}
</style>
