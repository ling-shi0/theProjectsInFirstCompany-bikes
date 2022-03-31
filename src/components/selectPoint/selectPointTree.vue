<template>
  <div class="sui-select-point-tree">
    <el-input
      v-model="filterText"
      class="filter-tree-input"
      clearable
      placeholder="输入关键字查询"
      suffix-icon="h-icon-search"
      :on-icon-click="handleFilterTree"
      @keyup.native.enter="handleFilterTree"
      :clear-icon-click="handleFilterClear"
    >
      <el-select
        v-model="resourceTypeValue"
        v-if="resourceType && resourceType.length > 1"
        @change="handleRscTypeChange"
        slot="prepend"
        style="width: 110px"
      >
        <el-option
          :label="item.label"
          :value="item.resourceType"
          v-for="item in resourceType"
          :key="item.resourceType"
        ></el-option>
      </el-select>
    </el-input>
    <div class="select-point-tree-cont">
      <el-tree
        ref="crossTree"
        v-show="!showFilter"
        :data="data"
        :indent="16"
        :default-expanded-keys="expandedKeys"
        expand-on-click-node
        :default-expand-all="expandAll"
        :props="srcTreeProps"
        :node-key="nodeKey"
        :parent-key="parentKey"
        :check-strictly="!parentCheckable"
        lazy
        show-checkbox
        @check="handleCheckTree"
        @check-change="handleCheckChange"
        :load="loadNode"
      ></el-tree>
      <el-tree
        ref="filterTree"
        v-show="showFilter"
        :indent="16"
        :data="filterData"
        :default-checked-keys="checkedKeys"
        default-expand-all
        check-strictly
        :props="filterTreeProps"
        :node-key="nodeKey"
        @check="handleCheckFilter"
        @check-change="handleFilterTreeCheckChange"
        :parent-key="parentKey"
        show-checkbox
      >
        <span slot-scope="{ node }" v-html="node.label"></span>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { debounce } from "throttle-debounce";
export default {
  name: "SuiSelectPointTree",
  componentName: "SuiSelectPointTree",
  props: {
    data: {
      // 树组件数据
      type: Array,
    },
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
    parentCheckable: {
      type: Boolean,
      default: true,
    },
    loadDataByNode: {
      // 异步请求子节点数据方法
      type: Function,
      required: true,
    },
    filter: {
      type: Function, // 搜索方法
      required: true,
    },
    filterResult: {
      type: Function, // 返回的节点过滤方法
    },
    expandOnChecked: {
      type: Boolean,
      default: false,
    },
    expandWhenHasValue: {
      // 有初始值时是否展开所有节点
      type: Boolean,
      default: false,
    },
    resourceType: {
      // 资源类型，只作为点位选择组件时使用
      type: Array,
    },
  },
  data() {
    return {
      resourceTypeValue:
        this.resourceType && this.resourceType.length > 1
          ? this.resourceType[0].resourceType
          : "",
      expandedKeys: [], // 默认展开节点（展开二层）
      filterText: "", // 搜索内容
      showFilter: false, // 切换点位树与搜索树
      filterData: [], // 搜索树数据
      checkedKeys: [], // 根据父子关系简化后的选中的节点的key
      trulyChecked: [], // 根据父子关系简化后的选中的节点
      filterTreeChecked: [], // 搜索树选中的节点
      initNodes: [],
      expandAll: false, // 展开所有
      treeObj: null, // 点位树对象
      filterTreeObj: null, // 搜索树对象
      debounceFunc: debounce(50, this.refreshCheckedNodes),
    };
  },
  computed: {
    // 根据parentCheckable参数禁用/开启组织节点勾选
    srcTreeProps() {
      if (this.parentCheckable) {
        return this.treeProps;
      } else {
        return Object.assign(
          {},
          {
            disabled: function (data) {
              return data.iconSkin === "org";
            },
          },
          this.treeProps
        );
      }
    },
    filterTreeProps() {
      return Object.assign({}, this.treeProps, {
        disabled: function (data, node) {
          return !node.isLeaf;
        },
      });
    },
    initKeys() {
      return this.initNodes.map((item) => item[this.nodeKey]);
    },
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val) {
          this.expandedKeys = val.map((node) => node[this.nodeKey]);
        }
      },
    },
    trulyChecked(val) {
      let pIds = [];
      let cIds = [];
      let names = [];
      for (const node of val) {
        if (node.iconSkin === "org") {
          pIds.push(node[this.nodeKey]);
        } else {
          cIds.push(node[this.nodeKey]);
        }
        names.push(node[this.treeProps.label]);
      }
      this.$emit(
        "change",
        { parentKeys: pIds.join(","), leafKeys: cIds.join(",") },
        names.join(","),
        val
      );
    },
  },
  methods: {
    /**
     * 搜索
     * */
    handleFilterTree() {
      if (this.filterText.trim().length) {
        this.showFilter = true;
        this.filter(this.filterText).then((data) => {
          this.filterData = data.data[0];
        });
      } else {
        this.handleFilterClear();
      }
    },
    /**
     * 搜索框清空
     * */
    handleFilterClear() {
      this.filterText = "";
      this.showFilter = false;
      this.filterData = [];
      this.treeObj.setCheckedKeys(this.checkedKeys);
    },
    /**
     * 加载子节点
     * */
    loadNode(node, resolve) {
      this.loadDataByNode(node.data).then(({ data }) => {
        resolve(data);
        if (this.data) {
          if (node.checked && this.expandOnChecked && !this.expandAll) {
            for (let d of data) {
              if (d.iconSkin === "org") {
                this.expandedKeys.push(d[this.nodeKey]);
              }
            }
            this.debounceFunc();
          }

          this.treeObj.setCheckedKeys(this.checkedKeys); // 对于已经展开的节点，勾选
          this.filterTreeObj.setCheckedKeys(this.checkedKeys);
        } else {
          if (!node.data) {
            this.expandedKeys = data.map((node) => node[this.nodeKey]);
          }
        }
      });
    },
    handleRscTypeChange(value) {
      this.$emit("rscTypeChange", value);
    },
    handleCheckTree(data, checkedObj) {
      let { checkedKeys, checkedNodes } = checkedObj;
      this.refreshCheckedNodes(checkedKeys, checkedNodes);
    },
    handleCheckChange(data, checked) {
      const key = data[this.nodeKey];
      if (checked && this.expandOnChecked) {
        this.expandedKeys.push(key);
      }
      if (!checked) {
        this.filterTreeChecked = this.filterTreeChecked.filter(
          (item) => item[this.nodeKey] !== key
        );
        this.initNodes = this.initNodes.filter(
          (item) => item[this.nodeKey] !== key
        );
        this.$emit("remove", key);
      }
    },
    handleCheckFilter(data, checkedObj) {
      this.filterTreeChecked = checkedObj.checkedNodes;
      this.refreshCheckedNodes();
    },
    handleFilterTreeCheckChange(data, checked) {
      const key = data[this.nodeKey];
      if (!checked) {
        this.treeObj.setChecked(key, false, true);
        this.$emit("remove", key);
      }
    },
    formatName(node) {
      const label = this.treeProps.label;
      node[label] = node[label]
        .replace(/<font color="red">/g, "")
        .replace(/<\/font>/g, "");
    },
    /**
     * 取消选中某节点（右侧列表删除节点）
     * */
    unCheckNode(key) {
      this.treeObj.setChecked(key, false, true);
      this.filterTreeChecked = this.filterTreeChecked.filter(
        (item) => item[this.nodeKey] !== key
      );
      if (this.showFilter) {
        this.filterTreeObj.setChecked(key, false, true);
      }
      this.refreshCheckedNodes();
    },
    /**
     * 清除所有节点
     * */
    clear() {
      this.treeObj.setCheckedNodes([]);
      this.filterTreeChecked = [];
      this.initNodes = [];
      if (this.showFilter) {
        this.filterTreeObj.setCheckedNodes([]);
      }
      this.refreshCheckedNodes();
    },
    /**
     * 重新获取选中的节点，渲染右侧列表
     * */
    refreshCheckedNodes(checkedKeys, checkedNodes) {
      checkedKeys = checkedKeys || this.treeObj.getCheckedKeys();
      checkedNodes = checkedNodes || this.treeObj.getCheckedNodes();

      let resultNodes = this.filterResult
        ? this.getResultByUserFilter(checkedKeys, checkedNodes)
        : this.getResultNodesInfo(checkedKeys, checkedNodes);

      this.trulyChecked = resultNodes.concat(this.initNodes);
      this.checkedKeys = resultNodes
        .map((item) => item[this.nodeKey])
        .concat(this.initKeys);
    },
    getResultByUserFilter(checkedKeys, checkedNodes) {
      let resultNodes = [];
      for (let n of checkedNodes) {
        if (this.filterResult(n)) {
          resultNodes.push(n);
          this.resetInitNodes(n);
        }
      }
      let filterNodes = this.filterTreeChecked.filter((item) => {
        const key = item[this.nodeKey];
        if (
          checkedKeys.indexOf(item[this.parentKey]) === -1 &&
          checkedKeys.indexOf(key) === -1
        ) {
          if (this.filterResult(item)) {
            this.formatName(item);
            this.resetInitNodes(item);
            return true;
          }
        }
        return false;
      });
      return resultNodes.concat(filterNodes);
    },
    resetInitNodes(node) {
      let idx = this.initKeys.indexOf(node[this.nodeKey]);
      if (idx !== -1) {
        this.initNodes.splice(idx, 1);
      }
    },
    getResultNodesInfo(checkedKeys, checkedNodes) {
      let simpleChecked = [];
      checkedNodes.forEach((node) => {
        this.resetInitNodes(node);
        let pId = node[this.parentKey];
        if (checkedKeys.indexOf(pId) === -1) {
          simpleChecked.push(node);
        }
      });
      this.filterTreeChecked.forEach((n) => {
        let key = n[this.nodeKey];
        if (
          checkedKeys.indexOf(n[this.parentKey]) === -1 &&
          checkedKeys.indexOf(key) === -1
        ) {
          this.resetInitNodes(n);
          this.formatName(n);
          simpleChecked.push(n);
        }
      });
      return simpleChecked;
    },
    /**
     * 父组件设置选中
     * */
    setChecked(nodes) {
      let checkedKeys = nodes.map((item) => item[this.nodeKey]);
      this.initNodes = nodes;
      this.checkedKeys = checkedKeys; // 用于loadNode时勾选节点
      this.treeObj.setCheckedKeys(checkedKeys); // 对于已经展开的节点，勾选
      this.filterTreeObj.setCheckedKeys(checkedKeys); // 如果当前tree是过滤树，同样勾选节点
    },
    /**
     * 设置初始值，资源树座位的单独组件使用时用该方法
     * */
    setValue(value) {
      let { parent, leaf } = value;
      parent = parent || [];
      leaf = leaf || [];
      if (parent.length) {
        for (let node of parent) {
          node.iconSkin = "org";
        }
      }
      this.expandAll = this.expandWhenHasValue;
      this.setChecked(parent.concat(leaf));
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$emit("mounted", this);
      this.treeObj = this.$refs.crossTree;
      this.filterTreeObj = this.$refs.filterTree;
    });
  },
};
</script>
<style lang="scss">
.sui-select-point-tree {
  height: 100%;
  .filter-tree-input {
    .el-input__inner:focus,
    .el-input__inner:hover,
    .el-input__icon.is-clickable:hover + .el-input__inner {
      border-color: #ccc;
    }
    .el-input__icon {
      position: absolute;
      width: 24px;
      height: 75%;
      right: 4px;
      font-size: 24px;
      text-align: center;
      color: #666;
      -webkit-transition: all 0.3s;
      transition: all 0.3s;
    }
  }
  .select-point-tree-cont {
    height: calc(100% - 32px);
    overflow: auto;
  }
  .el-tree-node__expand-icon {
    margin-left: 0;
  }
  .el-tree-node__content > .el-checkbox {
    // width: 14px;
    // margin-right: 4px;
  }
  .el-tree-node__content .el-tree-node__icon {
    background: url(./zTreeStandard.png);
    width: 20px;
    &.iconNoBg {
      background: none;
    }
    &.org {
      // background-position: -2px 0px;
      background: url(./org.png) no-repeat center;
    }
    &.cross {
      background: url(./camera.png) no-repeat center;
      // background-position: -49px 0;
    }
    &.user {
      background-position: -98px -1px;
    }
    &.place {
      background-position: -122px 0;
    }
    &.road {
      background-position: -145px 0;
    }
    &.lane {
      background-position: -169px 0;
    }
  }
}
</style>
