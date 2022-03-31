<template>
  <div class="strategy-config-pane">
    <div class="strategy-config-pane-main" v-if="!createFlag">
      <div class="strategy-config-pane-main-buttons">
        <el-button @click="addStrategy" icon="h-icon-add" size="small"
          >新增</el-button
        >
      </div>
      <div class="strategy-config-pane-main-table">
        <el-table
          :data="tableData"
          style="width: 100%; height: 80%"
          ref="multipleTable"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <table class="strategy-config-pane-main-table-innerTable">
                <thead>
                  <th style="text-align: center">策略类型</th>
                  <th style="text-align: center">策略占比</th>
                </thead>
                <tbody>
                  <tr v-for="item in props.row.strategyDetailVOList">
                    <td>{{ strategyTypeList[item.strategyType] }}</td>
                    <td>{{ judgePercentValue(item) }}</td>
                  </tr>
                </tbody>
              </table>
            </template>
          </el-table-column>
          <el-table-column label="序号" type="index" width="55">
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"> </el-table-column>
          <el-table-column label="策略信息">
            <template slot-scope="scope">
              <el-button
                @click="readStrategyDetail([tableData[scope.$index]])"
                type="link"
                size="small"
                >查看策略详情</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                @click="editTask(scope.row, scope.$index)"
                type="link"
                size="small"
                >修改</el-button
              >
              <el-button @click="deleteTask(scope.row)" type="link" size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="strategy-config-pane-create" v-else>
      <div class="strategy-config-pane-create-title">
        <i class="h-icon-angle_left" @click="cancelCreate"></i>返回列表
      </div>
      <div class="strategy-config-pane-create-timePane">
        <div class="strategy-config-pane-create-timePane-title">时间范围</div>
        <div class="strategy-config-pane-create-timePane-content">
          <div class="strategy-config-pane-create-timePane-content-item">
            <div>开始时间</div>
            <el-time-picker
              v-model="form.startTime"
              :unlink="true"
              placeholder="请任意时间点"
              value-format="HH:mm:ss"
            />
          </div>
          <div class="strategy-config-pane-create-timePane-content-item">
            <div>结束时间</div>
            <el-time-picker
              v-model="form.endTime"
              :unlink="true"
              placeholder="请任意时间点"
              value-format="HH:mm:ss"
            />
            <el-tooltip
              content="注意! 若抓拍线索不在已配置策略的时段内，只会按照车辆颜色去判断是否车辆相同"
              placement="bottom"
            >
              <i
                class="
                  h-icon-help
                  strategy-config-pane-create-timePane-content-item-icon
                "
              />
            </el-tooltip>
          </div>
        </div>
      </div>
      <div class="strategy-config-pane-create-strategyPane">
        <div class="strategy-config-pane-create-strategyPane-title">
          策略配置
        </div>
        <div class="strategy-config-pane-create-strategyPane-content">
          <div
            v-for="(item, index) in form.strategyDetailVOList"
            :key = "item.id"
            class="
              strategy-config-pane-create-strategyPane-content-strategyItem
            "
          >
            <div style="width: 30%">
              <div v-if="index === 0" style="margin-right: 1em">策略类型:</div>
              <el-select v-model="item.strategyType" placeholder="请选择">
                <el-option
                  v-for="(items, key) in strategyTypeList"
                  :key="key"
                  :label="items"
                  :value="key"
                >
                </el-option>
              </el-select>
            </div>
            <div style="width: 30%; position: relative">
              <div v-if="index === 0">占比:</div>
              <el-input
                v-model="item.proportion"
                placeholder="请输入占比"
              ></el-input>
              <div
                class="
                  strategy-config-pane-create-strategyPane-content-strategyItem-icon
                "
              >
                <i
                  class="h-icon-add"
                  :style="
                    notAllowFlag
                      ? 'font-size: 1.5em; cursor: not-allowed'
                      : 'font-size: 1.5em; cursor: pointer'
                  "
                  @click="addNewStrategyitem"
                  v-if="index === 0"
                ></i>
                <i
                  class="h-icon-delete"
                  style="font-size: 1.5em; cursor: pointer"
                  v-if="index >= 1"
                  @click="deleteStrategyitem(index)"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <el-form
        ref="form"
        label-position="left"
        :model="form"
        label-width="120px"
        style="width: 80%; height: 35%; margin: 30px auto"
      > -->
      <!-- <el-form-item label="开始时间:" prop="startTime">
          <el-time-picker
            v-model="form.startTime"
            :unlink="true"
            placeholder="请任意时间点"
            value-format="HH:mm:ss"
            style="width: 92%"
          />
          <el-tooltip
            content="注意! 若抓拍线索不在已配置策略的时段内，只会按照车辆颜色去判断是否车辆相同"
            placement="bottom"
          >
            <h-feedback-icon
              icon-name="h-icon-feedback_question_lg"
              style="margin-left: 18px; font-size: 1rem"
            />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="结束时间:" prop="endTime">
          <el-time-picker
            v-model="form.endTime"
            :unlink="true"
            placeholder="请任意时间点"
            value-format="HH:mm:ss"
            style="width: 92%"
          />
        </el-form-item> -->
      <!-- <el-form-item>
          <div class="strategy-config-pane-create-itempane">
            <div
              v-for="(item, index) in form.strategyDetailVOList"
              class="strategy-config-pane-create-itempane-strategyItem"
            >
              <div>
                <div style="margin-right: 1em">策略类型:</div>
                <el-select v-model="item.strategyType" placeholder="请选择">
                  <el-option
                    v-for="(items, key) in strategyTypeList"
                    :key="key"
                    :label="items"
                    :value="key"
                  >
                  </el-option>
                </el-select>
              </div>
              <div>
                <div>占比:</div>
                <el-input
                  v-model="item.proportion"
                  placeholder="请输入占比"
                  style="margin-left: 1em"
                ></el-input>
              </div>
              <div>
                <i
                  class="h-icon-add"
                  style="font-size: 1.5em; cursor: pointer"
                  @click="addNewStrategyitem"
                  v-if="index === 0"
                ></i>
                <i
                  class="h-icon-delete"
                  style="font-size: 1.5em; cursor: pointer"
                  v-if="index >= 1"
                  @click="deleteStrategyitem(index)"
                ></i>
              </div>
            </div>
          </div>
        </el-form-item> -->
      <!-- </el-form> -->
      <div class="strategy-config-pane-create-footer">
        <el-button type="info" @click="saveCreate" v-if="!editFlag"
          >保存</el-button
        >
        <el-button type="info" @click="updateChange" v-else>保存</el-button>
        <el-button type="default" @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import rest from "@/rest";
import helper from "@/helper";
/*
  strategyConfig: {
    findAll: 'strategyInfo/findAll',
    findDetail: 'strategyInfo/findDetail',
    createNewStrategy: 'strategyInfo/save',
    editStrategy: 'strategyInfo/update',
    deleteStrategy: 'strategyInfo/delete'
  }
*/
export default {
  name: "strategyConfig",
  data() {
    return {
      tableData: [],
      strategyTypeList: {
        1: "模型比对",
        2: "车辆颜色",
      },
      createFlag: false,
      form: {
        startTime: "",
        endTime: "",
        strategyDetailVOList: [
          {
            strategyType: "",
            proportion: "",
          },
        ],
      },
      editFlag: false,
      editId: "",
      notAllowFlag: false,
    };
  },
  mounted() {
    this.getStrategyDatas();
  },
  methods: {
    getStrategyDatas() {
      rest.post(api.strategyConfig.findAll, {}).done((res) => {
        if (helper.isSuccess(res)) {
          this.tableData = res.data;
        } else {
          that.$message.error(res.msg);
        }
      });
    },
    readStrategyDetail(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowExpanded(row);
        });
      }
    },
    addStrategy() {
      this.editFlag = false;
      this.createFlag = true;
    },
    cancelCreate() {
      this.form.startTime = "";
      this.form.endTime = "";
      this.form.strategyDetailVOList.length = 0;
      this.form.strategyDetailVOList.push({
        strategyType: "",
        proportion: "",
      });
      this.createFlag = false;
    },
    addNewStrategyitem() {
      if (this.form.strategyDetailVOList.length >= 2) {
        // 暂时只有两种策略 所以暂时最多只让创建两个
        return;
      }
      this.form.strategyDetailVOList.push({
        strategyType: "",
        proportion: "",
      });
      if (this.form.strategyDetailVOList.length >= 2) {
        this.notAllowFlag = true;
      }
    },
    deleteStrategyitem(index) {
      this.form.strategyDetailVOList.splice(index, 1);
      if (this.form.strategyDetailVOList.length < 2) {
        this.notAllowFlag = false;
      }
    },
    saveCreate() {
      let tempList = [];
      this.form.strategyDetailVOList.forEach((item) => {
        tempList.push({ ...item });
      });
      let sumPercent = 0,
        typeSet = new Set();
      tempList.forEach((item) => {
        sumPercent += +item.proportion;
        item.proportion = +(item.proportion / 100).toFixed(3);
        typeSet.add(item.strategyType);
        item.strategyType = +item.strategyType;
      });
      if (sumPercent !== 100) {
        this.$message.error("占比总和不为100！");
        typeSet = null;
        return;
      }
      if (typeSet.size !== tempList.length) {
        this.$message.error("策略类型选择重复!");
        typeSet = null;
        return;
      }
      if (
        this.form.startTime &&
        this.form.endTime &&
        this.form.endTime < this.form.startTime
      ) {
        this.$message.error("开始时间不得晚于结束时间!");
        return;
      }
      rest
        .post(api.strategyConfig.createNewStrategy, {
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          strategyDetailVOList: tempList,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.cancelCreate();
            this.$message.success("创建成功！");
            this.getStrategyDatas();
            typeSet = null;
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    deleteTask(row) {
      this.$confirm("此操作将永久删除该条策略配置, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          rest
            .post(api.strategyConfig.deleteStrategy, {
              ids: [row.id],
            })
            .done((res) => {
              if (helper.isSuccess(res)) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getStrategyDatas();
              } else {
                this.$message.error(res.msg);
              }
            })
            .catch((err) => {
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },
    editTask(row) {
      this.form.startTime = row.startTime;
      this.form.endTime = row.endTime;
      let tempList = row.strategyDetailVOList;
      tempList.forEach((item) => {
        item.proportion <= 1 && (item.proportion *= 100);
        item.strategyType = "" + item.strategyType;
      });
      this.editId = row.id;
      this.form.strategyDetailVOList.length = 0;
      this.form.strategyDetailVOList.push(...row.strategyDetailVOList);
      this.editFlag = true;
      this.createFlag = true;
    },
    updateChange() {
      let tempList = [];
      this.form.strategyDetailVOList.forEach((item) => {
        tempList.push({ ...item });
      });
      let sumPercent = 0,
        typeSet = new Set();
      tempList.forEach((item) => {
        sumPercent += +item.proportion;
        item.proportion = (item.proportion / 100).toFixed(3);
        typeSet.add(item.strategyType);
      });
      if (sumPercent !== 100) {
        this.$message.error("占比总和不为100！");
        return;
      }
      if (typeSet.size !== tempList.length) {
        this.$message.error("策略类型选择重复!");
        return;
      }
      if (
        this.form.startTime &&
        this.form.endTime &&
        this.form.endTime < this.form.startTime
      ) {
        this.$message.error("开始时间不得晚于结束时间!");
        return;
      }
      rest
        .post(api.strategyConfig.updateStrategy, {
          id: this.editId,
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          strategyDetailVOList: tempList,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.cancelCreate();
            this.$message.success("更新成功！");
            this.getStrategyDatas();
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    judgePercentValue(item) {
      if (+item.proportion <= 1) {
        return item.proportion * 100 + "%";
      } else {
        return item.proportion + "%";
      }
    },
    reset() {
      this.form.startTime = "";
      this.form.endTime = "";
      this.form.strategyDetailVOList.length = 0;
      this.form.strategyDetailVOList.push({
        strategyType: "",
        proportion: "",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.strategy-config-pane {
  margin: 0;
  width: 100%;
  height: 100%;
  &-main {
    width: 96%;
    height: 80%;
    padding-top: 18px;
    margin: 0 auto;
    &-buttons {
      width: 100%;
      height: 5%;
    }
    &-table {
      width: 100%;
      height: 95%;
      &-innerTable {
        width: 100%;
        height: 100%;
        text-align: center;
      }
    }
  }
  &-create {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding-top: 10px;
    position: relative;
    &-title {
      width: 100%;
      border-bottom: 1px solid rgba(0, 0, 0, 0.3);
      padding-bottom: 6px;
      padding-left: 12px;
      display: flex;
      align-items: center;
      > i {
        font-size: 1.3em;
        border: 1px solid rgba(51, 51, 51, 0.7);
        border-radius: 0.65em;
        margin-right: 6px;
        cursor: pointer;
      }
    }
    &-timePane {
      width: 96%;
      margin: 0 auto;
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
        height: calc(100% - 60px);
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
        &-item {
          width: 30%;
          position: relative;
          &-icon {
            position: absolute;
            margin-top: 0.2rem;
            right: -2rem;
            font-size: 1.5rem;
            cursor: pointer;
          }
        }
      }
    }
    &-strategyPane {
      width: 96%;
      height: 312px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #cdcdcd;
      margin-top: 16px;
      padding-bottom: 16px;
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
        height: calc(100% - 60px);
        overflow: auto;
        margin: 0 auto;
        padding-top: 20px;
        &-strategyItem {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 16px;
          &-icon {
            position: absolute;
            right: -2rem;
            margin-top: -1.7rem;
          }
        }
      }
    }
    &-itempane {
      width: 100%;
      height: 170px;
      padding-bottom: 5px;
      overflow-y: auto;
      &-strategyItem {
        width: 100%;
        display: flex;
        align-items: center;
        > div {
          width: 46%;
          display: flex;
          align-items: center;
          margin-top: 0.2em;
          > div:first-child {
            width: 5rem;
            text-align: right;
          }
        }
        > div:last-child {
          margin-left: 1rem;
          width: 3%;
        }
      }
    }
    &-footer {
      position: absolute;
      left: 0;
      bottom: 60px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
}
</style>