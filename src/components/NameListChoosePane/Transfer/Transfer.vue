<!--
 * @Description:  穿梭框组件 HUI的缺点在于 每次返回的数组都是IndexCode数组  而不是完整的JSON对象数组
  其次 当遇到分页接口回显问题时  HUI的穿梭框问题很多 但只返回IndexCode的数组其实也在性能上是有好处的
 * @Version: 
 * @Autor: wangXiaoMing
 * @Date: 2021-05-27 15:18:20
 * @LastEditors: wangXiaoMing
 * @LastEditTime: 2021-06-11 14:52:48
-->
<template>
  <div class="transfer">
    <div class="transfer-left">
      <transfer-item
        ref="transferLeft"
        v-bind="($props, $attrs)"
        :title="titles[0]"
        :filterPlaceHolder="filterPlaceHolders[0]"
        :onScrollY="
          (e) => {
            $emit('on-left-scrolling', e);
          }
        "
        :checkboxList="leftPaneData"
        @change="leftDataChange"
        :filterSearch="leftSearchMethod"
      ></transfer-item>
    </div>
    <div class="transfer-buts">
      <div>
        <el-button icon="h-icon-angle_right" @click="addToRight" />
      </div>
      <div>
        <el-button icon="h-icon-angle_left" @click="deleteToLeft" />
      </div>
    </div>
    <div class="transfer-right">
      <transfer-item
        ref="transferRight"
        v-bind="($props, $attrs)"
        :title="titles[1]"
        :filterPlaceHolder="filterPlaceHolders[1]"
        :onScrollY="
          (e) => {
            $emit('on-right-scrolling', e);
          }
        "
        :checkboxList="rightPaneData"
        @change="rightDataChange"
        :filterSearch="rightSearchMethod"
      ></transfer-item>
    </div>
  </div>
</template>

<script>
import TransferItem from "./TransferItem.vue";
export default {
  name: "Transfer",
  props: {
    titles: {
      type: Array,
      default: ["列表框", "列表框"],
    },
    filterPlaceHolders: {
      type: Array,
      default: ["请输入", "请输入"],
    },
    leftData: {
      type: Array,
      default: [],
    },
    rightData: {
      type: Array,
      default: [],
    },
    labelId: {
      type: String,
      default: "libCode",
    },
    leftSearchMethod: {
      type: Function,
      default: () => {},
    },
    rightSearchMethod: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    TransferItem,
  },
  data() {
    return {
      leftPaneData: [],
      leftCheckData: [],
      rightPaneData: [],
      rightCheckData: [],
    };
  },
  watch: {
    leftData(val) {
      /**
       * 拿到的数据这里要处理一下 因为 左右两侧属于互补的不可以出现重复数据
       */
      if (this.rightPaneData.length) {
        this.tidyArr(val);
      } else {
        this.$set(this, "leftPaneData", val);
      }
    },
    rightData(val) {
      this.$set(this, "rightPaneData", val);
      this.$nextTick(() => {
        /**稍微等一下总有好处 */
        /** 右边也要重整的原因在于如果提供了右侧默认值的话 你就得规整一下左右两侧 */
        if (this.rightPaneData.length) {
          this.tidyArr(this.leftPaneData);
        }
      });
    },
  },
  methods: {
    deleteToLeft() {
      this.rightCheckData.forEach((indexCode) => {
        for (let i = 0; i < this.rightPaneData.length; i++) {
          if (this.rightPaneData[i][this.labelId] === indexCode) {
            this.leftPaneData.unshift(this.rightPaneData[i]);
            this.rightPaneData.splice(i, 1);
            break;
          }
        }
      });
      this.$emit("change", this.rightPaneData);
    },
    addToRight() {
      this.leftCheckData.forEach((indexCode) => {
        for (let i = 0; i < this.leftPaneData.length; i++) {
          if (this.leftPaneData[i][this.labelId] === indexCode) {
            this.rightPaneData.unshift(this.leftPaneData[i]);
            this.leftPaneData.splice(i, 1);
            break;
          }
        }
      });
      this.$emit("change", this.rightPaneData);
    },
    leftDataChange(val) {
      this.$set(this, "leftCheckData", val);
    },
    rightDataChange(val) {
      this.$set(this, "rightCheckData", val);
    },
    tidyArr(val) {
      const newArr = [];
      val &&
        val.forEach((item) => {
          let flag = false;
          for (let i = 0; i < this.rightPaneData.length; i++) {
            if (item[this.labelId] === this.rightPaneData[i][this.labelId]) {
              flag = true;
              break; // 找到了就可以停了 没必要继续
            }
          }
          if (!flag) {
            newArr.push(item);
          }
        });
      this.$set(this, "leftPaneData", newArr);
    },
    clearArr() {
      this.leftPaneData = [];
      this.leftCheckData = [];
      this.rightPaneData = [];
      this.rightCheckData = [];
    },
    clearQueryAll() {
      this.$refs.transferLeft.clearQuery();
      this.$refs.transferRight.clearQuery();
    },
  },
  beforeDestroy() {
    this.clearArr();
  },
};
</script>

<style lang="scss" scoped>
.transfer {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &-left {
    width: 40%;
    height: 100%;
  }
  &-right {
    width: 40%;
    height: 100%;
  }
  &-buts {
    width: 18%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & div {
      width: 50px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 12px;
      border-color: #ebebeb;
      background-color: #f5f5f5;
      cursor: pointer;
      border-radius: 4px;
      > button {
        width: 100%;
      }
    }
  }
}
</style>