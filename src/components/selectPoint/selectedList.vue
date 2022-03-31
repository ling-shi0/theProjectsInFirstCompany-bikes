<template>
  <div class="sui-selected-list">
    <ul>
      <li v-for="(item, index) in data" :key="item[dataKey]">
        <span class="selected-point-index">{{ index + 1 }}</span>
        <span class="selected-point-name">{{ formatName(item) }}</span>
        <span class="h-icon-close" @click="removeNode(item[dataKey])"></span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "SuiSelectedList",
  componentName: "SuiSelectedList",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    dataKey: {
      type: String,
    },
    dataValue: {
      type: String,
    },
    isLeaf: {
      type: Function,
    },
  },
  methods: {
    removeNode(key) {
      this.$emit("remove", key);
    },
    formatName(node) {
      return this.isLeaf(node)
        ? node[this.dataValue]
        : `【组织】${node[this.dataValue]}`;
    },
  },
};
</script>
<style lang="scss" scoped>
.sui-selected-list {
  ul {
    list-style: none;
    li {
      padding: 6px 8px 6px 0;
      .selected-point-index {
        display: inline-block;
        width: 25px;
        height: 20px;
        line-height: 18px;
        text-align: center;
        border-radius: 2px;
        border: 1px solid #ccc;
        color: #7f7f7f;
        margin-right: 8px;
      }
      .h-icon-close {
        float: right;
        line-height: 20px;
        color: red;
        display: none;
        cursor: pointer;
      }
      &:hover {
        .h-icon-close {
          display: inline-block;
        }
      }
    }
  }
}
</style>
