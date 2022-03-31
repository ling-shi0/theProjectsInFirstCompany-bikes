/* eslint-disable */
<template>
  <div class="sui-select-point">
    <div class="select-point-result" v-if="!hasCustomBtn">
      <el-button
        @click="openDialog = true"
        :disabled="disabled"
        :class="[
          'select-point-btn',
          { hasValue: hasValue },
          { disabled: disabled },
        ]"
      >
        <span v-if="!hasValue">
          <span style="float: left">请点击选取点位信息{{ extraDesc }}</span>
          <span
            class="h-icon-arrow_right"
            style="float: right; font-size: 16px; color: #000"
          ></span>
        </span>
        <span v-if="hasValue">{{ inputDisplayValue }}</span>
      </el-button>
      <span
        v-if="hasValue && !disabled"
        class="select-point-clear-btn h-icon-tip_error"
        @click="clearValue"
      ></span>
      <el-button
        v-if="hasValue"
        @click="openDialog = true"
        class="select-point-right-btn"
        :disabled="disabled"
      >
        <span class="h-icon-arrow_right"></span>
      </el-button>
    </div>
    <slot name="triggerBtn" :data="this"></slot>
    <el-dialog
      :area="dialogArea"
      :title="dialogTitle"
      :visible.sync="openDialog"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      top="middle"
      no-scrollbar
      append-to-body
      custom-class="sui-select-point-dialog"
      @open="handleDialogOpen"
      @close="handleCancel"
    >
      <div class="select-point-wrapper">
        <div class="select-point-box main-box">
          <div class="box-inner">
            <div class="select-point-header">
              <el-select
                style="width: 100px"
                v-model="currentDataSource"
                v-if="hasMultiData"
              >
                <el-option
                  v-for="item in dataSource"
                  :key="item.treeCode"
                  :label="item.label"
                  :value="item.treeCode"
                ></el-option>
              </el-select>
              <span v-if="!hasMultiData">{{ innerTitle }}</span>
              <div class="point-tabs" v-if="showMap">
                <button
                  @click="pointTab = 'tree'"
                  :class="['point-tab', { selected: pointTab === 'tree' }]"
                >
                  目录选择
                </button>
                <button
                  @click="handleSelectMap"
                  :class="['point-tab', { selected: pointTab === 'map' }]"
                >
                  地图选择
                </button>
              </div>
            </div>
            <div class="select-point-content">
              <sui-select-point-tree
                v-show="pointTab === 'tree'"
                ref="selectPointTree"
                :data="treeData"
                :nodeKey="nodeKey"
                :parentKey="parentKey"
                :parentCheckable="parentCheckable"
                :expandOnChecked="expandOnChecked"
                :expandWhenHasValue="expandWhenHasValue"
                :resourceType="resourceType"
                :treeProps="treeProps"
                :filter="filterTreeData"
                :filterResult="filterResult"
                @change="treeCheckedChange"
                @rscTypeChange="rscTypeChange"
                @remove="handleTreeRemove"
                @mounted="treeMounted"
                :loadDataByNode="loadDataByNode"
              ></sui-select-point-tree>
              <sui-select-point-map
                :class="[{ mapHidden: pointTab === 'tree' }]"
                :hasOpen="openDialog"
                v-if="showMap"
                ref="mapSelectPoint"
                :src="xMapUrl"
                :checkedNodes="treeNodes"
                @mounted="mapMounted"
                @change="handleMapCheck"
              ></sui-select-point-map>
            </div>
          </div>
        </div>
        <div class="select-point-box right-box">
          <div class="select-point-header">
            <span>已选择</span>
            <el-button type="link" class="clear-btn" @click="clear">
              <span class="h-icon-trashcan"></span>清空
            </el-button>
          </div>
          <div class="select-point-content">
            <sui-selected-list
              :data="trueNodes"
              :dataKey="nodeKey"
              :dataValue="treeProps.label"
              :isLeaf="treeProps.isLeaf"
              @remove="handleRemoveNode"
            ></sui-selected-list>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleMakeSure">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SuiSelectPointTree from "./selectPointTree.vue";
import SuiSelectedList from "./selectedList.vue";
import SuiSelectPointMap from "./selectPointMap.vue";
export default {
  components: {
    SuiSelectedList,
    SuiSelectPointMap,
    SuiSelectPointTree,
  },
  name: "SuiSelectPoint",
  componentName: "SuiSelectPoint",
  props: {
    // -------------------组件需要的props-------------------
    disabled: {
      type: Boolean,
      default: false,
    },
    dataSource: {
      // 数据来源，支持多个目录切换
      type: Array,
    },
    resourceType: {
      // 资源类型
      type: Array,
    },
    xMapUrl: {
      type: String,
      default:
        "/xmap-web/third/mapQuery/index.do?resourceType=CAMERA&treeCode=0",
    },
    requestData: {
      // 请求数据方法
      type: Function,
      required: true,
    },
    showMap: {
      // 是否显示地图
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      // 弹出框标题
      type: String,
      default: "选择点位",
    },
    innerTitle: {
      // 左侧框title，在没有多个数据来源时显示这个title，有多个数据来源为来源下拉框
      type: String,
      default: "组织树",
    },
    parentCheckable: {
      // 父节点是否禁用check
      type: Boolean,
      default: true,
    },
    filterResult: {
      type: Function, // 返回的节点过滤方法
    },
    expandOnChecked: {
      // check父节点时自动展开子节点
      type: Boolean,
      default: false,
    },
    expandWhenHasValue: {
      // 有初始值时是否展开所有节点
      type: Boolean,
      default: false,
    },
    //     name: "浙江省"
    // parentIndexCode: "7851f8e2b6b34994a05f2f3fd3129c26"
    // icon: "area"
    // indexCode: "e10b2bd21a9f40dc8b7082594cc66237"
    // isLeaf: false
    // children: []
    // open: false
    // resourceType: "CAMERA"
    // hasResNum: 1
    // iCascade: 0
    // treePath: "@7851f8e2b6b34
    // -------------------树需要的props-------------------
    nodeKey: {
      // 树节点id字段
      type: String,
      default: "id",
    },
    parentKey: {
      // 树节点指向父节点id字段
      type: String,
      default: "orgIndexCode",
    },
    treeProps: {
      // 树组件配置选项，参照HUI>Tree组件的props
      type: Object,
      default() {
        return {
          label: "name",
          children: "children",
          icon: "iconSkin",
          isLeaf: function (data) {
            return data.iconSkin !== "org";
          },
        };
      },
    },
    extraDesc: String,
  },
  data() {
    return {
      hasValue: false, // 是否选择了节点
      openDialog: false, // 打开弹框
      inputDisplayValue: "", // input显示的内容
      pointTab: "tree", // 当前tab值，为tree/map
      currentDataSource:
        this.dataSource && this.dataSource.length
          ? this.dataSource[0].treeCode
          : "", // 当期数据来源
      treeData: [], // 树组件data
      treeNodes: [], // 树组件选中的节点
      mapNodes: [], // map选中的节点（没有组织）
      allNodeWhenOpen: {},
      needInitValue: false,
      initValue: null,
      treeObj: null,
      mapObj: null,
    };
  },
  computed: {
    hasMultiData() {
      return this.dataSource && this.dataSource.length > 1;
    },
    hasCustomBtn() {
      return this.$scopedSlots.triggerBtn;
    },
    dialogArea() {
      return this.pointTab === "tree" ? [800, 680] : [1026, 680];
    },
    trueNodes() {
      let nodes = this.treeNodes.slice();
      // 父节点选中下 右侧列表不展示子节点
      let allIndexCode = nodes.map((item) => item.id);
      let newNodes = nodes.filter(
        (item) => !allIndexCode.includes(item.orgIndexCode)
      );
      if (this.showMap) {
        const keyName = "indexCode";
        const ids = newNodes.map((item) => item[keyName]);
        for (const node of this.mapNodes) {
          if (ids.indexOf(node[keyName]) === -1) {
            newNodes.push(node);
          }
        }
      }
      return newNodes;
    },
    idResult() {
      let pIds = [];
      let cIds = [];
      for (const node of this.trueNodes) {
        if (node.iconSkin === "org") {
          pIds.push(node[this.nodeKey]);
        } else {
          cIds.push(node[this.nodeKey]);
        }
      }
      return {
        parentKeys: pIds.join(","),
        leafKeys: cIds.join(","),
      };
    },
  },
  watch: {
    currentDataSource: {
      immediate: true,
      handler(val) {
        if (this.trueNodes.length) {
          this.clear();
        }
        this.requestTreeData();
        this.$emit("dataSourceChange", "treeCode", val);
      },
    },
  },
  methods: {
    handleDialogOpen() {
      this.allNodeWhenOpen = {
        treeNodes: this.treeNodes.slice(),
        mapNodes: this.mapNodes.slice(),
        trueNodes: this.trueNodes.slice(),
      };
      if (this.needInitValue) {
        this.needInitValue = false;
        this.setValueToTree();
      }
    },
    setValueToTree() {
      if (this.treeObj) {
        this.treeObj.setValue(this.initValue);
      } else {
        setTimeout(() => {
          this.setValueToTree();
        }, 0);
      }
    },
    handleSelectMap() {
      this.pointTab = "map";
      this.mapObj.mapPosition();
    },
    /**
     * 选择点位后确认关闭弹框
     * */
    handleMakeSure() {
      let pointNum = 0;
      this.trueNodes.forEach(({ hasResNum }) => {
        if (hasResNum) {
          pointNum += hasResNum;
        } else {
          pointNum++;
        }
      });

      this.$nextTick(() => {
        this.openDialog = false;
        // this.setValue({leaf:[{...this.trueNodes[0]}]});
        this.renderInputValue();
        this.treeObj.handleFilterClear();
      });
    },
    renderInputValue() {
      this.hasValue = !!this.trueNodes.length;
      if (this.trueNodes.length) {
        let label = this.trueNodes[0][this.treeProps.label];
        this.inputDisplayValue =
          this.trueNodes.length > 1 ? `"${label}"等点位信息` : label;
      } else {
        this.inputDisplayValue = "";
      }
      let trueNames = this.treeNodes
        .map((item) => item[this.treeProps.label])
        .join(",");
      this.$emit("change", trueNames, this.idResult, this.trueNodes);
    },
    handleCancel() {
      if (this.openDialog) {
        this.openDialog = false;
        this.treeObj.handleFilterClear();
        this.rollBackValue();
      }
    },
    /**
     * 点击取消时回退到弹框打开时的结果
     * */
    rollBackValue() {
      let { treeNodes, mapNodes, trueNodes } = this.allNodeWhenOpen;
      this.treeNodes = treeNodes;
      this.mapNodes = mapNodes;
      this.treeObj.setChecked(trueNodes);
    },
    /**
     * 请求树的初始数据
     * */
    requestTreeData() {
      this.requestData({
        treeCode: this.currentDataSource,
        capabilitySet: "event_face",
      }).then(({ data }) => {
        this.treeData = data;
      });
    },
    /**
     * 搜索
     * */
    filterTreeData(text) {
      return this.requestData({
        name: text,
        capabilitySet: "event_face",
      });
    },
    /**
     * 加载子节点
     * */
    loadDataByNode(data) {
      if (!data) {
        return this.requestData({
          treeCode: this.currentDataSource,
          capabilitySet: "event_face",
        });
      }
      return this.requestData({
        parentKey: data[this.nodeKey],
        capabilitySet: "event_face",
      });
    },
    rscTypeChange(val) {
      this.$emit("dataSourceChange", "resourceType", val);
      if (this.trueNodes.length) {
        this.clear();
      }
      this.requestData({
        resourceType: val,
        capabilitySet: "event_face",
      }).then((data) => {
        this.treeData = data;
      });
    },
    /**
     * 树组件选中值改变事件监听
     * */
    treeCheckedChange(value, name, nodes) {
      this.treeNodes = nodes;
      if (this.showMap) {
        // 树已经对map上的节点进行操作了，那就掌控该节点控制权，从map中移除
        this.mapNodes = this.mapNodes.filter(
          (item) => value.parentKeys.indexOf(item[this.nodeKey]) === -1
        );
      }
    },
    /**
     * 右侧列表删除单个节点
     * */
    async handleRemoveNode(key) {
      this.treeObj.unCheckNode(key);
      if (this.treeNodes.length === 1) {
        if (this.treeObj) {
          await this.clear();
        } else {
          await this.clearNodes();
        }
      }
      if (this.showMap) {
        let idx = this.mapNodes.findIndex((item) => item["indexCode"] === key);
        if (idx !== -1) {
          this.mapNodes.splice(idx, 1);
          if (this.pointTab === "map") {
            this.mapObj.mapPosition();
          }
        } else {
          idx = this.trueNodes.findIndex((item) => item["id"] === key);
          if (idx !== -1) {
            this.trueNodes.splice(idx, 1);
            this.treeNodes.splice(idx, 1);
            this.treeObj.setChecked(this.trueNodes);
            this.treeObj.refreshCheckedNodes(
              this.trueNodes.map((item) => item.id),
              this.trueNodes
            );
          }
        }
      }
    },
    /**
     * 树取消勾选节点，需要同时移除map选中的该节点
     * */
    handleTreeRemove(key) {
      if (this.showMap) {
        this.mapNodes = this.mapNodes.filter(
          (item) => item[this.nodeKey] !== key
        );
      }
    },
    /**
     * 置空
     * */
    async clearValue() {
      this.hasValue = false;
      if (this.treeObj) {
        await this.clear();
      } else {
        await this.clearNodes();
      }
      this.$nextTick(() => {
        this.renderInputValue();
      });
    },
    clearNodes() {
      this.treeNodes = [];
      if (this.needInitValue) {
        this.needInitValue = false;
        this.initValue = null;
      }
      if (this.showMap) {
        this.mapNodes = [];
      }
    },
    /**
     * 右侧列表清空所有
     * */
    clear() {
      this.treeObj.clear();
      if (this.showMap) {
        this.mapNodes = [];
        if (this.pointTab === "map") {
          this.mapObj.mapPosition();
        }
      }
    },
    setValue(value) {
      let { parent, leaf } = value;
      parent = parent || [];
      leaf = leaf || [];
      if (parent.length) {
        for (let node of parent) {
          node.iconSkin = "org";
        }
      }
      this.initValue = value;
      let allNodes = parent.concat(leaf);
      this.treeNodes = allNodes;
      this.needInitValue = true;
      this.renderInputValue();
    },
    /**
     * 处理map框选或清除节点
     * map框选如果有结果，清空树节点，只保留map节点
     * */
    handleMapCheck(nodes) {
      if (nodes) {
        this.treeObj.clear();
        this.$nextTick(() => {
          this.mapNodes = this.formatMapData(nodes) || [];
          this.treeObj.setChecked(nodes);
        });
      }
    },
    formatMapData(data) {
      if (data && data.length) {
        const label = this.treeProps.label;
        const key = this.nodeKey;
        return data.map((item) => ({
          [label]: item.name,
          ["indexCode"]: item.indexCode,
        }));
      }
    },
    treeMounted(vm) {
      this.treeObj = vm;
    },
    mapMounted(vm) {
      this.mapObj = vm;
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.sui-select-point {
  .select-point-result {
    position: relative;
    min-width: 200px;
    .el-button.select-point-btn {
      width: 100%;
      max-width: inherit;
      font-weight: normal;
      height: 32px;
      line-height: 15px;
      color: #999999;
      &.disabled {
        border-color: #ebebeb;
        background-color: #f5f5f5;
        cursor: not-allowed;
      }
      &.disabled:hover {
        background: #f5f5f5;
      }
      &.hasValue {
        text-align: left;
        // width: calc(100% - 32px);
        width: 100%;
      }
      &:hover {
        background: #fff;
        // color: #3875F6;
        & + .select-point-clear-btn {
          display: block;
        }
      }
    }
    .el-button {
      padding: 9px 5px;
      width: 32px;
      min-width: 32px;
    }
    .select-point-right-btn {
      width: 32px;
      height: 32px;
      padding-left: 0;
      padding-right: 0;
      margin: 0;
      position: absolute;
      right: 1px;
    }
    .select-point-clear-btn {
      position: absolute;
      display: none;
      z-index: 10;
      right: 50px;
      top: 7px;
      font-size: 22px;
      color: #e4e4e4;
      cursor: pointer;
      &:hover {
        display: block;
      }
    }
  }
}
</style>
<style lang="scss">
.sui-select-point-dialog {
  .el-dialog__body .el-dialog__body-wrapper {
    padding: 0;
    height: 100%;
    font-size: 12px;
    .select-point-wrapper {
      position: relative;
      height: 100%;
      overflow: auto;
      .select-point-box {
        height: 536px;
        height: 100%;
        &.main-box {
          width: 100%;
          padding-right: 280px;
          margin-right: -280px;
          box-sizing: border-box;
          .box-inner {
            border: 1px solid #e4e4e4;
            height: 100%;
          }
          .el-tabs--border-card {
            box-shadow: none;
          }
        }
        &.right-box {
          position: absolute;
          width: 265px;
          right: 0;
          top: 0;
          border: 1px solid #e5e5e5;
        }
        .select-point-header {
          height: 42px;
          line-height: 40px;
          border-bottom: 1px solid #e4e4e4;
          background: #f4f4f4;
          position: relative;
          padding: 0 15px;
          .el-input__inner {
            background: transparent;
            border: none;
            height: 40px;
          }
          .point-tabs {
            position: absolute;
            right: 15px;
            top: 6px;
            .point-tab {
              border-radius: 2px 2px 0 0;
              margin-right: 0;
              margin-left: 8px;
              border: 1px solid #e4e4e4;
              transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
              background: #f9f9f9;
              padding: 7px 16px 5px;
              font-size: 12px;
              outline: none;
              cursor: pointer;
              line-height: 1.5;
              &:hover {
                color: #4996f5;
              }
              &.selected {
                color: #4996f5;
                background: #fff;
                border-bottom-color: #fff;
              }
            }
          }
          .clear-btn {
            float: right;
            color: red;
            position: relative;
            top: 5px;
            .h-icon-trashcan {
              position: relative;
              top: -2px;
              margin-right: 5px;
              font-size: 16px;
              float: left;
            }
          }
        }
        .select-point-content {
          padding: 16px;
          height: calc(100% - 42px);
          overflow: auto;
          .mapHidden {
            visibility: hidden;
            height: 0;
          }
        }
      }
    }
  }
}
</style>
