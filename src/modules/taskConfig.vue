<template>
  <div class="task-config-pane">
    <div v-if="!addTaskVisible">
      <el-button
        @click="addTask"
        icon="h-icon-add"
        size="small"
        class="task-config-pane-add"
        >添加任务</el-button
      >
      <el-button
        @click="changeTaskStatus(1)"
        icon="h-icon-shutdown"
        size="small"
        class="task-config-pane-add"
        >启动所选任务</el-button
      >
      <el-button
        @click="changeTaskStatus(0)"
        icon="h-icon-blocked"
        size="small"
        class="task-config-pane-add"
        >停止所选任务</el-button
      >
      <el-table
        :data="tableData"
        style="width: 100%; height: 80%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column label="序号" type="index" width="55">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称"></el-table-column>
        <el-table-column prop="libName" label="关联名单库">
          <template slot-scope="scope">
            <div
              class="task-config-pane-tableItem"
              :title="getNameList(scope.row) || ''"
            >
              {{ getNameList(scope.row) || "---" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" label="结束时间"></el-table-column>
        <el-table-column prop="cameraInfoVOList" label="监控点">
          <template slot-scope="scope">
            <div
              class="task-config-pane-tableItem"
              :title="getCameraList(scope.row) || ''"
            >
              {{ getCameraList(scope.row) || "---" }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="任务状态切换">
          <template slot-scope="scope">
            <el-button
              type="link"
              v-if="scope.row.taskStatus === 1"
              class="task-config-pane-table-button"
              style="margin-top: -6px"
              @click="changeItemStatus(scope.$index, 0)"
            >
              <el-load-icon></el-load-icon>执行中
            </el-button>
            <el-button
              v-if="scope.row.taskStatus === 0"
              type="link"
              @click="changeItemStatus(scope.$index, 1)"
              >已停止</el-button
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
    <div style="width: 100%; height: 100%" v-else>
      <div class="task-config-pane-title">
        <i class="h-icon-angle_left" @click="cancelTask"></i>返回列表
      </div>
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        label-width="120px"
        style="width: 30%; height: 35%; margin: 30px auto"
      >
        <el-form-item label="任务名称" prop="taskName" :error="taskNameError">
          <el-input v-model="form.taskName"></el-input>
        </el-form-item>
        <el-form-item label="选点位" prop="location">
          <sui-select-point
            ref="selectPoint"
            inner-title="组织树"
            :request-data="requestTreeData"
            :parent-checkable="true"
            :expand-on-checked="false"
            parent-key="orgIndexCode"
            :tree-props="treeProps"
            @change="handleChange"
            style="width: 100%"
          ></sui-select-point>
        </el-form-item>
        <el-form-item label="任务执行时间范围" prop="date">
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="前科人员名单" prop="listInput">
          <name-list-choose-pane
            :defaultCheckedVal="defaultCheckedVal"
            @valueChange="listInputChange"
          ></name-list-choose-pane>
          <!-- <el-select
            v-model="form.listInput"
            filterable
            remote
            placeholder="请输入名单库名称"
            :remote-method="querySearchAsync"
            @on-scrolling-y="newNameListFetch"
            clear
          >
            <el-option
              v-for="item in namelist"
              :key="item.libCode"
              :label="item.libName"
              :value="item.libCode"
            >
            </el-option>
          </el-select> -->
          <!-- <el-autocomplete
            v-model="form.listInput"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入名单库名称"
            @select="handleSelect"
          ></el-autocomplete> -->
          <!-- <el-select v-model="form.listInput" placeholder="请选择" clear>
            <el-option
              v-for="(item, index) in namelist"
              :key="index"
              :label="item.libName"
              :value="item.libCode"
            >
              <span>{{ item.libName }}</span>
            </el-option>
          </el-select> -->
        </el-form-item>
      </el-form>
      <div class="task-config-pane-footer">
        <el-button
          type="info"
          v-if="taskPaneType === 'create'"
          @click="saveCreate"
          >保存</el-button
        >
        <el-button type="info" v-else @click="saveEdit">保存</el-button>
        <el-button type="default" @click="reset">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import rest from "@/rest";
import helper from "@/helper";
import SuiSelectPoint from "@/components/selectPoint/selectPoint";
import { loadNode } from "@/utils/index.js";
import NameListChoosePane from "@/components/NameListChoosePane";

export default {
  name: "taskConfig",
  data() {
    return {
      tableData: [],
      form: {
        location: "",
        listInput: [],
        date: [],
      },
      namelist: [],
      taskPaneType: "create",
      treeProps: {
        label: "name",
        children: "children",
        icon: "iconSkin",
        isLeaf: function (data) {
          return !data.parent;
        },
      },
      addTaskVisible: false,
      selection: [],
      editIndex: 0,
      namelistPage: {
        pageNo: 1,
        pageSize: 20,
      },
      nameListloading: false,
      taskNameError: "",
      defaultCheckedVal: [],
    };
  },
  mounted() {
    this.getTaskDatas();
  },
  watch: {
    "form.taskName"(val) {
      if (!val) return;
      var reg = new RegExp(
        "[`·~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
      );
      if (reg.test(val) || val.length > 50) {
        this.taskNameError = "任务名称包含特殊字符或过长";
      } else {
        this.taskNameError = "";
      }
    },
  },
  components: {
    SuiSelectPoint,
    NameListChoosePane,
  },
  methods: {
    getTaskDatas() {
      rest
        .post(api.taskConfig.getTaskDatas, {})
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.tableData = res.data;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    addTask() {
      this.addTaskVisible = true;
      this.taskPaneType = "create";
    },
    editTask(item, index) {
      this.editIndex = index;
      rest
        .post(api.taskConfig.getTaskDetail, {
          id: item.id,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.taskPaneType = "edit";
            this.addTaskVisible = true;
            this.$nextTick(() => {
              this.form.taskName = res.data.taskName;
              this.form.date = [res.data.beginTime, res.data.endTime];
              if (res.data.cameraInfoVOList.length) {
                let tempArr = res.data.cameraInfoVOList.map((item) => ({
                  id: item.cameraIndexCode,
                  name: item.cameraName,
                  isCamera: item.isCamera,
                }));
                this.form.location = tempArr;
                this.$refs.selectPoint.setValue({
                  leaf: tempArr,
                });
              } else {
                this.$refs.selectPoint && this.$refs.selectPoint.setValue({});
              }
              console.log(res.data.libInfoVOList);
              this.$set(this, "defaultCheckedVal", res.data.libInfoVOList);
              this.$set(this.form, "listInput", res.data.libInfoVOList);
              console.log(this.form.listInput);
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    cancelTask() {
      this.$refs.form.resetFields();
      this.$refs.selectPoint && this.$refs.selectPoint.setValue({});
      this.addTaskVisible = false;
      this.taskNameError = "";
      this.$set(this, "defaultCheckedVal", []);
    },
    saveEdit() {
      if (!this.form.taskName) {
        this.$message.warning("任务名称不能为空!", 3000);
        return;
      }
      if (!this.form.date[0]) {
        this.$message.warning("任务时间范围不能为空!", 3000);
        return;
      }
      let cameraInfoVOList;
      cameraInfoVOList = JSON.parse(this.form.location).map((item) => ({
        cameraIndexCode: item.id,
        cameraName: item.name,
        isCamera:
          item.isCamera == null ? (item.parent ? false : true) : item.isCamera,
      }));
      rest
        .post(api.taskConfig.editTask, {
          id: this.tableData[this.editIndex].id,
          taskName: this.form.taskName,
          taskStatus: this.tableData[this.editIndex].taskStatus,
          beginTime: helper.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            new Date(this.form.date[0])
          ),
          endTime: helper.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            new Date(this.form.date[1])
          ),
          libInfoVOList: this.form.listInput,
          cameraInfoVOList,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            if (this.form.listInput && this.form.listInput.length) {
              this.syncCriminalPerson(this.form.listInput);
            }
            this.addTaskVisible = false;
            this.$refs.form.resetFields();
            this.getTaskDatas();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    saveCreate() {
      if (!this.form.taskName) {
        this.$message.warning("任务名称不能为空!", 3000);
        return;
      }
      if (!this.form.date[0]) {
        this.$message.warning("任务时间范围不能为空!", 3000);
        return;
      }
      let cameraInfoVOList;
      cameraInfoVOList =
        (this.form.location &&
          JSON.parse(this.form.location).map((item) => ({
            cameraIndexCode: item.id,
            cameraName: item.name,
            isCamera: item.parent ? false : true,
          }))) ||
        [];
      rest
        .post(api.taskConfig.createNewTask, {
          taskName: this.form.taskName,
          taskStatus: 1,
          beginTime: helper.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            new Date(this.form.date[0])
          ),
          endTime: helper.dateFormat(
            "YYYY-mm-dd HH:MM:SS",
            new Date(this.form.date[1])
          ),
          libInfoVOList: this.form.listInput,
          cameraInfoVOList,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.$message({
              type: "success",
              message: "创建成功!",
            });
            if (this.form.listInput && this.form.listInput.length) {
              this.syncCriminalPerson(this.form.listInput);
            }
            this.addTaskVisible = false;
            this.$refs.form.resetFields();
            this.getTaskDatas();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    deleteTask(item) {
      this.$confirm("此操作将永久删除该任务, 是否继续?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          rest
            .post(api.taskConfig.deleteTask, {
              id: item.id,
            })
            .done((res) => {
              if (helper.isSuccess(res)) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.getTaskDatas();
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
    requestTreeData(params) {
      return loadNode(params);
    },
    handleChange(nameValue, keyValue, nodes) {
      this.$set(this.form, "location", JSON.stringify(nodes));
      // if (nodes && nodes.length) {
      //   const name = nodes[0].name;
      //   if (name) {
      //     this.$set(this.sidebarForm, "happenPlace", name);
      //   }
      //   this.$set(this.sidebarForm, "longtitude", nodes[0].longitude);
      //   this.$set(this.sidebarForm, "latitude", nodes[0].latitude);
      // }
    },
    changeTaskStatus(taskStatus) {
      if (this.selection.length === 0) {
        this.$message.warning("请选择任务！", 3000);
        return;
      }
      let ids = this.selection.map((item) => item.id);
      rest
        .post(api.taskConfig.modifyStatus, {
          ids,
          taskStatus,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.getTaskDatas();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    handleSelectionChange(selection) {
      this.selection = selection;
    },
    getCameraList(item) {
      return (
        (item.cameraInfoVOList &&
          item.cameraInfoVOList.map((item) => item.cameraName).join("、")) ||
        ""
      );
    },
    changeItemStatus(index, taskStatus) {
      rest
        .post(api.taskConfig.modifyStatus, {
          ids: [this.tableData[index].id],
          taskStatus,
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.tableData[index].taskStatus = taskStatus;
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 同步名单库
    syncCriminalPerson(libCodes) {
      rest
        .post(api.systemConfig.refreshLisbrary, {
          libCodes: libCodes.map((item) => item.libCode),
        })
        .done((res) => {
          if (helper.isSuccess(res)) {
            this.$message.success("同步成功!");
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    reset() {
      this.$refs.form.resetFields();
      this.$refs.selectPoint && this.$refs.selectPoint.setValue({});
      this.$set(this, "defaultCheckedVal", []);
    },
    listInputChange(val) {
      this.$set(this.form, "listInput", val);
    },
    getNameList(item) {
      return (
        (item.libInfoVOList &&
          item.libInfoVOList.map((item) => item.libName).join("、")) ||
        ""
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.task-config-pane {
  width: 100%;
  height: 80%;
  margin: 0 auto;
  padding: 16px;
  &-add {
    width: 8rem;
    margin-bottom: 12px;
    &:first-child {
      width: 6rem;
    }
  }
  &-tableItem {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  > div {
    width: 100%;
    height: 100%;
    &-table-button {
      display: flex;
      justify-items: center;
    }
  }
  &-title {
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
    padding-bottom: 6px;
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
  &-footer {
    position: absolute;
    bottom: 60px;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
  }
}
</style>